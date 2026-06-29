import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const profileSchema = z.object({
  birthYear: z.number().int().optional(),
  birthMonth: z.number().int().min(1).max(12).optional(),
  gender: z.string().optional(),
  height: z.number().int().optional(),
  weight: z.number().optional(),
  level: z.string().optional(),
});

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    include: { profile: true, goals: true, plans: true, metrics: true, memories: true },
  });
  res.json(user);
});

router.post('/profile', authenticate, async (req: AuthRequest, res) => {
  const parse = profileSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const existing = await prisma.profile.findUnique({ where: { userId: req.userId! } });
  const data = parse.data;
  const profile = existing
    ? await prisma.profile.update({ where: { userId: req.userId! }, data })
    : await prisma.profile.create({ data: { userId: req.userId!, ...data } });

  res.json(profile);
});

export default router;
