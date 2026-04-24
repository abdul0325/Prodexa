'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/api';
import { useRealtimeNotifications } from '@/hooks/useSocket';
import { toast } from '@/components/ui/Toast';

const navItems = [
  { href: '/projects',      icon: '◈', label: 'Projects'      },
  { href: '/notifications', icon: '◉', label: 'Notifications' },
  { href: '/admin',         icon: '⬡', label: 'Admin'         },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [theme, setTheme]           = useState<'light' | 'dark'>('dark');
  const [unreadCount, setUnreadCount] = useState(0);

  // Load theme
  useEffect(() => {
    const saved = (localStorage.getItem('prodexa_theme') as 'light' | 'dark') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  // Load initial unread count
  useEffect(() => {
    const token = localStorage.getItem('prodexa_token');
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setUnreadCount(d.unreadCount || 0))
      .catch(() => {});
  }, []);

  // Real-time notification handler
  const handleNewNotif = useCallback((notif: any) => {
    setUnreadCount(prev => prev + 1);
    toast('info', notif.title, notif.message);
  }, []);

  useRealtimeNotifications(handleNewNotif);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('prodexa_theme', next);
  }

  function handleLogout() {
    clearToken();
    router.push('/');
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 700, color: 'white',
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>P</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Prodexa</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              PROJECT INTELLIGENCE
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.875rem', borderRadius: 8,
              textDecoration: 'none', fontSize: '0.875rem',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              background: active ? 'var(--accent-soft)' : 'transparent',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>

              {/* Live unread badge on Notifications */}
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span style={{
                  background: 'var(--danger)', color: 'white',
                  borderRadius: 9999, padding: '0.1rem 0.45rem',
                  fontSize: '0.7rem', fontWeight: 700,
                  animation: 'badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                }}>{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <button onClick={toggleTheme} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.625rem 0.875rem', borderRadius: 8,
          border: 'none', background: 'transparent',
          color: 'var(--text-secondary)', fontSize: '0.875rem',
          cursor: 'pointer', width: '100%', textAlign: 'left',
        }}>
          <span>{theme === 'dark' ? '☀' : '◑'}</span>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.625rem 0.875rem', borderRadius: 8,
          border: 'none', background: 'transparent',
          color: 'var(--danger)', fontSize: '0.875rem',
          cursor: 'pointer', width: '100%', textAlign: 'left',
        }}>
          <span>→</span> Logout
        </button>
      </div>

      <style>{`
        @keyframes badgePop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
      `}</style>
    </aside>
  );
}
