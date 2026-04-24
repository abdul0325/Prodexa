'use client';

import { useState, useCallback, useEffect } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

const icons = { success: '✅', error: '❌', warning: '⚠️', info: '🔔' };
const colors = {
  success: 'var(--success)',
  error: 'var(--danger)',
  warning: 'var(--warning)',
  info: 'var(--accent)',
};

// Global trigger function
let _addToast: ((t: Omit<Toast, 'id'>) => void) | null = null;

export function toast(type: Toast['type'], title: string, message?: string) {
  _addToast?.({ type, title, message });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { ...t, id }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 4500);
  }, []);

  useEffect(() => {
    _addToast = add;
    return () => { _addToast = null; };
  }, [add]);

  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
      zIndex: 9999, maxWidth: 360, width: '100%',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: 'var(--bg-card)',
          border: `1px solid ${colors[t.type]}`,
          borderLeft: `4px solid ${colors[t.type]}`,
          borderRadius: 10,
          padding: '0.875rem 1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
          animation: 'toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icons[t.type]}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              {t.title}
            </div>
            {t.message && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                {t.message}
              </div>
            )}
          </div>
          <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} style={{
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontSize: '1rem', padding: 0, flexShrink: 0,
          }}>✕</button>
        </div>
      ))}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(100%) scale(0.8); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
