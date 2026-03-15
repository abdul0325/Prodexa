'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) router.push('/projects');
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: 0.4,
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute',
        width: 600, height: 600,
        background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
        opacity: 0.07,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div className="animate-fade-in" style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: 420,
        textAlign: 'center',
        boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
      }}>
        {/* Logo */}
        <div style={{
          width: 56, height: 56,
          background: 'var(--accent)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 700, color: 'white',
          margin: '0 auto 1.5rem',
          boxShadow: '0 8px 20px rgba(99,102,241,0.4)',
        }}>P</div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Welcome to Prodexa
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          AI-powered project intelligence for software teams. Track productivity, predict risks, and optimize delivery.
        </p>

        {/* Features */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
          marginBottom: '2rem',
          textAlign: 'left',
        }}>
          {[
            { icon: '◈', text: 'Real-time GitHub activity tracking' },
            { icon: '◉', text: 'ML-powered productivity predictions' },
            { icon: '⬡', text: 'Developer leaderboard & risk alerts' },
          ].map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: 'var(--accent)', fontSize: '1rem' }}>{f.icon}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* GitHub OAuth button */}
        <a href="http://localhost:3001/auth/github" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{
            width: '100%',
            justifyContent: 'center',
            padding: '0.875rem',
            fontSize: '0.95rem',
            borderRadius: 10,
            gap: '0.75rem',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>
        </a>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
          By signing in, you agree to connect your GitHub account to Prodexa.
        </p>
      </div>
    </div>
  );
}
