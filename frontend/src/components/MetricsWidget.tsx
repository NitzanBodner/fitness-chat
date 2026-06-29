import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';

interface Metric {
  id: string;
  date: string;
  weight?: number;
  bmi?: number;
  fat?: number;
  muscle?: number;
}

export function MetricsWidget() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!token) return;
      const res = await api.get('/api/metrics', { headers: { Authorization: `Bearer ${token}` } });
      setMetrics(res.data);
    };
    fetchMetrics();
  }, [token]);

  const saveMetric = async () => {
    if (!token || !date) return;
    await api.post('/api/metrics', { date, weight: weight ? Number(weight) : undefined, bmi: bmi ? Number(bmi) : undefined }, { headers: { Authorization: `Bearer ${token}` } });
    setMetrics((prev) => [...prev, { id: `${Date.now()}`, date, weight: weight ? Number(weight) : undefined, bmi: bmi ? Number(bmi) : undefined }]);
    setDate('');
    setWeight('');
    setBmi('');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
        <h3 className="mb-3 text-xl font-semibold text-text">מדדי גוף</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-sm text-text2">
            תאריך
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none focus:border-accent" />
          </label>
          <label className="block text-sm text-text2">
            משקל (ק"ג)
            <input value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none focus:border-accent" />
          </label>
          <label className="block text-sm text-text2">
            BMI
            <input value={bmi} onChange={(e) => setBmi(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none focus:border-accent" />
          </label>
        </div>
        <button onClick={saveMetric} className="mt-4 rounded-3xl bg-accent px-4 py-3 text-sm font-semibold text-bg transition hover:bg-[#5fffbc]">
          שמור מדידה
        </button>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
        <h4 className="mb-4 text-base font-semibold text-text">היסטוריית מדידות</h4>
        <div className="space-y-4">
          {metrics.slice(-5).reverse().map((metric) => (
            <div key={metric.id} className="rounded-3xl border border-white/10 bg-surface2 p-4 text-sm text-text2">
              <div className="flex items-center justify-between gap-3 text-text">
                <span>{new Date(metric.date).toLocaleDateString('he-IL')}</span>
                <span>{metric.weight ?? '-'} ק"ג</span>
              </div>
              <div className="mt-2 text-xs text-text3">BMI: {metric.bmi ?? '-'}</div>
            </div>
          ))}
          {!metrics.length && <div className="text-sm text-text3">אין עדיין מדידות לשמירה.</div>}
        </div>
      </div>
    </div>
  );
}
