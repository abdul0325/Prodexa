'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';

interface Props {
  developers: {
    developerLogin: string;
    commits: number;
    prs?: number;
    pullRequestCount?: number;
    issues?: number;
    issueCount?: number;
    productivityScore: number;
  }[];
}

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#fb923c'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '0.875rem 1rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: 160,
    }}>
      <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
        {label}
      </p>
      {[
        { label: 'Score', value: d?.score, color: '#818cf8' },
        { label: 'Commits', value: d?.commits, color: '#34d399' },
        { label: 'PRs', value: d?.prs, color: '#fbbf24' },
        { label: 'Issues', value: d?.issues, color: '#f87171' },
      ].map(item => (
        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.2rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.label}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export function DeveloperProductivityChart({ developers }: Props) {
  if (!developers?.length) return (
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      No developer data yet
    </div>
  );

  const data = developers.map(d => ({
    name: d.developerLogin.length > 10 ? d.developerLogin.slice(0, 10) + '…' : d.developerLogin,
    fullName: d.developerLogin,
    score: d.productivityScore,
    commits: d.commits,
    prs: d.prs ?? d.pullRequestCount ?? 0,
    issues: d.issues ?? d.issueCount ?? 0,
  })).sort((a, b) => b.score - a.score);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-hover)' }} />
        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
          <LabelList dataKey="score" position="top" style={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
