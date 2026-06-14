/**
 * videoService.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Core service for parallel Veo 3.1 video generation + Cloud TTS audio synthesis.
 *
 * Architecture:
 *   1. Check GCS cache — return existing assets if already generated for this session
 *   2. In parallel:
 *      a) Veo 3.1: Submit text prompt → poll long-running operation → upload video bytes to GCS
 *      b) Cloud TTS: Synthesize localized script → upload MP3 to GCS
 *   3. Generate signed URLs (1-hour TTL) for both assets
 *   4. Return combined response with metadata
 *
 * Graceful degradation:
 *   - If Veo credentials missing → videoUrl: null (frontend uses CSS animation fallback)
 *   - If TTS credentials missing → audioUrl: null
 *   - Errors are logged and swallowed; partial results are returned
 */

import { Storage } from '@google-cloud/storage';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { GoogleGenAI } from '@google/genai';
import { getScript, type VideoTopic, type SupportedLanguage } from '../data/videoScripts';
import { selectVeoPrompt } from '../data/videoPrompts';

// ── Configuration ──────────────────────────────────────────────────────────────

const VEO_MODEL      = process.env.VEO_MODEL ?? 'veo-3.1-generate-preview';
const VIDEO_BUCKET   = process.env.GCS_VIDEO_BUCKET ?? process.env.GCS_BUCKET_NAME ?? '';
const AUDIO_BUCKET   = process.env.GCS_BUCKET_NAME ?? '';
const GCP_LOCATION   = process.env.GOOGLE_CLOUD_LOCATION ?? 'us-central1';
const GCP_PROJECT    = process.env.GOOGLE_CLOUD_PROJECT_ID ?? '';
/** Polling interval in milliseconds while waiting for Veo to finish */
const POLL_INTERVAL_MS = 5_000;
/** Maximum time to wait for Veo before giving up (3 minutes) */
const VEO_TIMEOUT_MS   = 180_000;
/** Signed URL TTL (1 hour) */
const SIGNED_URL_TTL_MS = 60 * 60 * 1000;

// ── Voice map — WaveNet voices for all 9 supported languages ──────────────────

const TTS_VOICE_MAP: Record<string, { languageCode: string; name: string; ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL' }> = {
  en: { languageCode: 'en-US', name: 'en-US-Journey-F',    ssmlGender: 'FEMALE'  }, // Studio quality
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-D',   ssmlGender: 'FEMALE'  },
  es: { languageCode: 'es-US', name: 'es-US-Journey-F',    ssmlGender: 'FEMALE'  },
  fr: { languageCode: 'fr-FR', name: 'fr-FR-Wavenet-C',   ssmlGender: 'FEMALE'  },
  de: { languageCode: 'de-DE', name: 'de-DE-Wavenet-F',   ssmlGender: 'FEMALE'  },
  pt: { languageCode: 'pt-BR', name: 'pt-BR-Wavenet-E',   ssmlGender: 'FEMALE'  },
  ar: { languageCode: 'ar-XA', name: 'ar-XA-Wavenet-B',   ssmlGender: 'FEMALE'  },
  ja: { languageCode: 'ja-JP', name: 'ja-JP-Wavenet-B',   ssmlGender: 'FEMALE'  },
  zh: { languageCode: 'cmn-CN', name: 'cmn-CN-Wavenet-D', ssmlGender: 'FEMALE'  },
};

// ── Lazy-initialized GCP clients ──────────────────────────────────────────────

let _storage: Storage | null = null;
let _ttsClient: TextToSpeechClient | null = null;
let _genAI: GoogleGenAI | null = null;

function getStorage(): Storage | null {
  if (_storage) return _storage;
  try {
    _storage = new Storage({ projectId: GCP_PROJECT || undefined });
    return _storage;
  } catch (err) {
    console.warn('[videoService] GCS client init failed:', (err as Error).message);
    return null;
  }
}

