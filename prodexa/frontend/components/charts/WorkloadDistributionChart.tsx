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
      {`${(percent ).toFixed(0)}%`}
    </text>
  );
};

export function WorkloadDistributionChart({ developers }: Props) {
  if (!developers?.length) return (
    <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ fontSize: '2rem' }}>🥧</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>No Workload Data</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Run an analysis to see developer workload distribution</div>
      </div>
    </div>
  );

  const filteredDevelopers = developers
    .filter(d => d.commits > 0)
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 6); // Limit to top 6 developers for better visualization

  const total = filteredDevelopers.reduce((sum, d) => sum + d.commits, 0);

  const data = filteredDevelopers.map((d, i) => {
    const percentage = total > 0 ? (d.commits / total) * 100 : 0;
    return {
      name: d.developerLogin.length > 10 ? d.developerLogin.slice(0, 10) + '…' : d.developerLogin,
      value: d.commits,
      fill: COLORS[i % COLORS.length],
      percent: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    };
  });

  if (!data.length) return (
    <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ fontSize: '2rem' }}>🥧</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>No Commit Data</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No commits found for workload distribution</div>
      </div>
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data} cx="50%" cy="50%"
          innerRadius={45} outerRadius={75}
          paddingAngle={2} dataKey="value"
          labelLine={false} label={<CustomLabel />}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} stroke="var(--bg-card)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{value}</span>
          )}
          iconType="circle" iconSize={6}
          wrapperStyle={{ paddingTop: '0.25rem' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
