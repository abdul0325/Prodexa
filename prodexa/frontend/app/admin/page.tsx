'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { api, isAuthenticated } from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'projects' | 'logs'>('stats');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/'); return; }
    loadAll();
  }, [router]);

  async function loadAll() {
    try {
      const [s, u, p, l] = await Promise.all([
        api.admin.stats(),
        api.admin.users(),
        api.admin.projects(),
        api.admin.auditLogs(),
      ]);
      setStats(s);
      setUsers(u);
      setProjects(p);
      setAuditLogs(l.logs || []);
    } catch (e: any) {
      setError(e.message.includes('403') ? 'Access denied — Admin role required' : e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, role: string) {
    try {
      await api.admin.updateRole(userId, role);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch (e: any) { alert(e.message); }
  }

  async function handleStatusToggle(userId: string, isActive: boolean) {
    try {
      await api.admin.updateStatus(userId, !isActive);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !isActive } : u));
    } catch (e: any) { alert(e.message); }
  }

  async function handleDeleteProject(projectId: string) {
    if (!confirm('Delete this project and all its data?')) return;
    try {
      await api.admin.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (e: any) { alert(e.message); }
  }

  if (loading) return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-content" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading admin panel...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-content" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⬡</div>
          <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Change your role to ADMIN in Supabase to access this panel
          </p>
        </div>
      </main>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-content" style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Admin Panel</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 2 }}>
            Manage users, projects, and system configuration
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          {([
            { key: 'stats', label: '⬡ Overview' },
            { key: 'users', label: '◉ Users' },
            { key: 'projects', label: '◈ Projects' },
            { key: 'logs', label: '📋 Audit Logs' },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '0.625rem 1.25rem', background: 'none', border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.key ? 600 : 400,
              fontSize: '0.875rem', cursor: 'pointer', transition: 'color 0.15s',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'stats' && stats && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'TOTAL USERS', value: stats.users.total, sub: `${stats.users.active} active` },
                { label: 'TOTAL PROJECTS', value: stats.projects.total, sub: `${stats.projects.active} active` },
                { label: 'INACTIVE USERS', value: stats.users.inactive, color: 'var(--danger)' },
                { label: 'TOTAL ANALYSES', value: stats.totalAnalyses, color: 'var(--accent)' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                  {s.sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Projects</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'var(--accent-soft)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)',
                          }}>{user.name?.[0]?.toUpperCase()}</div>
                          <span style={{ fontWeight: 500 }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                        {user.email}
                      </td>
                      <td>
                        <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)} style={{
                          background: 'var(--bg-hover)', border: '1px solid var(--border)',
                          borderRadius: 6, padding: '0.25rem 0.5rem',
                          fontSize: '0.8rem', color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}>
                          <option value="MANAGER">MANAGER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td>
                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{user._count?.projects || 0}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button onClick={() => handleStatusToggle(user.id, user.isActive)} style={{
                          background: 'none',
                          border: `1px solid ${user.isActive ? 'var(--danger)' : 'var(--success)'}`,
                          borderRadius: 6, padding: '0.25rem 0.6rem',
                          fontSize: '0.75rem',
                          color: user.isActive ? 'var(--danger)' : 'var(--success)',
                          cursor: 'pointer',
                        }}>
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Projects */}
        {activeTab === 'projects' && (
          <div className="animate-fade-in">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Developers</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(proj => (
                    <tr key={proj.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600 }}>{proj.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {proj.repoUrl?.replace('https://github.com/', '')}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {proj.user?.name}
                      </td>
                      <td>
                        <span className={`badge ${proj.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>
                          {proj.status}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{proj._count?.developerActivities || 0}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(proj.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button onClick={() => handleDeleteProject(proj.id)} style={{
                          background: 'none', border: '1px solid var(--danger)',
                          borderRadius: 6, padding: '0.25rem 0.6rem',
                          fontSize: '0.75rem', color: 'var(--danger)', cursor: 'pointer',
                        }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Logs */}
        {activeTab === 'logs' && (
          <div className="animate-fade-in">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Performed By</th>
                    <th>Target</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No audit logs yet</td></tr>
                  ) : auditLogs.map(log => (
                    <tr key={log.id}>
                      <td>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                          background: 'var(--accent-soft)', color: 'var(--accent)',
                          padding: '0.2rem 0.5rem', borderRadius: 4,
                        }}>{log.action}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{log.user?.name}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {log.targetType}/{log.targetId?.slice(0, 8)}...
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
