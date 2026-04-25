'use client';

import {
  RadialBarChart, RadialBar, Legend,
  ResponsiveContainer, Tooltip,
} from 'recharts';

interface Props {
  developers: {
    developerLogin: string;
    riskLevel?: string;
    risk?: string;
  }[];
}

export function RiskOverviewChart({ developers }: Props) {
  if (!developers?.length) return (
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      No risk data yet
    </div>
  );

  const low    = developers.filter(d => (d.riskLevel || d.risk) === 'Low'    || (d.riskLevel || d.risk) === 'Active').length;
  const medium = developers.filter(d => (d.riskLevel || d.risk) === 'Medium' || (d.riskLevel || d.risk) === 'Inactive').length;
  const high   = developers.filter(d => (d.riskLevel || d.risk) === 'High').length;
  const total  = developers.length;

  const data = [
    { name: 'Low Risk',    value: Math.round((low    / total) * 100), fill: '#34d399' },
    { name: 'Medium Risk', value: Math.round((medium / total) * 100), fill: '#fbbf24' },
    { name: 'High Risk',   value: Math.round((high   / total) * 100), fill: '#f87171' },
  ].filter(d => d.value > 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart
          cx="50%" cy="50%"
          innerRadius="30%" outerRadius="90%"
          data={data} startAngle={180} endAngle={-180}
        >
          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'var(--bg-hover)' }} />
          <Tooltip
            formatter={(value: any) => [`${value}%`, '']}
            contentStyle={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, fontSize: '0.85rem',
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Risk summary below chart */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
        {[
          { label: 'Low', count: low, color: '#34d399' },
          { label: 'Medium', count: medium, color: '#fbbf24' },
          { label: 'High', count: high, color: '#f87171' },
        ].map(item => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>
              {item.count}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