function getTtsClient(): TextToSpeechClient | null {
  if (_ttsClient) return _ttsClient;
  try {
    _ttsClient = new TextToSpeechClient();
    return _ttsClient;
  } catch (err) {
    console.warn('[videoService] TTS client init failed:', (err as Error).message);
    return null;
  }
}

function getGenAI(): GoogleGenAI | null {
  if (_genAI) return _genAI;
  const apiKey = process.env.GEMINI_API_KEY;
  const hasAdc = !!GCP_PROJECT; // Assume ADC available if project is set

  try {
    if (apiKey) {
      _genAI = new GoogleGenAI({ apiKey, vertexai: false });
    } else if (hasAdc) {
      // Use Vertex AI with Application Default Credentials
      _genAI = new GoogleGenAI({
        vertexai: true,
        project: GCP_PROJECT,
        location: GCP_LOCATION,
      });
    }
    return _genAI;
  } catch (err) {
    console.warn('[videoService] GenAI client init failed:', (err as Error).message);
    return null;
  }
}

// ── GCS helpers ───────────────────────────────────────────────────────────────

/**
 * Check if a GCS object exists without downloading it.
 */
async function gcsFileExists(bucketName: string, filePath: string): Promise<boolean> {
  const gcs = getStorage();
  if (!gcs || !bucketName) return false;
  try {
    const [exists] = await gcs.bucket(bucketName).file(filePath).exists();
    return exists;
  } catch {
    return false;
  }
}

/**
 * Upload a Buffer to GCS and return a signed URL valid for 1 hour.
 */
async function uploadToGcs(
  bucketName: string,
  filePath: string,
  data: Buffer,
  contentType: string,
): Promise<string | null> {
  const gcs = getStorage();
  if (!gcs || !bucketName) return null;

  const file = gcs.bucket(bucketName).file(filePath);

  await file.save(data, {
    contentType,
    metadata: {
      cacheControl: 'private, max-age=3600',
      'x-goog-meta-ecoquest-generated': 'true',
    },
  });

  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + SIGNED_URL_TTL_MS,
  });

  return signedUrl;
}

/**
 * Get a signed URL for an existing GCS object.
 */
async function getSignedUrl(bucketName: string, filePath: string): Promise<string | null> {
  const gcs = getStorage();
  if (!gcs || !bucketName) return null;
  try {
    const [url] = await gcs.bucket(bucketName).file(filePath).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + SIGNED_URL_TTL_MS,
    });
    return url;
  } catch {
    return null;
  }
}

// ── Veo 3.1 video generation ──────────────────────────────────────────────────

interface GenerateVideoResult {
  videoUrl: string | null;
  durationSeconds: number;
  model: string;
  promptLabel: string;
}

