'use client';

interface Props {
  status: string;
  message?: string;
}

const config: Record<string, { color: string; bg: string; label: string; pulse: boolean }> = {
  IDLE:      { color: 'var(--text-muted)',  bg: 'var(--bg-hover)',   label: 'Idle',      pulse: false },
  QUEUED:    { color: 'var(--warning)',     bg: '#451a0320',         label: 'Queued',    pulse: true  },
  ANALYZING: { color: 'var(--accent)',      bg: 'var(--accent-soft)',label: 'Analyzing', pulse: true  },
  DONE:      { color: 'var(--success)',     bg: '#d1fae520',         label: 'Done',      pulse: false },
  FAILED:    { color: 'var(--danger)',      bg: '#fee2e220',         label: 'Failed',    pulse: false },
};

export function AnalysisStatusBar({ status, message }: Props) {
  const c = config[status] || config.IDLE;
  if (status === 'IDLE') return null;

  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.color}`,
      borderRadius: 10,
      padding: '0.75rem 1rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      marginBottom: '1rem',
      animation: 'fadeIn 0.3s ease',
    }}>
      {/* Pulsing dot */}
      <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: c.color,
          position: 'absolute',
        }} />
        {c.pulse && (
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: c.color,
            position: 'absolute',
            animation: 'ripple 1.2s infinite',
            opacity: 0.6,
          }} />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: c.color }}>
          {c.label}
        </span>
        {message && (
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
            — {message}
          </span>
        )}
      </div>

      {/* Animated progress bar for active states */}
      {c.pulse && (
        <div style={{
          width: 100, height: 4, borderRadius: 9999,
          background: 'var(--bg-hover)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 9999,
            background: c.color,
            animation: 'indeterminate 1.5s infinite ease-in-out',
            width: '40%',
          }} />
        </div>
      )}

      <style>{`
        @keyframes ripple {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(3);   opacity: 0; }
        }
        @keyframes indeterminate {
          0%   { transform: translateX(-250%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}

export function AnalysisStatusBadge({ status }: { status: string }) {
  const c = config[status] || config.IDLE;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      background: c.bg,
      border: `1px solid ${c.color}`,
      color: c.color,
      borderRadius: 9999,
      padding: '0.2rem 0.6rem',
      fontSize: '0.75rem', fontWeight: 600,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: c.color,
        animation: c.pulse ? 'pulse 1.2s infinite' : 'none',
        display: 'inline-block',
      }} />
      {c.label}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </span>
  );
}
