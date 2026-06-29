import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import { getAiReply } from '../services/aiService';
import { prisma } from '../lib/prisma';

const router = Router();

const aiRequestSchema = z.object({
  message: z.string().min(1),
});

router.post('/chat', authenticate, async (req: AuthRequest, res) => {
  const parse = aiRequestSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const userMessage = parse.data.message;
  await prisma.message.create({
    data: { userId: req.userId!, role: 'user', content: userMessage },
  });

  const answer = await getAiReply(userMessage, `אתה FitMind — מאמן כושר AI מקצועי. השב בעברית בטון חם ומעודד.`);

  await prisma.message.create({
    data: { userId: req.userId!, role: 'ai', content: answer },
  });

  res.json({ answer });
});

export default router;