async function generateVeoVideo(
  topic: VideoTopic,
  sessionId: string,
  videoGcsPath: string,
): Promise<GenerateVideoResult> {
  const fallback: GenerateVideoResult = {
    videoUrl: null, durationSeconds: 0, model: VEO_MODEL, promptLabel: 'fallback',
  };

  const genAI = getGenAI();
  if (!genAI) {
    console.warn('[videoService] Veo: GenAI client not available — Veo disabled');
    return fallback;
  }

  if (!VIDEO_BUCKET) {
    console.warn('[videoService] Veo: GCS_VIDEO_BUCKET not set — cannot store video');
    return fallback;
  }

  // Check GCS cache — skip generation if we've already made this video
  if (await gcsFileExists(VIDEO_BUCKET, videoGcsPath)) {
    console.log(`[videoService] Veo: cache hit for ${videoGcsPath}`);
    const cachedUrl = await getSignedUrl(VIDEO_BUCKET, videoGcsPath);
    return {
      videoUrl: cachedUrl,
      durationSeconds: 8,
      model: VEO_MODEL,
      promptLabel: 'cached',
    };
  }

  const veoPrompt = selectVeoPrompt(topic, sessionId);
  console.log(`[videoService] Veo: submitting prompt "${veoPrompt.label}" for topic "${topic}"`);

  try {
    // Submit generation request — returns a long-running operation
    // Type definitions for Veo generation are incomplete in this SDK version
    let operation = await (genAI.models as unknown as Record<string, Function>).generateVideos({
      model: VEO_MODEL,
      prompt: veoPrompt.text,
      config: {
        aspectRatio: '16:9',
        durationSeconds: 8,
        resolution: '1080p',
        numberOfVideos: 1,
        generateAudio: false, // We supply our own TTS audio
        compressionQuality: 'best' as unknown,
      },
    }) as { done: boolean, refresh: () => Promise<unknown>, response?: { generatedVideos?: unknown[] } };

    // Poll until complete or timeout
    const deadline = Date.now() + VEO_TIMEOUT_MS;
    while (!operation.done) {
      if (Date.now() > deadline) {
        console.error('[videoService] Veo: operation timed out after 3 minutes');
        return fallback;
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      operation = await operation.refresh();
      console.log(`[videoService] Veo: polling… done=${operation.done}`);
    }

    const operationRefreshed = operation as { done: boolean, refresh: () => Promise<unknown>, response?: { generatedVideos?: unknown[] } };
    const generatedVideos = operationRefreshed.response?.generatedVideos ?? [];
    if (generatedVideos.length === 0) {
      console.error('[videoService] Veo: no videos in response');
      return fallback;
    }

    const videoBytes = generatedVideos[0];
    const videoBuffer = Buffer.from(
      typeof videoBytes === 'string' ? videoBytes : videoBytes.data ?? videoBytes,
      'base64',
    );

    const signedUrl = await uploadToGcs(
      VIDEO_BUCKET,
      videoGcsPath,
      videoBuffer,
      'video/mp4',
    );

    console.log(`[videoService] Veo: video uploaded to ${videoGcsPath}`);
    return {
      videoUrl: signedUrl,
      durationSeconds: 8,
      model: VEO_MODEL,
      promptLabel: veoPrompt.label,
    };

  } catch (err) {
    const msg = (err as Error).message;
    console.error('[videoService] Veo generation error:', msg);

    // Specific known errors
    if (msg.includes('PERMISSION_DENIED') || msg.includes('not authorized')) {
      console.warn('[videoService] Veo: API not enabled or access not granted. Enable Vertex AI Veo API in GCP Console.');
    } else if (msg.includes('RESOURCE_EXHAUSTED')) {
      console.warn('[videoService] Veo: quota exceeded');
    } else if (msg.includes('model is not found') || msg.includes('404')) {
      console.warn('[videoService] Veo: model not available in this region. Try us-central1.');
    }

    return fallback;
  }
}

// ── Cloud TTS audio generation ────────────────────────────────────────────────

interface GenerateAudioResult {
  audioUrl: string | null;
  voiceName: string;
  scriptText: string;
}

async function generateTtsAudio(
  topic: VideoTopic,
  language: SupportedLanguage,
  audioGcsPath: string,
): Promise<GenerateAudioResult> {
  const script = getScript(topic, language);
  const voice  = TTS_VOICE_MAP[language] ?? TTS_VOICE_MAP['en']!;

  const fallback: GenerateAudioResult = {
    audioUrl: null,
    voiceName: voice.name,
    scriptText: script.text,
  };

  const ttsClient = getTtsClient();
  if (!ttsClient) {
    console.warn('[videoService] TTS: client not available — TTS disabled');
    return fallback;
  }

  if (!AUDIO_BUCKET) {
    console.warn('[videoService] TTS: GCS_BUCKET_NAME not set — cannot store audio');
    return fallback;
  }

  // Check GCS cache
  if (await gcsFileExists(AUDIO_BUCKET, audioGcsPath)) {
    console.log(`[videoService] TTS: cache hit for ${audioGcsPath}`);
    const cachedUrl = await getSignedUrl(AUDIO_BUCKET, audioGcsPath);
    return { audioUrl: cachedUrl, voiceName: voice.name, scriptText: script.text };
  }

  console.log(`[videoService] TTS: synthesizing "${script.title}" in ${language} using ${voice.name}`);

  try {
    const [response] = await ttsClient.synthesizeSpeech({
      input: {
        // Use SSML for better prosody — slower pace suitable for awareness videos
        ssml: `<speak><prosody rate="slow" pitch="-1st">${escapeSSML(script.text)}</prosody></speak>`,
      },
      voice: {
        languageCode: voice.languageCode,
        name: voice.name,
        ssmlGender: voice.ssmlGender,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.92,       // Slightly slower for clarity
        pitch: -1.0,              // Slightly deeper — more cinematic feel
        volumeGainDb: 1.5,        // Slightly louder to be heard over background music
        effectsProfileId: ['headphone-class-device'],
      },
    });

    if (!response.audioContent) {
      throw new Error('TTS returned empty audio content');
    }

    const audioBuffer = Buffer.isBuffer(response.audioContent)
      ? response.audioContent
      : Buffer.from(response.audioContent as string, 'base64');

    const signedUrl = await uploadToGcs(AUDIO_BUCKET, audioGcsPath, audioBuffer, 'audio/mpeg');

    console.log(`[videoService] TTS: audio uploaded to ${audioGcsPath}`);
    return { audioUrl: signedUrl, voiceName: voice.name, scriptText: script.text };

  } catch (err) {
    console.error('[videoService] TTS error:', (err as Error).message);
    return fallback;
  }
}

/** Escape special XML characters in SSML text */
function escapeSSML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ── Main public API ───────────────────────────────────────────────────────────

export interface VideoGenerationRequest {
  topic: VideoTopic;
  language: SupportedLanguage;
  userId: string;
  sessionId: string;
}

export interface VideoGenerationResponse {
  videoUrl: string | null;
  audioUrl: string | null;
  scriptText: string;
  metadata: {
    topic: VideoTopic;
    language: SupportedLanguage;
    scriptTitle: string;
    durationSeconds: number;
    model: string;
    voiceName: string;
    promptLabel: string;
    generatedAt: number;
    fromCache: boolean;
  };
}

/**
 * Generate a localized educational video and voiceover in parallel.
 * Returns partial results on error — never throws.
 */
export async function generateLocalisedVideo(
  req: VideoGenerationRequest,
): Promise<VideoGenerationResponse> {
  const { topic, language, userId, sessionId } = req;
  const script = getScript(topic, language);

  // Deterministic GCS paths — same request always maps to same file
  const safeSessionId = sessionId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);
  const safeLang      = language.replace(/[^a-z]/g, '');
  const safeTopic     = topic.replace(/[^a-z_]/g, '');

  const videoGcsPath = `videos/${safeTopic}/universal/${safeSessionId}.mp4`;
  const audioGcsPath = `tts/video/${safeLang}/${safeTopic}/${safeSessionId}.mp3`;

  console.log(`[videoService] Starting parallel generation — topic: ${topic}, lang: ${language}, user: ${userId}`);
  const startTime = Date.now();

  // Run Veo + TTS in parallel
  const [videoResult, audioResult] = await Promise.all([
    generateVeoVideo(topic, sessionId, videoGcsPath),
    generateTtsAudio(topic, language, audioGcsPath),
  ]);

  const elapsedMs = Date.now() - startTime;
  const fromCache = videoResult.promptLabel === 'cached';

  console.log(
    `[videoService] Generation complete in ${elapsedMs}ms — ` +
    `video: ${videoResult.videoUrl ? 'OK' : 'null'}, audio: ${audioResult.audioUrl ? 'OK' : 'null'}`
  );

  return {
    videoUrl:   videoResult.videoUrl,
    audioUrl:   audioResult.audioUrl,
    scriptText: audioResult.scriptText,
    metadata: {
      topic,
      language,
      scriptTitle:     script.title,
      durationSeconds: videoResult.durationSeconds,
      model:           videoResult.model,
      voiceName:       audioResult.voiceName,
      promptLabel:     videoResult.promptLabel,
      generatedAt:     Date.now(),
      fromCache,
    },
  };
}
