'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useState } from 'react';

interface Props {
  data: {
    activityTimestamp: string;
    commitFrequency: number;
    pullRequestCount: number;
    issueCount: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '1rem',
      boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(99,102,241,0.2)',
    }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem', padding: '0.25rem 0', borderRadius: 6, background: 'rgba(99,102,241,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, boxShadow: '0 0 8px rgba(99,102,241,0.3)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'capitalize', fontWeight: 500 }}>
              {p.name}
            </span>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        💡 Click and drag on chart to zoom into specific time periods
      </div>
    </div>
  );
};

export function CommitActivityChart({ data }: Props) {
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'commits' | 'prs' | 'issues'>('all');
  
  if (!data?.length) return (
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>No Activity Data</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Run an analysis to see detailed activity metrics</div>
      </div>
    </div>
  );

  const formatted = data.map(d => ({
    date: new Date(d.activityTimestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    Commits: d.commitFrequency,
    PRs: d.pullRequestCount,
    Issues: d.issueCount,
    total: d.commitFrequency + d.pullRequestCount + d.issueCount,
  }));

  const filteredData = selectedMetric === 'all' ? formatted : formatted.map(d => ({
    date: d.date,
    [selectedMetric === 'commits' ? 'Commits' : selectedMetric === 'prs' ? 'PRs' : 'Issues']: 
      selectedMetric === 'commits' ? d.Commits : selectedMetric === 'prs' ? d.PRs : d.Issues
  }));

  return (
    <div style={{ width: '100%' }}>
      {/* Premium Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['all', 'commits', 'prs', 'issues'] as const).map(metric => (
            <div key={metric} style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => setSelectedMetric(metric)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: selectedMetric === metric ? 'var(--accent)' : 'transparent',
                  color: selectedMetric === metric ? 'white' : 'var(--text-secondary)',
                  border: selectedMetric === metric ? '1px solid var(--accent)' : '1px solid var(--border)'
                }}
                onMouseEnter={(e) => {
                  if (selectedMetric !== metric) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMetric !== metric) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {metric === 'all' ? '📊 All Metrics' : 
                 metric === 'commits' ? '💻 Commits' : 
                 metric === 'prs' ? '🔀 Pull Requests' : '🐛 Issues'}
              </button>
              {/* Professional Tooltip */}
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(4px)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '0.375rem 0.5rem',
                  fontSize: '0.65rem',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  zIndex: 1000,
                  opacity: selectedMetric === metric ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: selectedMetric === metric ? 'none' : 'auto',
                  minWidth: '120px',
                  maxWidth: '150px',
                  lineHeight: '1.3'
                }}
              >
                {metric === 'all' && '📊 All activity metrics'}
                {metric === 'commits' && '💻 Commit patterns'}
                {metric === 'prs' && '🔀 Code review trends'}
                {metric === 'issues' && '🐛 Bug tracking'}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {filteredData.length} data points
        </div>
      </div>

      {/* Premium Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart 
          data={filteredData} 
          margin={{ top: 15, right: 20, left: 10, bottom: 45 }}
        >
          <defs>
            <linearGradient id="commitsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="prsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="issuesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.1} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--border)" 
            vertical={false} 
            strokeOpacity={0.3}
          />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} 
            axisLine={{ stroke: 'var(--border)', strokeWidth: 1 }}
            tickLine={{ stroke: 'var(--border)', strokeWidth: 1 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} 
            axisLine={{ stroke: 'var(--border)', strokeWidth: 1 }}
            tickLine={{ stroke: 'var(--border)', strokeWidth: 1 }}
          />
          <Tooltip content={<CustomTooltip />} />
          {selectedMetric === 'all' && (
            <Legend
              wrapperStyle={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-secondary)', 
                paddingTop: '1.5rem',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                padding: '0.75rem'
              }}
              iconType="circle" 
              iconSize={10}
            />
          )}
          {selectedMetric === 'all' ? (
            <>
              <Area 
                type="monotone" 
                dataKey="Commits" 
                stroke="#818cf8" 
                strokeWidth={3} 
                fill="url(#commitsGrad)" 
                dot={{ r: 0, filter: 'url(#glow)' }} 
                activeDot={{ r: 6, fill: '#818cf8', stroke: 'white', strokeWidth: 2 }} 
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Area 
                type="monotone" 
                dataKey="PRs" 
                stroke="#34d399" 
                strokeWidth={3} 
                fill="url(#prsGrad)" 
                dot={{ r: 0, filter: 'url(#glow)' }} 
                activeDot={{ r: 6, fill: '#34d399', stroke: 'white', strokeWidth: 2 }} 
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Area 
                type="monotone" 
                dataKey="Issues" 
                stroke="#fbbf24" 
                strokeWidth={3} 
                fill="url(#issuesGrad)" 
                dot={{ r: 0, filter: 'url(#glow)' }} 
                activeDot={{ r: 6, fill: '#fbbf24', stroke: 'white', strokeWidth: 2 }} 
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </>
          ) : (
            <Area 
              type="monotone" 
              dataKey={selectedMetric === 'commits' ? 'Commits' : selectedMetric === 'prs' ? 'PRs' : 'Issues'}
              stroke={selectedMetric === 'commits' ? '#818cf8' : selectedMetric === 'prs' ? '#34d399' : '#fbbf24'} 
              strokeWidth={3} 
              fill={selectedMetric === 'commits' ? 'url(#commitsGrad)' : selectedMetric === 'prs' ? 'url(#prsGrad)' : 'url(#issuesGrad)'} 
              dot={{ r: 4, filter: 'url(#glow)' }} 
              activeDot={{ r: 8, fill: selectedMetric === 'commits' ? '#818cf8' : selectedMetric === 'prs' ? '#34d399' : '#fbbf24', stroke: 'white', strokeWidth: 2 }} 
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
