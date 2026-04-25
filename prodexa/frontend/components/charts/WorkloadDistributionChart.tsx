'use client';

import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

interface Props {
  developers: {
    developerLogin: string;
    commits: number;
    productivityScore: number;
  }[];
}

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#fb923c'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '0.75rem 1rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    }}>
      <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
        {d.name}
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Commits: <span style={{ fontWeight: 700, color: d.payload.fill, fontFamily: 'var(--font-mono)' }}>{d.value}</span>
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Share: <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{d.payload.percent}%</span>
      </p>
    </div>
  );
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.08) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function WorkloadDistributionChart({ developers }: Props) {
  if (!developers?.length) return (
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      No data yet
    </div>
  );

  const total = developers.reduce((sum, d) => sum + d.commits, 0);

  const data = developers
    .filter(d => d.commits > 0)
    .map((d, i) => ({
      name: d.developerLogin,
      value: d.commits,
      fill: COLORS[i % COLORS.length],
      percent: total > 0 ? Math.round((d.commits / total) * 100) : 0,
    }));

  if (!data.length) return (
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      No commit data yet
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data} cx="50%" cy="50%"
          innerRadius={55} outerRadius={85}
          paddingAngle={3} dataKey="value"
          labelLine={false} label={<CustomLabel />}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} stroke="var(--bg-card)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{value}</span>
          )}
          iconType="circle" iconSize={8}
          wrapperStyle={{ paddingTop: '0.5rem' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
