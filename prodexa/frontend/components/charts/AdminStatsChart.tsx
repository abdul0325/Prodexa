'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';

interface Props {
  stats: {
    users: { total: number; active: number; inactive: number };
    projects: { total: number; active: number; inactive: number };
    totalAnalyses: number;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '0.75rem 1rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    }}>
      <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.2rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.name}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: p.fill, fontFamily: 'var(--font-mono)' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function AdminStatsChart({ stats }: Props) {
  if (!stats) return null;

  const data = [
    {
      name: 'Users',
      Active: stats.users.active,
      Inactive: stats.users.inactive,
    },
    {
      name: 'Projects',
      Active: stats.projects.active,
      Inactive: stats.projects.inactive,
    },
    {
      name: 'Analyses',
      Active: stats.totalAnalyses,
      Inactive: 0,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={28} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-hover)' }} />
        <Legend
          wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingTop: '0.75rem' }}
          iconType="circle" iconSize={8}
        />
        <Bar dataKey="Active" fill="#818cf8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Inactive" fill="#f87171" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
