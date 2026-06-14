import request from 'supertest';
import app from '../src/index';

describe('Health Check', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  it('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
