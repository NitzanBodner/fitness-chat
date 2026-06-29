import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import messageRoutes from './routes/messages';
import planRoutes from './routes/plans';
import metricRoutes from './routes/metrics';
import aiRoutes from './routes/ai';
import { prisma } from './lib/prisma';

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

// Configure CORS for both local and production
const allowedOrigins = [
  'http://localhost:5173',           // Local dev
  'http://localhost:3000',           // Alt local
  'https://fitmind-fitness.netlify.app',  // Netlify
  process.env.FRONTEND_URL,          // Custom domain (if set)
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.get('/', (_, res) => res.send({ status: 'ok', service: 'fitmind-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/ai', aiRoutes);

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, async () => {
  console.log(`FitMind backend running on http://localhost:${port}`);
  try {
    await prisma.$connect();
    console.log('Connected to database');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});
