'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { id, first_name, last_name, email, role }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);  // true while checking localStorage on mount

  // On mount — rehydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tp_token');
      const savedUser = localStorage.getItem('tp_user');
      if (saved && savedUser) {
        setToken(saved);
        setUser(JSON.parse(savedUser));
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('tp_token', authToken);
    localStorage.setItem('tp_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
  }, []);

  const isAuthenticated = !!user && !!token;
  const isAdmin = isAuthenticated && (user?.role === 'admin' || user?.role === 'support');

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

// ─── AuthGuard: protects /dashboard/* routes ──────────────────
export function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-3 border-slate-200 border-t-[#5cc4eb] rounded-full mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null; // redirect happening in useEffect
  return children;
}

// ─── AdminGuard: protects /admin/* routes ─────────────────────
export function AdminGuard({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (!isAdmin) {
        router.replace('/dashboard');
      }
    }
  }, [loading, isAuthenticated, isAdmin, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-3 border-slate-200 border-t-[#5cc4eb] rounded-full mx-auto mb-3" />
          <p className="text-sm text-slate-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;
  return children;
}
