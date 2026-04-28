'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { api, isAuthenticated } from '@/lib/api';
import { Notification } from '@/types';
import { NexusPulse } from '@/components/loader/NexusPulse';

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

  const loadNotifications = useCallback(async () => {
    try {
      const data = await api.notifications.list(filter === 'unread');
      setNotifications(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/'); return; }
    loadNotifications();
  }, [filter, router, loadNotifications]);

  async function markRead(id: string) {
    await api.notifications.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    // Update sidebar unread count
    updateSidebarUnreadCount();
  }

  async function markAllRead() {
    await api.notifications.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    // Update sidebar unread count
    updateSidebarUnreadCount();
  }

  async function deleteNotif(id: string) {
    await api.notifications.delete(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    // Update sidebar unread count
    updateSidebarUnreadCount();
  }

  // Function to update sidebar unread count
  function updateSidebarUnreadCount() {
    const token = localStorage.getItem('prodexa_token');
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        // Dispatch custom event to update sidebar
        window.dispatchEvent(new CustomEvent('notificationCountUpdate', { detail: d.unreadCount || 0 }));
      })
      .catch(() => {});
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content page-main">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '2rem' }}>
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
          <div className="page-actions">
            <div className="filter-chip-group">
              {(['all', 'unread'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className="filter-chip" style={{
                  background: filter === f ? 'var(--bg-card)' : 'transparent',
                  color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: filter === f ? 600 : 400,
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem 0' }}>
            <NexusPulse size="medium" showText={true} text="Loading notifications..." />
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Notifications will appear here after project analysis runs
            </p>
          </div>
        ) : (
          <div className="section-gap" style={{ gap: '0.75rem' }}>
            {notifications.map(notif => (
              <div key={notif.id} className="card notif-card" style={{
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
                <div className="notif-card-content" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span className="wrap-anywhere" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
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
                  <p className="wrap-anywhere" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                    {notif.project && (
                      <span className="wrap-anywhere" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                        {notif.project.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="notif-card-actions" style={{ display: 'flex', gap: '0.5rem' }}>
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
