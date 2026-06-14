import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { healthRouter }   from './routes/health';
import { analyzeRouter }  from './routes/analyze';
import { ttsRouter }      from './routes/tts';
import { translateRouter } from './routes/translate';
import { videoRouter }    from './routes/video';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT ?? '8080', 10);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173';

// ── Security middleware ──────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc:  ["'self'"],
        styleSrc:   ["'self'", "'unsafe-inline'"],
        imgSrc:     ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://generativelanguage.googleapis.com', 'https://storage.googleapis.com', 'https://aiplatform.googleapis.com'],
        mediaSrc:   ["'self'", 'https://storage.googleapis.com', 'blob:'],
        objectSrc:  ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for audio playback
  }),
);

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) in dev
      if (!origin || origin === ALLOWED_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15 minutes
  max:             200,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many requests, please try again later.' },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max:      10,         // 10 AI calls per minute per IP
  message:  { error: 'AI rate limit exceeded. Please wait a moment.' },
});

/** Strict limiter for video generation — Veo is expensive */
const videoLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max:      2,           // 2 Veo calls per minute per IP
  message:  { error: 'Video generation rate limit reached. Videos take up to 2 minutes — please wait.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

app.use(globalLimiter);

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: false }));

// ── Logging ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/health',    healthRouter);
app.use('/api/analyze',   aiLimiter,    analyzeRouter);
app.use('/api/tts',       aiLimiter,    ttsRouter);
app.use('/api/translate', translateRouter);
app.use('/api/video',     videoLimiter, videoRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Express error handlers must have exactly 4 arguments to be recognized by Express
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌿 EcoQuest backend listening on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
  });
}

export default app;
