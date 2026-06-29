import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const metricSchema = z.object({
  date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), { message: 'Invalid date' }),
  weight: z.number().optional(),
  bmi: z.number().optional(),
  fat: z.number().optional(),
  muscle: z.number().optional(),
  waist: z.number().optional(),
  chest: z.number().optional(),
  arms: z.number().optional(),
  bp: z.string().optional(),
});

router.get('/', authenticate, async (req: AuthRequest, res) => {
  const metrics = await prisma.metric.findMany({ where: { userId: req.userId! }, orderBy: { date: 'asc' } });
  res.json(metrics);
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  const parse = metricSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const metric = await prisma.metric.upsert({
    where: { userId_date: { userId: req.userId!, date: new Date(parse.data.date) } },
    update: { ...parse.data },
    create: { userId: req.userId!, ...parse.data },
  });

  res.json(metric);
});

export default router;
