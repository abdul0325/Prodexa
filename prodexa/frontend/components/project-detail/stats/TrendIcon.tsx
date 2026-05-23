'use client';

export default function TrendIcon({
  trend,
}: {
  trend: string;
}) {

  if (trend === 'improving') {
    return (
      <span
        style={{
          color: 'var(--success)',
          fontSize: '0.85rem',
        }}
      >
        ↑ Improving
      </span>
    );
  }

  if (trend === 'declining') {
    return (
      <span
        style={{
          color: 'var(--danger)',
          fontSize: '0.85rem',
        }}
      >
        ↓ Declining
      </span>
    );
  }

  return (
    <span
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}
    >
      → Stable
    </span>
  );
}