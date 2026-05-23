'use client';

export default function HealthBar({
  score,
}: {
  score: number;
}) {

  const color =
    score >= 70
      ? 'var(--success)'
      : score >= 40
        ? 'var(--warning)'
        : 'var(--danger)';

  return (
    <div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >

        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          Health Score
        </span>

        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {score}/100
        </span>

      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${score}%`,
            background: color,
          }}
        />
      </div>

    </div>
  );
}