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
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ fontSize: '2rem' }}>🚨</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>No Risk Data</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Run an analysis to see developer risk assessment</div>
      </div>
    </div>
  );

  // Proper risk level mapping
  const low    = developers.filter(d => {
    const risk = d.riskLevel || d.risk || '';
    return risk === 'Low' || risk === 'Active' || risk === 'Healthy';
  }).length;
  
  const medium = developers.filter(d => {
    const risk = d.riskLevel || d.risk || '';
    return risk === 'Medium' || risk === 'Inactive' || risk === 'Moderate' || risk === 'Risky';
  }).length;
  
  const high   = developers.filter(d => {
    const risk = d.riskLevel || d.risk || '';
    return risk === 'High' || risk === 'Critical' || risk === 'At Risk';
  }).length;
  
  const total  = developers.length;

  // Calculate percentages properly
  const data = [
    { name: 'Low Risk',    value: total > 0 ? Math.round((low    / total) * 100) : 0, fill: '#34d399' },
    { name: 'Medium Risk', value: total > 0 ? Math.round((medium / total) * 100) : 0, fill: '#fbbf24' },
    { name: 'High Risk',   value: total > 0 ? Math.round((high   / total) * 100) : 0, fill: '#f87171' },
  ].filter(d => d.value > 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart
          cx="50%" cy="50%"
          innerRadius="25%" outerRadius="85%"
          data={data} startAngle={180} endAngle={-180}
        >
          <RadialBar 
            dataKey="value" 
            cornerRadius={8} 
            background={{ fill: 'var(--bg-hover)' }}
            label={{ position: 'insideStart', fill: 'white', fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip
            formatter={(value: any) => [`${value}%`, 'Risk Level']}
            contentStyle={{
              background: 'var(--bg-card)', 
              border: '1px solid var(--border)',
              borderRadius: 8, 
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
            labelStyle={{ color: 'var(--text-secondary)' }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Risk summary below chart */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '0.75rem' }}>
        {[
          { label: 'Low', count: low, color: '#34d399'},
          { label: 'Medium', count: medium, color: '#fbbf24' },
          { label: 'High', count: high, color: '#f87171' },
        ].map(item => (
          <div key={item.label} style={{ textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.icon}</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>
              {item.count}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
