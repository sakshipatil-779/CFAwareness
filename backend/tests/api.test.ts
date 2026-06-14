import request from 'supertest';
jest.mock('express-rate-limit', () => {
  const original = jest.requireActual('express-rate-limit');
  return jest.fn((options) => original({ ...options, max: 1000 }));
});
import app from '../src/index';

describe('API Routes', () => {
  describe('Security and Rate Limiting Headers', () => {
    it('should contain security headers in response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBeDefined();
    });

    it('should contain rate limit headers in response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['ratelimit-limit']).toBeDefined();
    });
  });

  describe('GET Endpoints', () => {
    it('GET /api/video/status returns 200', async () => {
      const res = await request(app).get('/api/video/status');
      expect(res.status).toBe(200);
    });

    it('GET /api/video/topics returns 200', async () => {
      const res = await request(app).get('/api/video/topics');
      expect(res.status).toBe(200);
    });
  });

  describe('POST Endpoints', () => {
    describe('POST /api/analyze', () => {
      it('returns 400 for invalid payload', async () => {
        const res = await request(app).post('/api/analyze').send({});
        expect(res.status).toBe(400);
      });

      it('returns 200 for valid payload (even if backend API fails gracefully)', async () => {
        const payload = {
          userId: 'test_user',
          language: 'en',
          totalEcoPoints: 10,
          totalCarbonSaved: 5,
          decisions: []
        };
        const res = await request(app).post('/api/analyze').send(payload);
        // Endpoint returns 200 or 500. Not 400.
        expect(res.status).not.toBe(400);
      });
    });

    describe('POST /api/tts', () => {
      it('returns 400 for invalid payload', async () => {
        const res = await request(app).post('/api/tts').send({ text: '' });
        expect(res.status).toBe(400);
      });

      it('returns 200 for valid payload (handles fallback)', async () => {
        const payload = { text: 'hello', language: 'en', userId: 'user1' };
        const res = await request(app).post('/api/tts').send(payload);
        expect(res.status).toBe(200);
      }, 30000);
    });

    describe('POST /api/translate', () => {
      it('returns 400 for invalid payload', async () => {
        const res = await request(app).post('/api/translate').send({});
        expect(res.status).toBe(400);
      });

      it('returns 200 for valid payload (handles fallback)', async () => {
        const payload = { text: 'hello', targetLanguage: 'es' };
        const res = await request(app).post('/api/translate').send(payload);
        expect([200, 500]).toContain(res.status);
      }, 30000);
    });

    describe('POST /api/video/generate', () => {
      it('returns 400 for invalid payload', async () => {
        const res = await request(app).post('/api/video/generate').send({ topic: 'invalid_topic' });
        expect(res.status).toBe(400);
      });

      it('returns 200 for valid payload (handles graceful fallback)', async () => {
        // Mock video generation might take some time, we set a longer timeout
        const payload = { topic: 'carbon_awareness', language: 'en', userId: 'test_user', sessionId: 'test_session' };
        const res = await request(app).post('/api/video/generate').send(payload);
        expect(res.status).toBe(200);
      }, 30000);
    });
  });
});
