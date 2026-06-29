import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'שגיאה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-surface p-10 shadow-glow">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-accent to-accent2 text-3xl">💪</div>
          <h1 className="text-3xl font-semibold text-text">FitMind Pro</h1>
          <p className="mt-2 text-sm text-text2">מערכת אימון AI מקצועית עם פרופיל וחסכון.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <label className="block">
              <span className="text-xs uppercase tracking-[0.24em] text-text2">שם מלא</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none transition focus:border-accent"
                placeholder="השם שלך"
              />
            </label>
          )}
          <label className="block">
            <span className="text-xs uppercase tracking-[0.24em] text-text2">אימייל</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none transition focus:border-accent"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.24em] text-text2">סיסמה</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-surface2 px-4 py-3 text-text outline-none transition focus:border-accent"
              placeholder="••••••••"
            />
          </label>
          {error && <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-accent px-4 py-3 text-base font-semibold text-bg transition hover:bg-[#5fffbc] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mode === 'login' ? 'כניסה' : 'הרשמה'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-text2">
          {mode === 'login' ? 'אין לך חשבון?' : 'כבר יש לך חשבון?'}{' '}
          <button type="button" className="font-medium text-accent" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'הרשם' : 'התחבר'}
          </button>
        </div>
      </div>
    </div>
  );
}
