import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';

interface Plan {
  id: string;
  title: string;
  days: Array<{ id: string; name: string; order: number; exercises: Array<{ id: string; name: string; sets: number; reps: string; rest: string; type: string; notes?: string }> }>;
}

export function PlanWidget() {
  const { token } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!token) return;
      const res = await api.get('/api/plans', { headers: { Authorization: `Bearer ${token}` } });
      setPlans(res.data);
    };
    fetchPlans();
  }, [token]);

  if (!plans.length) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-surface p-12 text-center text-text2 shadow-glow">
        <div className="mb-4 text-4xl">📋</div>
        <h3 className="mb-2 text-xl font-semibold text-text">אין עדיין תוכנית אימונים</h3>
        <p className="max-w-md text-sm leading-6">בקש מהמאמן שלך לבנות תוכנית אימונים, והמערכת תשמור אותה כאן.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {plans.map((plan) => (
        <div key={plan.id} className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-text">{plan.title}</h3>
              <p className="text-sm text-text2">{plan.days.length} אימונים שמורים</p>
            </div>
          </div>
          <div className="grid gap-4">
            {plan.days.map((day) => (
              <div key={day.id} className="rounded-3xl border border-white/10 bg-surface2 p-4">
                <div className="mb-3 flex items-center justify-between text-sm font-semibold text-text">
                  <span>{day.name}</span>
                  <span className="text-text3">{day.exercises.length} תרגילים</span>
                </div>
                <div className="space-y-3">
                  {day.exercises.map((exercise) => (
                    <div key={exercise.id} className="rounded-3xl bg-[#0f141d] p-4">
                      <div className="flex items-center justify-between gap-3 text-sm text-text">
                        <span>{exercise.name}</span>
                        <span>{exercise.sets}×{exercise.reps}</span>
                      </div>
                      <div className="mt-2 text-xs text-text2">מנוחה: {exercise.rest}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
