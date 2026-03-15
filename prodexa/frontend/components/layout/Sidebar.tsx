'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/api';

const navItems = [
  { href: '/projects', icon: '◈', label: 'Projects' },
  { href: '/notifications', icon: '◉', label: 'Notifications' },
  { href: '/admin', icon: '⬡', label: 'Admin' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('prodexa_theme') as 'light' | 'dark' || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    // Fetch unread notifications count
    const token = localStorage.getItem('prodexa_token');
    if (!token) return;
    fetch('http://localhost:3001/notifications/unread-count', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setUnreadCount(d.unreadCount || 0))
      .catch(() => {});
  }, []);

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
          }}>P</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Prodexa</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>PROJECT INTELLIGENCE</div>
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
              padding: '0.625rem 0.875rem',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              background: active ? 'var(--accent-soft)' : 'transparent',
              transition: 'all 0.15s',
              position: 'relative',
            }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--danger)',
                  color: 'white',
                  borderRadius: 9999,
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}>{unreadCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.625rem 0.875rem',
          borderRadius: 8, border: 'none',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem', cursor: 'pointer',
          width: '100%', textAlign: 'left',
          transition: 'background 0.15s',
        }}>
          <span>{theme === 'dark' ? '☀' : '◑'}</span>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.625rem 0.875rem',
          borderRadius: 8, border: 'none',
          background: 'transparent',
          color: 'var(--danger)',
          fontSize: '0.875rem', cursor: 'pointer',
          width: '100%', textAlign: 'left',
        }}>
          <span>→</span> Logout
        </button>
      </div>
    </aside>
  );
}
