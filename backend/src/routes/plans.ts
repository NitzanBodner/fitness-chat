import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const planSchema = z.object({
  title: z.string().min(1),
  days: z.array(z.object({
    name: z.string().min(1),
    order: z.number().int(),
    exercises: z.array(z.object({
      name: z.string().min(1),
      sets: z.number().int().min(1),
      reps: z.string().min(1),
      rest: z.string().min(1),
      notes: z.string().optional(),
      type: z.enum(['warm', 'main', 'cool']).optional(),
    })),
  }))
});

router.get('/', authenticate, async (req: AuthRequest, res) => {
  const plans = await prisma.plan.findMany({
    where: { userId: req.userId! },
    include: { days: { include: { exercises: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(plans);
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  const parse = planSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });

  const plan = await prisma.plan.create({
    data: {
      userId: req.userId!,
      title: parse.data.title,
      metadata: {},
      days: {
        create: parse.data.days.map((day) => ({
          name: day.name,
          order: day.order,
          exercises: {
            create: day.exercises.map((ex) => ({
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              notes: ex.notes,
              type: ex.type ?? 'main',
            }))
          }
        }))
      }
    },
    include: { days: { include: { exercises: true } } }
  });

  res.json(plan);
});

export default router;
