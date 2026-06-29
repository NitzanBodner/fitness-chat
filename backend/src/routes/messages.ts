import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const messageSchema = z.object({ content: z.string().min(1) });

router.get('/', authenticate, async (req: AuthRequest, res) => {
  const messages = await prisma.message.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'asc' },
  });
  res.json(messages);
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  const parse = messageSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const message = await prisma.message.create({
    data: { userId: req.userId!, role: 'user', content: parse.data.content },
  });

  res.json(message);
});

export default router;
