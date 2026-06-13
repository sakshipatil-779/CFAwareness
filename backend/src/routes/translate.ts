import { Router } from 'express';
import { z } from 'zod';
import { TranslationServiceClient } from '@google-cloud/translate';

export const translateRouter = Router();

// ── Request schema ─────────────────────────────────────────────────────────────
const TranslateRequestSchema = z.object({
  text:           z.string().min(1).max(10000),
  targetLanguage: z.enum(['en', 'hi', 'es']),
  sourceLanguage: z.enum(['en', 'hi', 'es']).optional(),
});

// ── BCP-47 language code map ───────────────────────────────────────────────────
const LANG_CODE: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  es: 'es',
};

// ── Lazy-init client ──────────────────────────────────────────────────────────
let translateClient: TranslationServiceClient | null = null;

function getTranslateClient(): TranslationServiceClient | null {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  if (!projectId) return null;
  try {
    if (!translateClient) translateClient = new TranslationServiceClient();
    return translateClient;
  } catch {
    return null;
  }
}

// ── Route handler ──────────────────────────────────────────────────────────────
translateRouter.post('/', async (req, res) => {
  const parsed = TranslateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { text, targetLanguage, sourceLanguage } = parsed.data;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const client    = getTranslateClient();

  // ── Graceful fallback if not configured ───────────────────────────────────
  if (!client || !projectId) {
    console.warn('[translate] GOOGLE_CLOUD_PROJECT_ID not set or client init failed — returning original text');
    res.json({
      translatedText:          text,
      detectedSourceLanguage:  sourceLanguage ?? 'en',
      message:                 'Translation disabled: GOOGLE_CLOUD_PROJECT_ID not configured.',
    });
    return;
  }

  try {
    const location = 'global';
    const parent   = `projects/${projectId}/locations/${location}`;

    const [response] = await client.translateText({
      parent,
      contents:           [text],
      mimeType:           'text/plain',
      sourceLanguageCode: sourceLanguage ? LANG_CODE[sourceLanguage] : undefined,
      targetLanguageCode: LANG_CODE[targetLanguage],
    });

    const translation = response.translations?.[0];
    res.json({
      translatedText:         translation?.translatedText ?? text,
      detectedSourceLanguage: translation?.detectedLanguageCode ?? sourceLanguage ?? 'en',
    });
  } catch (err) {
    console.error('[translate] Error:', (err as Error).message);
    // Return original text on error — client will handle gracefully
    res.status(500).json({
      error:         'Translation failed',
      translatedText: text,
      detectedSourceLanguage: sourceLanguage ?? 'en',
    });
  }
});
