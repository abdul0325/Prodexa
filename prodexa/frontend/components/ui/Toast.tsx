'use client';

import { useState, useCallback, useEffect } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

const toastIcons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: '🔔',
};

const toastColors = {
  success: 'var(--success)',
  error: 'var(--danger)',
  warning: 'var(--warning)',
  info: 'var(--accent)',
};

// Global toast state
let addToastGlobal: ((toast: Omit<Toast, 'id'>) => void) | null = null;

export function toast(type: Toast['type'], title: string, message?: string) {
  addToastGlobal?.({ type, title, message });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
      zIndex: 9999, maxWidth: 360,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: 'var(--bg-card)',
          border: `1px solid ${toastColors[t.type]}`,
          borderLeft: `4px solid ${toastColors[t.type]}`,
          borderRadius: 10,
          padding: '0.875rem 1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          animation: 'slideIn 0.3s ease',
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        }}>
          <span style={{ fontSize: '1.1rem' }}>{toastIcons[t.type]}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              {t.title}
            </div>
            {t.message && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {t.message}
              </div>
            )}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
