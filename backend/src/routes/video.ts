/**
 * video.ts — Express router for POST /api/video/generate
 *
 * Accepts a topic + language, triggers parallel Veo 3.1 video generation
 * and Cloud TTS audio synthesis, and returns signed GCS URLs.
 *
 * Rate limit: 2 requests/minute per IP (enforced in index.ts)
 * Timeout:    5 minutes (Veo can take up to 3 minutes for 1080p video)
 */

import { Router } from 'express';
import { z } from 'zod';
import { generateLocalisedVideo } from '../services/videoService';
import { VIDEO_SCRIPTS, type VideoTopic, type SupportedLanguage } from '../data/videoScripts';

export const videoRouter = Router();

// ── Request validation schema ──────────────────────────────────────────────────

const SUPPORTED_TOPICS = [
  'carbon_awareness',
  'green_city',
  'transport',
  'energy',
  'waste',
] as const;

const SUPPORTED_LANGUAGES = [
  'en', 'hi', 'es', 'fr', 'de', 'pt', 'ar', 'ja', 'zh',
] as const;

const VideoRequestSchema = z.object({
  /** Which awareness topic to generate video for */
  topic: z.enum(SUPPORTED_TOPICS).default('carbon_awareness'),
  /** User's current language */
  language: z.enum(SUPPORTED_LANGUAGES).default('en'),
  /** User identifier (for GCS path scoping and logging) */
  userId: z.string().min(1).max(128).default('anonymous'),
  /**
   * Session identifier — used for deterministic GCS caching.
   * Same sessionId + topic + language → returns same video instantly.
   */
  sessionId: z.string().min(1).max(128).default(() => `session_${Date.now()}`),
});

type VideoRequest = z.infer<typeof VideoRequestSchema>;

// ── Health probe for video service ────────────────────────────────────────────

videoRouter.get('/status', (_req, res) => {
  res.json({
    service: 'video-generation',
    veoModel: process.env.VEO_MODEL ?? 'veo-3.1-generate-preview',
    veoEnabled: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_CLOUD_PROJECT_ID),
    ttsEnabled: !!process.env.GCS_BUCKET_NAME,
    gcsVideoBucket: process.env.GCS_VIDEO_BUCKET ?? null,
    gcsTtsBucket: process.env.GCS_BUCKET_NAME ?? null,
    supportedTopics: SUPPORTED_TOPICS,
    supportedLanguages: SUPPORTED_LANGUAGES,
  });
});

// ── GET variant for convenience (e.g., direct browser testing) ────────────────

videoRouter.get('/generate', (req, res) => {
  const parsed = VideoRequestSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query parameters', details: parsed.error.flatten() });
    return;
  }
  void handleGenerate(parsed.data, res);
});

// ── POST — primary endpoint ───────────────────────────────────────────────────

videoRouter.post('/generate', (req, res) => {
  const parsed = VideoRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
    return;
  }
  void handleGenerate(parsed.data, res);
});

// ── Core handler ──────────────────────────────────────────────────────────────

async function handleGenerate(data: VideoRequest, res: import('express').Response): Promise<void> {
  const { topic, language, userId, sessionId } = data;

  console.log(
    `[video] POST /generate — topic: ${topic}, lang: ${language}, ` +
    `userId: ${userId.slice(0, 16)}…, session: ${sessionId.slice(0, 16)}…`
  );

  try {
    const result = await generateLocalisedVideo({
      topic:      topic as VideoTopic,
      language:   language as SupportedLanguage,
      userId,
      sessionId,
    });

    // Return 200 even when both URLs are null — let the frontend handle degradation
    res.status(200).json({
      success: true,
      ...result,
    });

  } catch (err) {
    // Should never reach here — service layer swallows all errors
    console.error('[video] Unexpected error in handler:', (err as Error).message);
    res.status(500).json({
      success: false,
      videoUrl:   null,
      audioUrl:   null,
      scriptText: '',
      error:      'Video generation failed unexpectedly. Please try again.',
    });
  }
}

// ── List available topics + sample scripts ────────────────────────────────────

videoRouter.get('/topics', (req, res) => {
  const lang = (req.query.language as string) ?? 'en';

  const topics = SUPPORTED_TOPICS.map((t) => ({
    id: t,
    title: VIDEO_SCRIPTS[t]?.[lang as SupportedLanguage]?.title
        ?? VIDEO_SCRIPTS[t]?.['en']?.title
        ?? t,
    previewText: (VIDEO_SCRIPTS[t]?.[lang as SupportedLanguage]?.text
        ?? VIDEO_SCRIPTS[t]?.['en']?.text
        ?? '').slice(0, 120) + '…',
  }));

  res.json({ topics, supportedLanguages: SUPPORTED_LANGUAGES });
});
