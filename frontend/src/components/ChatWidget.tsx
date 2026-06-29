import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  createdAt: string;
}

export function ChatWidget() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) return;
      const res = await api.get('/api/messages', { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data);
    };
    fetchMessages();
  }, [token]);

  const sendMessage = async () => {
    if (!input.trim() || !token) return;
    setLoading(true);
    const userText = input.trim();
    setInput('');

    try {
      const res = await api.post('/api/ai/chat', { message: userText }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, role: 'user', content: userText, createdAt: new Date().toISOString() },
        { id: `ai-${Date.now()}`, role: 'ai', content: res.data.answer, createdAt: new Date().toISOString() },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בשליחה';
      setMessages((prev) => [
        ...prev,
        { id: `ai-error-${Date.now()}`, role: 'ai', content: `שגיאה: ${errorMessage}`, createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-text">צ'אט עם המאמן</h3>
            <p className="text-sm text-text2">שוחח בעברית עם המאמן האישי וצר תוכניות חכמות.</p>
          </div>
          <span className="rounded-2xl bg-surface2 px-3 py-2 text-xs uppercase tracking-[0.24em] text-text3">AI</span>
        </div>

        <div className="space-y-4 pb-4">
          {messages.slice(-6).map((msg) => (
            <div key={msg.id} className={`rounded-3xl p-4 ${msg.role === 'user' ? 'bg-accent/10 text-accent' : 'bg-surface2 text-text2'}`}>
              <div className="text-sm font-medium">{msg.role === 'user' ? 'אתה' : 'מאמן'}</div>
              <p className="mt-2 text-sm leading-6">{msg.content}</p>
              <div className="mt-2 text-xs text-text3">{new Date(msg.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-surface2 p-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-3xl border border-white/10 bg-[#0b1018] px-4 py-3 text-text outline-none focus:border-accent"
            placeholder="שאל את המאמן שלך..."
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="mt-3 w-full rounded-3xl bg-accent px-4 py-3 text-sm font-semibold text-bg transition hover:bg-[#5fffbc] disabled:cursor-not-allowed disabled:opacity-60"
          >
            שלח
          </button>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
          <h4 className="mb-3 text-sm uppercase tracking-[0.24em] text-text2">קיצורי דרך</h4>
          <div className="grid gap-3">
            {['צור לי תוכנית PPL', 'מה כדאי לאכול לפני אימון?', 'איך לשפר סיבולת'].map((title) => (
              <button key={title} className="rounded-3xl border border-white/10 bg-surface2 px-4 py-3 text-right text-sm text-text2 transition hover:border-accent/30 hover:text-accent" onClick={() => setInput(title)}>
                {title}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
          <h4 className="mb-3 text-sm uppercase tracking-[0.24em] text-text2">טיפים</h4>
          <p className="text-sm leading-6 text-text2">מערכת זו מותאמת לשלב ראשון. בהמשך אפשר לחבר AI אמיתי, שמירת תוכניות ונתוני גוף מלאים.</p>
        </div>
      </aside>
    </div>
  );
}
