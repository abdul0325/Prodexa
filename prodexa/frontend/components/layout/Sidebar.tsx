'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/api';
import { useRealtimeNotifications } from '@/hooks/useSocket';
import { toast } from '@/components/ui/Toast';
import { FolderOpen, Bell, Settings, X, Menu, ChevronLeft, ChevronRight, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const navItems = [
  { href: '/projects',      icon: <FolderOpen size={18} />, label: 'Projects'      },
  { href: '/notifications', icon: <Bell size={18} />, label: 'Notifications' },
  { href: '/admin',         icon: <Settings size={18} />, label: 'Admin'         },
];

type RealtimeNotification = {
  title: string;
  message: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);


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

  // Listen for notification count updates
  useEffect(() => {
    const handleNotificationCountUpdate = (event: CustomEvent) => {
      setUnreadCount(event.detail);
    };

    window.addEventListener('notificationCountUpdate', handleNotificationCountUpdate as EventListener);
    
    return () => {
      window.removeEventListener('notificationCountUpdate', handleNotificationCountUpdate as EventListener);
    };
  }, []);

  // Real-time notification handler
  const handleNewNotif = useCallback((notif: RealtimeNotification) => {
    setUnreadCount(prev => prev + 1);
    toast('info', notif.title, notif.message);
  }, []);

  useRealtimeNotifications(handleNewNotif);

  // Responsive sidebar behavior
  useEffect(() => {
    const media = window.matchMedia('(max-width: 1024px)');

    const applyState = (mobile: boolean) => {
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
        setIsCollapsed(false);
      } else {
        setIsOpen(true);
        // Don't reset collapsed state on desktop - preserve user preference
      }
    };

    applyState(media.matches);

    const onChange = (event: MediaQueryListEvent) => applyState(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // Keep body classes in sync so main content layout updates globally
  useEffect(() => {
    document.body.classList.toggle('sidebar-mobile-open', isMobile && isOpen);
    document.body.classList.toggle('sidebar-desktop-collapsed', !isMobile && isCollapsed);

    return () => {
      document.body.classList.remove('sidebar-mobile-open');
      document.body.classList.remove('sidebar-desktop-collapsed');
    };
  }, [isMobile, isOpen, isCollapsed]);


  function handleLogout() {
    clearToken();
    router.push('/');
  }

  function handleToggleSidebar() {
    if (isMobile) {
      setIsOpen(prev => !prev);
      return;
    }
    setIsCollapsed(prev => !prev);
  }

  const collapsed = !isMobile && isCollapsed;

  return (
    <>
      {isMobile && (
        <button
          onClick={handleToggleSidebar}
          className="sidebar-toggle mobile"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {isMobile && isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar ${isMobile ? 'mobile' : 'desktop'} ${isOpen ? 'open' : 'closed'} ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 700, color: 'white',
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>P</div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Prodexa</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                PROJECT INTELLIGENCE
              </div>
            </div>
          )}
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
              justifyContent: collapsed ? 'center' : 'flex-start',
              textDecoration: 'none', fontSize: '0.875rem',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              background: active ? 'var(--accent-soft)' : 'transparent',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}

              {/* Live unread badge on Notifications */}
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span style={{
                  background: 'var(--danger)', 
                  color: 'white',
                  borderRadius: 9999, 
                  padding: collapsed ? '0.15rem 0.3rem' : '0.1rem 0.45rem',
                  fontSize: collapsed ? '0.65rem' : '0.7rem', 
                  fontWeight: 700,
                  animation: 'badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  position: collapsed ? 'absolute' : 'relative',
                  top: collapsed ? '-0.25rem' : 'auto',
                  right: collapsed ? '-0.25rem' : 'auto',
                  minWidth: collapsed ? '1.2rem' : 'auto',
                  height: collapsed ? '1.2rem' : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
          cursor: 'pointer', width: '100%', textAlign: 'left', justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
        </button>

        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.625rem 0.875rem', borderRadius: 8,
          border: 'none', background: 'transparent',
          color: 'var(--danger)', fontSize: '0.875rem',
          cursor: 'pointer', width: '100%', textAlign: 'left', justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <LogOut size={18} /> {!collapsed && 'Logout'}
        </button>
      </div>

      {/* Desktop toggle button - positioned absolutely outside sidebar */}
      {!isMobile && (
        <button
          onClick={handleToggleSidebar}
          className="sidebar-toggle-internal"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

        <style>{`
          @keyframes badgePop {
            from { transform: scale(0); }
            to   { transform: scale(1); }
          }
        `}</style>
      </aside>
    </>
  );
}
