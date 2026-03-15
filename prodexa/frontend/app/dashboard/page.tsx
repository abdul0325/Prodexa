'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { saveToken } from '@/lib/api';

function DashboardRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      saveToken(token);
      router.replace('/projects');
    } else {
      router.replace('/');
    }
  }, [searchParams, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid var(--accent)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem',
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Signing you in...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardRedirect />
    </Suspense>
  );
}
