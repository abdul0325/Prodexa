'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { api, isAuthenticated } from '@/lib/api';
import { Notification } from '@/types';

const typeIcons: Record<string, string> = {
  PRODUCTIVITY_DROP: '⚠️',
  HIGH_DELIVERY_RISK: '🚨',
  INACTIVE_DEVELOPER: '👤',
  ANALYSIS_COMPLETE: '✅',
  SYSTEM_ALERT: '🔔',
};

const typeBadge: Record<string, string> = {
  PRODUCTIVITY_DROP: 'badge-warning',
  HIGH_DELIVERY_RISK: 'badge-danger',
  INACTIVE_DEVELOPER: 'badge-info',
  ANALYSIS_COMPLETE: 'badge-success',
  SYSTEM_ALERT: 'badge-neutral',
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/'); return; }
    loadNotifications();
  }, [filter, router]);

  async function loadNotifications() {
    try {
      const data = await api.notifications.list(filter === 'unread');
      setNotifications(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function markRead(id: string) {
    await api.notifications.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  async function markAllRead() {
    await api.notifications.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }

  async function deleteNotif(id: string) {
    await api.notifications.delete(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-content" style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: '0.75rem',
                  background: 'var(--danger)', color: 'white',
                  borderRadius: 9999, padding: '0.15rem 0.5rem',
                  fontSize: '0.8rem', fontWeight: 700,
                }}>{unreadCount}</span>
              )}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 2 }}>
              Smart alerts from your project analysis
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-hover)', borderRadius: 8, padding: '0.25rem' }}>
              {(['all', 'unread'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '0.4rem 0.875rem',
                  borderRadius: 6, border: 'none',
                  background: filter === f ? 'var(--bg-card)' : 'transparent',
                  color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.8rem', fontWeight: filter === f ? 600 : 400,
                  cursor: 'pointer', textTransform: 'capitalize',
                  boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}>{f}</button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button className="btn-secondary" onClick={markAllRead} style={{ fontSize: '0.8rem' }}>
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 80, borderRadius: 12,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
              }} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem',
            background: 'var(--bg-card)', border: '2px dashed var(--border)',
            borderRadius: 16,
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Notifications will appear here after project analysis runs
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map(notif => (
              <div key={notif.id} className="card" style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                opacity: notif.isRead ? 0.7 : 1,
                borderLeft: notif.isRead ? '1px solid var(--border)' : '3px solid var(--accent)',
                transition: 'opacity 0.2s',
              }}>
                {/* Icon */}
                <div style={{
                  fontSize: '1.5rem', minWidth: 40, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-hover)', borderRadius: 10,
                }}>{typeIcons[notif.type]}</div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {notif.title}
                    </span>
                    <span className={`badge ${typeBadge[notif.type]}`} style={{ fontSize: '0.65rem' }}>
                      {notif.type.replace(/_/g, ' ')}
                    </span>
                    {!notif.isRead && (
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: 'var(--accent)', display: 'inline-block',
                      }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                    {notif.project && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                        {notif.project.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!notif.isRead && (
                    <button onClick={() => markRead(notif.id)} style={{
                      background: 'none', border: '1px solid var(--border)',
                      borderRadius: 6, padding: '0.3rem 0.6rem',
                      fontSize: '0.75rem', color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}>Mark read</button>
                  )}
                  <button onClick={() => deleteNotif(notif.id)} style={{
                    background: 'none', border: '1px solid var(--border)',
                    borderRadius: 6, padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem', color: 'var(--danger)',
                    cursor: 'pointer',
                  }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
