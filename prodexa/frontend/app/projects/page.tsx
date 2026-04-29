'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { api, isAuthenticated } from '@/lib/api';
import { Project } from '@/types';
import { RefreshCw, FolderOpen } from 'lucide-react';
import { NexusPulse } from '@/components/loader/NexusPulse';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [form, setForm] = useState({ name: '', repoUrl: '', ownerName: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { 
      router.push('/'); 
      return; 
    }
    loadProjects();
  }, [router]);

  // Reset navigation state when component mounts
  useEffect(() => {
    setNavigating(false);
  }, []);

  async function loadProjects() {
    try {
      const data = await api.projects.list();
      setProjects(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await api.projects.create(form);
      setShowModal(false);
      setForm({ name: '', repoUrl: '', ownerName: '' });
      loadProjects();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleAnalyze(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.projects.analyze(id);
      alert('Analysis started! Check back in a moment.');
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content page-main">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Projects</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 2 }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''} connected
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)} style={{ whiteSpace: 'nowrap' }}>
            + New Project
          </button>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2', border: '1px solid #fca5a5',
            borderRadius: 8, padding: '0.75rem 1rem',
            color: '#991b1b', fontSize: '0.875rem', marginBottom: '1rem'
          }}>{error}</div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <NexusPulse size="small" showText={true} text="Loading Projects..." />
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <FolderOpen size={48} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No projects yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Connect a GitHub repository to start tracking productivity
            </p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              + Add Your First Project
            </button>
          </div>
        ) : (
          <div className="card-grid">
            {projects.map(project => (
              <div key={project.id} className="card" style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/projects/${project.id}`)}>
                {/* Status dot */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className={`badge ${project.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>
                    {project.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {project.name}
                </h3>
                <p className="wrap-anywhere" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
                  {project.repoUrl.replace('https://github.com/', '')}
                </p>

                <div className="card-actions">
                  <button className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNavigating(true);
                      router.push(`/projects/${project.id}`);
                    }}>
                    {navigating ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>Loading...</span>
                      </div>
                    ) : 'View Dashboard'}
                  </button>
                  <button className="btn-secondary"
                    onClick={(e) => handleAnalyze(project.id, e)}>
                    <RefreshCw size={14} style={{ marginRight: '0.25rem' }} />
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 16, padding: '2rem',
            width: 'calc(100% - 2rem)', maxWidth: 460, maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto',
            animation: 'fadeIn 0.2s ease',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
              Add New Project
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Connect a GitHub repository to start tracking
            </p>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  PROJECT NAME
                </label>
                <input className="input" placeholder="e.g. My Awesome App"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  GITHUB REPO URL
                </label>
                <input className="input" placeholder="https://github.com/owner/repo"
                  value={form.repoUrl} onChange={e => setForm({ ...form, repoUrl: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  OWNER NAME
                </label>
                <input className="input" placeholder="GitHub username or org"
                  value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })} required />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={creating}>
                  {creating ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <NexusPulse size="small" showText={false} />
                      <span>Creating...</span>
                    </div>
                  ) : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
    </div>
  );
}
