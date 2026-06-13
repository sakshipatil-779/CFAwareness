import { Router } from 'express';
import { z } from 'zod';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';

export const ttsRouter = Router();

// ── Request schema ─────────────────────────────────────────────────────────────
const TtsRequestSchema = z.object({
  text:     z.string().min(1).max(5000),
  language: z.enum(['en', 'hi', 'es', 'fr', 'de', 'pt', 'ar', 'ja', 'zh']),
  userId:   z.string().min(1),
});

// ── Voice map ─────────────────────────────────────────────────────────────────
const VOICE_MAP: Record<string, { languageCode: string; name: string }> = {
  en: { languageCode: 'en-US', name: 'en-US-Journey-F'  },
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-D'  },
  es: { languageCode: 'es-US', name: 'es-US-Journey-F'  },
  fr: { languageCode: 'fr-FR', name: 'fr-FR-Wavenet-C'  },
  de: { languageCode: 'de-DE', name: 'de-DE-Wavenet-F'  },
  pt: { languageCode: 'pt-BR', name: 'pt-BR-Wavenet-E'  },
  ar: { languageCode: 'ar-XA', name: 'ar-XA-Wavenet-B'  },
  ja: { languageCode: 'ja-JP', name: 'ja-JP-Wavenet-B'  },
  zh: { languageCode: 'cmn-CN',name: 'cmn-CN-Wavenet-D' },
};

// ── Lazy-init clients (require env vars) ──────────────────────────────────────
let ttsClient: TextToSpeechClient | null = null;
let storage: Storage | null = null;

function getTtsClient(): TextToSpeechClient | null {
  try {
    if (!ttsClient) ttsClient = new TextToSpeechClient();
    return ttsClient;
  } catch {
    return null;
  }
}

function getStorage(): Storage | null {
  try {
    if (!storage) storage = new Storage();
    return storage;
  } catch {
    return null;
  }
}

// ── Route handler ──────────────────────────────────────────────────────────────
ttsRouter.post('/', async (req, res) => {
  const parsed = TtsRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { text, language, userId } = parsed.data;
  const voice   = VOICE_MAP[language] ?? VOICE_MAP.en;
  const bucket  = process.env.GCS_BUCKET_NAME;

  // ── Require GCS bucket name ────────────────────────────────────────────────
  if (!bucket) {
    console.warn('[tts] GCS_BUCKET_NAME not set — returning null audioUrl');
    res.json({ audioUrl: null, voice, message: 'TTS disabled: GCS_BUCKET_NAME not configured.' });
    return;
  }

  const client  = getTtsClient();
  const gcs     = getStorage();

  if (!client || !gcs) {
    console.warn('[tts] Could not initialise TTS/GCS clients — returning null audioUrl');
    res.json({ audioUrl: null, voice, message: 'TTS disabled: Cloud credentials not available.' });
    return;
  }

  try {
    // 1. Synthesize speech
    const [ttsResponse] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: voice.languageCode,
        name:         voice.name,
        ssmlGender:   'NEUTRAL',
      },
      audioConfig: { audioEncoding: 'MP3' },
    });

    if (!ttsResponse.audioContent) {
      throw new Error('TTS returned empty audio content');
    }

    // 2. Upload to GCS with a user-scoped path
    const filename   = `tts/${userId}/${Date.now()}.mp3`;
    const gcsFile    = gcs.bucket(bucket).file(filename);
    const audioBuffer = Buffer.isBuffer(ttsResponse.audioContent)
      ? ttsResponse.audioContent
      : Buffer.from(ttsResponse.audioContent as string, 'base64');

    await gcsFile.save(audioBuffer, {
      contentType: 'audio/mpeg',
      metadata: { cacheControl: 'private, max-age=3600' },
    });

    // 3. Generate a signed URL valid for 1 hour
    const [signedUrl] = await gcsFile.getSignedUrl({
      version: 'v4',
      action:  'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    res.json({ audioUrl: signedUrl, voice });
  } catch (err) {
    console.error('[tts] Error:', (err as Error).message);
    res.json({
      audioUrl: null,
      voice,
      message: 'TTS synthesis failed — audio unavailable.',
    });
  }
});
