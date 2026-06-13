import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ecoquest-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});
