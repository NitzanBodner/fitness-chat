import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';

export function ProfileWidget() {
  const { token } = useAuth();
  const [form, setForm] = useState({ birthMonth: '', birthYear: '', gender: '', height: '', weight: '', level: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      const res = await api.get('/api/user/me', { headers: { Authorization: `Bearer ${token}` } });
      const profile = res.data.profile || {};
      setForm({
        birthMonth: profile.birthMonth ?? '',
        birthYear: profile.birthYear ?? '',
        gender: profile.gender ?? '',
        height: profile.height ?? '',
        weight: profile.weight ?? '',
        level: profile.level ?? '',
      });
    };
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    await api.post('/api/user/profile', {
      birthMonth: form.birthMonth ? Number(form.birthMonth) : undefined,
      birthYear: form.birthYear ? Number(form.birthYear) : undefined,
      gender: form.gender || undefined,
      height: form.height ? Number(form.height) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      level: form.level || undefined,
    }, { headers: { Authorization: `Bearer ${token}` } });
    setLoading(false);
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
      <h3 className="mb-4 text-xl font-semibold text-text">פרופיל כושר</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-text2">
          גיל (חודש)
          <input className="mt-2 w-full rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none focus:border-accent" value={form.birthMonth} onChange={(e) => setForm({ ...form, birthMonth: e.target.value })} />
        </label>
        <label className="block text-sm text-text2">
          גיל (שנה)
          <input className="mt-2 w-full rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none focus:border-accent" value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: e.target.value })} />
        </label>
        <label className="block text-sm text-text2">
          מין
          <select className="mt-2 w-full rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none focus:border-accent" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="">בחר</option>
            <option value="זכר">זכר</option>
            <option value="נקבה">נקבה</option>
          </select>
        </label>
        <label className="block text-sm text-text2">
          רמת פעילות
          <select className="mt-2 w-full rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none focus:border-accent" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
            <option value="">בחר</option>
            <option value="מתחיל">מתחיל</option>
            <option value="בינוני">בינוני</option>
            <option value="מתקדם">מתקדם</option>
            <option value="אתלט">אתלט</option>
          </select>
        </label>
        <label className="block text-sm text-text2">
          משקל (ק"ג)
          <input className="mt-2 w-full rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none focus:border-accent" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
        </label>
        <label className="block text-sm text-text2">
          גובה (ס"מ)
          <input className="mt-2 w-full rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none focus:border-accent" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
        </label>
      </div>
      <button onClick={handleSave} disabled={loading} className="mt-6 w-full rounded-3xl bg-accent px-4 py-3 text-sm font-semibold text-bg transition hover:bg-[#5fffbc] disabled:cursor-not-allowed disabled:opacity-60">
        שמור פרופיל
      </button>
    </div>
  );
}
