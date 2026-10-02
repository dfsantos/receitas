import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import { recipesRouter } from './routes/recipes.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/recipes', recipesRouter);

  app.use(errorHandler);

  return app;
}
