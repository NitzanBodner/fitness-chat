import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('fitmind_token');
    const savedUser = localStorage.getItem('fitmind_user');
    if (saved) setToken(saved);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('fitmind_token', res.data.token);
    localStorage.setItem('fitmind_user', JSON.stringify(res.data.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('fitmind_token', res.data.token);
    localStorage.setItem('fitmind_user', JSON.stringify(res.data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fitmind_token');
    localStorage.removeItem('fitmind_user');
  };

  const value = { token, user, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
