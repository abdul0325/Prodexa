'use client';

const statusConfig: Record<string, { color: string; icon: string; pulse: boolean }> = {
  IDLE:      { color: 'var(--text-muted)',    icon: '◎',  pulse: false },
  QUEUED:    { color: 'var(--warning)',        icon: '⏳', pulse: true  },
  ANALYZING: { color: 'var(--accent)',         icon: '⚡', pulse: true  },
  DONE:      { color: 'var(--success)',        icon: '✓',  pulse: false },
  FAILED:    { color: 'var(--danger)',         icon: '✕',  pulse: false },
};

interface Props {
  status: string;
  message?: string;
  compact?: boolean;
}

export function AnalysisStatusBadge({ status, message, compact = false }: Props) {
  const config = statusConfig[status] || statusConfig.IDLE;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      background: 'var(--bg-hover)',
      border: `1px solid ${config.color}`,
      borderRadius: 9999,
      padding: compact ? '0.2rem 0.6rem' : '0.35rem 0.875rem',
      fontSize: compact ? '0.75rem' : '0.8rem',
    }}>
      {/* Pulsing dot for active states */}
      <span style={{
        width: 8, height: 8,
        borderRadius: '50%',
        background: config.color,
        display: 'inline-block',
        animation: config.pulse ? 'pulse 1.2s infinite' : 'none',
        boxShadow: config.pulse ? `0 0 0 0 ${config.color}` : 'none',
      }} />
      <span style={{ color: config.color, fontWeight: 600 }}>
        {config.icon} {status}
      </span>
      {message && !compact && (
        <span style={{ color: 'var(--text-secondary)', borderLeft: '1px solid var(--border)', paddingLeft: '0.5rem' }}>
          {message}
        </span>
      )}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 ${config.color}80; }
          70% { box-shadow: 0 0 0 6px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
      `}</style>
    </div>
  );
}
