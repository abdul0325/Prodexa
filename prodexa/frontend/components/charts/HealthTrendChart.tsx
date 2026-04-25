'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

interface Props {
  data: {
    activityTimestamp: string;
    productivityScore?: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const score = payload[0]?.value ?? 0;
  const color = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171';
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '0.75rem 1rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{label}</p>
      <p style={{ fontSize: '1.1rem', fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>
        {score}<span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/100</span>
      </p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
        {score >= 70 ? '✅ Healthy' : score >= 40 ? '⚠️ Moderate' : '🔴 Risky'}
      </p>
    </div>
  );
};

const CustomDot = (props: any) => {
  const { cx, cy, value } = props;
  const color = value >= 70 ? '#34d399' : value >= 40 ? '#fbbf24' : '#f87171';
  return <circle cx={cx} cy={cy} r={4} fill={color} stroke="var(--bg-card)" strokeWidth={2} />;
};

export function HealthTrendChart({ data }: Props) {
  if (!data?.length) return (
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      No trend data yet
    </div>
  );

  const formatted = data.map(d => ({
    date: new Date(d.activityTimestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    score: d.productivityScore ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={70} stroke="#34d399" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Healthy', fontSize: 10, fill: '#34d399', position: 'right' }} />
        <ReferenceLine y={40} stroke="#fbbf24" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Moderate', fontSize: 10, fill: '#fbbf24', position: 'right' }} />
        <Line
          type="monotone" dataKey="score"
          stroke="url(#lineGrad)" strokeWidth={3}
          dot={<CustomDot />} activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
