import { useMemo, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { ChatWidget } from '../components/ChatWidget';
import { ProfileWidget } from '../components/ProfileWidget';
import { PlanWidget } from '../components/PlanWidget';
import { MetricsWidget } from '../components/MetricsWidget';

const tabs = [
  { id: 'chat', label: 'מאמן AI' },
  { id: 'plan', label: 'תוכנית אימונים' },
  { id: 'metrics', label: 'מדדי גוף' },
];

type TabId = 'chat' | 'plan' | 'metrics';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('chat');

  const activeContent = useMemo(() => {
    switch (activeTab) {
      case 'chat':
        return <ChatWidget />;
      case 'plan':
        return <PlanWidget />;
      case 'metrics':
        return <MetricsWidget />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,255,176,0.12),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(124,111,255,0.15),_transparent_20%),linear-gradient(180deg,#080a0f_0%,#06101a_100%)] text-text">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-surface/90 p-6 shadow-glow backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-lg font-semibold text-accent">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-accent to-accent2 text-2xl">💪</span>
              FitMind Pro
            </div>
            <p className="mt-2 text-sm text-text2">מערכת כושר חכמה עם דאטה, פרופיל, ותוכנית אימונים.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-sm text-text2 shadow-sm">
              <div className="font-semibold text-text">{user?.name}</div>
              <div className="text-xs">{user?.email}</div>
            </div>
            <button onClick={logout} className="rounded-3xl border border-[#ff4f6a]/20 bg-[#0f131a] px-4 py-3 text-sm text-[#ff8696] transition hover:border-[#ff4f6a] hover:text-[#ff4f6a]">
              יציאה
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
            <h2 className="mb-5 text-sm uppercase tracking-[0.28em] text-text2">ראשי</h2>
            <nav className="space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`w-full rounded-3xl px-4 py-4 text-right text-sm font-medium transition ${
                    activeTab === tab.id ? 'bg-accent/10 text-accent' : 'border border-white/5 bg-surface2 text-text2 hover:border-accent/20 hover:text-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 rounded-3xl bg-surface2 p-5 text-sm text-text2">
              <div className="mb-3 text-xs uppercase tracking-[0.28em] text-text3">סטטוס מהיר</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-surface p-4">
                  <div className="text-2xl font-semibold text-accent">0</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.24em] text-text3">הודעות</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-surface p-4">
                  <div className="text-2xl font-semibold text-accent">0</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.24em] text-text3">ימי אימון</div>
                </div>
              </div>
            </div>
          </aside>

          <main className="rounded-[36px] border border-white/10 bg-surface p-6 shadow-glow">{activeContent}</main>
        </div>

        <footer className="text-center text-sm text-text2">FitMind Pro — גרסת דמו מקצועית</footer>
      </div>
    </div>
  );
}
