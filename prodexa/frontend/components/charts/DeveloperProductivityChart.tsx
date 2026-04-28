'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { useState } from 'react';

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
      borderRadius: 12, padding: '1rem',
      boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(99,102,241,0.2)',
      minWidth: 200,
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        marginBottom: '0.75rem',
        padding: '0.5rem',
        background: 'rgba(99,102,241,0.05)',
        borderRadius: '8px'
      }}>
        <div style={{ 
          width: 12, 
          height: 12, 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #818cf8, #3b82f6)',
          boxShadow: '0 0 12px rgba(99,102,241,0.4)' 
        }} />
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          {label}
        </span>
      </div>
      {[
        { label: 'Score', value: d?.score, color: '#818cf8', icon: '📊' },
        { label: 'Commits', value: d?.commits, color: '#34d399', icon: '💻' },
        { label: 'PRs', value: d?.prs, color: '#fbbf24', icon: '🔀' },
        { label: 'Issues', value: d?.issues, color: '#f87171', icon: '🐛' },
      ].map(item => (
        <div key={item.label} style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '1rem', 
          marginBottom: '0.5rem', 
          padding: '0.5rem',
          borderRadius: '8px',
          background: 'rgba(99,102,241,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>
            {item.value?.toLocaleString()}
          </span>
        </div>
      ))}
      <div style={{ 
        marginTop: '0.5rem', 
        paddingTop: '0.5rem', 
        borderTop: '1px solid var(--border)', 
        fontSize: '0.75rem', 
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        💡 Click on bars to see detailed metrics
      </div>
    </div>
  );
};

export function DeveloperProductivityChart({ developers }: Props) {
  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');
  const [sortBy, setSortBy] = useState<'score' | 'commits' | 'prs' | 'issues'>('score');
  
  if (!developers?.length) return (
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>No Developer Data</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Run an analysis to see developer productivity metrics</div>
      </div>
    </div>
  );

  const data = developers
    .map(d => ({
      name: d.developerLogin.length > 12 ? d.developerLogin.slice(0, 12) + '…' : d.developerLogin,
      fullName: d.developerLogin,
      score: d.productivityScore,
      commits: d.commits,
      prs: d.prs ?? d.pullRequestCount ?? 0,
      issues: d.issues ?? d.issueCount ?? 0,
      total: d.commits + (d.prs ?? d.pullRequestCount ?? 0) + (d.issues ?? d.issueCount ?? 0),
    }))
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'commits') return b.commits - a.commits;
      if (sortBy === 'prs') return b.prs - a.prs;
      return b.issues - a.issues;
    });

  const radarData = data.slice(0, 6).map(d => ({
    subject: d.name,
    score: d.score,
    commits: d.commits,
    prs: d.prs,
    issues: d.issues,
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
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {(['bar', 'radar'] as const).map(type => (
              <div key={type} style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  onClick={() => setChartType(type)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: type === 'bar' ? '8px 0 0 8px' : '0 8px 8px 0',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: chartType === type ? 'var(--accent)' : 'transparent',
                    color: chartType === type ? 'white' : 'var(--text-secondary)',
                    border: chartType === type ? '1px solid var(--accent)' : '1px solid var(--border)'
                  }}
                >
                  {type === 'bar' ? '📊 Bar Chart' : '🎯 Radar Chart'}
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
                    opacity: chartType === type ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: chartType === type ? 'none' : 'auto',
                    minWidth: '120px',
                    maxWidth: '150px',
                    lineHeight: '1.3'
                  }}
                >
                  {type === 'bar' && '📊 Individual developer scores'}
                  {type === 'radar' && '🎯 Developer comparison chart'}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {(['score', 'commits', 'prs', 'issues'] as const).map(sort => (
              <div key={sort} style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  onClick={() => setSortBy(sort)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: sortBy === sort ? 'var(--accent)' : 'transparent',
                    color: sortBy === sort ? 'white' : 'var(--text-secondary)',
                    border: sortBy === sort ? '1px solid var(--accent)' : '1px solid var(--border)'
                  }}
                >
                  {sort === 'score' ? '📊' : sort === 'commits' ? '💻' : sort === 'prs' ? '🔀' : '🐛'}
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
                    opacity: sortBy === sort ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: sortBy === sort ? 'none' : 'auto',
                    minWidth: '100px',
                    maxWidth: '130px',
                    lineHeight: '1.3'
                  }}
                >
                  {sort === 'score' && '📊 Top performers'}
                  {sort === 'commits' && '💻 Most active'}
                  {sort === 'prs' && '🔀 Code review'}
                  {sort === 'issues' && '🐛 Bug fixes'}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {data.length} developers
        </div>
      </div>

      {/* Premium Chart */}
      <ResponsiveContainer width="100%" height={280}>
        {chartType === 'bar' ? (
          <BarChart 
            data={data} 
            margin={{ top: 15, right: 25, left: 10, bottom: 50 }}
            barSize={32}
          >
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="grad4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f87171" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7} />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity={0.3}/>
              </filter>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--border)" 
              vertical={false} 
              strokeOpacity={0.3}
            />
            <XAxis 
              dataKey="name" 
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
              domain={[0, Math.max(...data.map(d => d.score)) + 10]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-hover)' }} />
            <Bar 
              dataKey={sortBy === 'score' ? 'score' : sortBy === 'commits' ? 'commits' : sortBy === 'prs' ? 'prs' : 'issues'}
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-in-out"
            >
              {data.map((_, i) => (
                <Cell 
                  key={i} 
                  fill={`url(#grad${(i % 4) + 1})`}
                  filter="url(#shadow)"
                  style={{ cursor: 'pointer' }}
                />
              ))}
              {sortBy === 'score' && (
                <LabelList 
                  dataKey="score" 
                  position="top" 
                  style={{ 
                    fontSize: 12, 
                    fill: 'var(--text-primary)', 
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700
                  }} 
                />
              )}
            </Bar>
          </BarChart>
        ) : (
          <RadarChart 
            data={radarData}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <defs>
              <radialGradient id="radar1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
              </radialGradient>
            </defs>
            <PolarGrid 
              stroke="var(--border)" 
              strokeWidth={1} 
              strokeOpacity={0.3}
            />
            <PolarAngleAxis 
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
            />
            <PolarRadiusAxis 
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
            />
            <Radar
              name="Productivity Score"
              dataKey="score"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#radar1)"
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
