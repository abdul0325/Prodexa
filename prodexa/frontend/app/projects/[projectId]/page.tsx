'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { AnalysisStatusBar, AnalysisStatusBadge } from '@/components/ui/AnalysisStatus';
import { ToastContainer, toast } from '@/components/ui/Toast';
import { useProjectRealtime } from '@/hooks/useSocket';
import { api, fetchExecutiveSummary, isAuthenticated } from '@/lib/api';
import { NexusPulse } from '@/components/loader/NexusPulse';
import { CommitActivityChart } from '@/components/charts/CommitActivityChart';
import { DeveloperProductivityChart } from '@/components/charts/DeveloperProductivityChart';
import { HealthTrendChart } from '@/components/charts/HealthTrendChart';
import { WorkloadDistributionChart } from '@/components/charts/WorkloadDistributionChart';
import { RiskOverviewChart } from '@/components/charts/RiskOverviewChart';
import { RefreshCw, Bot, BarChart3, TrendingUp, Users, Zap, ArrowLeft } from 'lucide-react';
import {
  fetchAIInsights,
  fetchRiskDetection,
  fetchEngineeringHealth,
  fetchProjectDeltas,
  fetchForecast
} from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AIInsightsResponse, RiskDetectionResponse, EngineeringHealthResponse } from '@/types/intelligence';
// ... rest of the code remains the same ...
// ─── Reusable components ────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
  updating,
  delta,
}: any) {

  const hasDelta =
    delta !== undefined &&
    delta !== null;

  const positive =
    delta >= 0;

  return (

    <div
      className="stat-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      {updating && (

        <div
          style={{
            position: 'absolute',

            top: 0,
            left: 0,
            right: 0,

            height: 2,

            background:
              'var(--accent)',

            animation:
              'slideRight 1s ease infinite',
          }}
        />
      )}

      <div className="stat-label">
        {label}
      </div>

      <div
        className="stat-value"
        style={{
          color:
            color ||
            'var(--text-primary)',

          transition:
            'color 0.5s',
        }}
      >
        {value}
      </div>

      {sub && (

        <div
          style={{
            fontSize: '0.75rem',

            color:
              'var(--text-muted)',

            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}

      {hasDelta && (

        <div
          style={{
            display: 'flex',

            alignItems: 'center',

            gap: 6,

            marginTop: 10,
          }}
        >

          <span
            style={{
              color:
                positive
                  ? '#22c55e'
                  : '#ef4444',

              fontSize:
                '0.8rem',

              fontWeight: 700,

              display: 'flex',

              alignItems: 'center',

              gap: 2,
            }}
          >

            {positive
              ? '↑'
              : '↓'}

            {Math.abs(delta)}%

          </span>

          <span
            style={{
              fontSize:
                '0.72rem',

              color:
                'var(--text-muted)',
            }}
          >
            vs previous period
          </span>

        </div>
      )}

    </div>
  );
}

function HealthBar({ score }: { score: number }) {
  const color = score >= 70 ? 'var(--success)' : score >= 40 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Health Score</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{score}/100</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const map: any = { Low: 'badge-success', Medium: 'badge-warning', High: 'badge-danger', Active: 'badge-success', Inactive: 'badge-danger' };
  return <span className={`badge ${map[risk] || 'badge-neutral'}`}>{risk}</span>;
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'improving') return <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>↑ Improving</span>;
  if (trend === 'declining') return <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>↓ Declining</span>;
  return <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>→ Stable</span>;
}

function DevAvatar({ login }: { login: string }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: 'var(--accent-soft)', overflow: 'hidden', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)',
    }}>
      <img src={`https://github.com/${login}.png?size=64`} alt={login}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    </div>
  );
}

function ChartCard({ title, children, height }: { title: string; children: React.ReactNode; height?: number }) {
  return (
    <div className="card" style={{ height: height ? height + 80 : 'auto' }}>
      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function Skeleton({ width = '100%', height = 20, radius = 6 }: any) {
  return <div style={{ width, height, borderRadius: radius, background: 'var(--bg-hover)', animation: 'shimmer 1.5s infinite' }} />;
}

function LiveDevItem({ dev }: { dev: any }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.625rem 0.875rem',
      background: 'var(--accent-soft)', borderRadius: 8, marginBottom: '0.5rem',
      animation: 'fadeIn 0.4s ease', border: '1px solid var(--accent)',
    }}>
      <DevAvatar login={dev.developer} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>{dev.developer}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {dev.commits} commits · {dev.pullRequestCount} PRs · {dev.issueCount} issues
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent)' }}>
        {dev.productivityScore}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();

  const [dashboard, setDashboard] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [mlData, setMlData] = useState<any>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAIInsights] = useState<AIInsightsResponse | null>(null);
  const [riskDetection, setRiskDetection] = useState<RiskDetectionResponse | null>(null);
  const [engineeringHealth, setEngineeringHealth] = useState<EngineeringHealthResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [runningML, setRunningML] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'developers' | 'ml' | 'live'>('overview');
  const [trends, setTrends] = useState<any>(null);
  const [deltas, setDeltas] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [executiveSummary, setExecutiveSummary] = useState<any>(null);
  const {
    analysisStatus, analysisMessage,
    healthScore: liveHealthScore, healthStatus: liveHealthStatus,
    liveDevs, dashboardUpdated, resetDashboardUpdated,
    intelligenceUpdated, resetIntelligenceUpdated,
  } = useProjectRealtime(projectId);

  const loadIntelligence =
    useCallback(async () => {

      try {

        const [
          insights,
          risks,
          health,
        ] = await Promise.all([

          fetchAIInsights(projectId),

          fetchRiskDetection(projectId),

          fetchProjectDeltas(projectId),

          fetchEngineeringHealth(projectId),

          fetchForecast(projectId),

          fetchExecutiveSummary(projectId),
        ]).then(([insights, risks, deltas, health, forecast, executiveSummary]) => {
          setDeltas(deltas);
          setTrends(health?.trends);
          setForecast(forecast);
          setExecutiveSummary(executiveSummary);
          return [insights, risks, health];
        });

        setAIInsights(insights);

        setRiskDetection(risks);

        setEngineeringHealth(health);

      } catch (error) {

        console.error(
          'Failed to load intelligence layer',
          error,
        );
      }
    }, [projectId]);

  const loadAll = useCallback(async () => {
    try {
      const [dash, act, projects] = await Promise.all([
        api.dashboard.get(projectId),
        api.dashboard.activity(projectId),
        api.projects.list(),
      ]);

      setDashboard(dash);

      setActivity(act || []);

      // Find current project from projects list
      const currentProject =
        projects.find(
          (p: any) => p.id === projectId,
        );

      if (currentProject?.name) {

        setProjectName(
          currentProject.name,
        );
      }

    } catch (e: any) {

      toast(
        'error',
        'Failed to load dashboard',
        e.message,
      );

    } finally {

      setLoading(false);
    }

  }, [projectId]);

  useEffect(() => {

    loadIntelligence();

    if (dashboardUpdated) {

      toast(
        'success',
        '✅ Analysis Complete',
        'Dashboard updated with latest data',
      );

      loadAll();

      resetDashboardUpdated();

      setAnalyzing(false);
    }

  }, [
    dashboardUpdated,
    loadIntelligence,
    loadAll,
    resetDashboardUpdated,
  ]);

  useEffect(() => {
    if (analysisStatus === 'ANALYZING' && liveDevs.length > 0) setActiveTab('live');
  }, [analysisStatus, liveDevs.length]);

  useEffect(() => {
    if (analysisStatus === 'FAILED') { toast('error', '❌ Analysis Failed', analysisMessage); setAnalyzing(false); }
    if (analysisStatus === 'QUEUED') toast('info', '⏳ Queued', 'Analysis added to queue');
  }, [analysisStatus]);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/'); return; }
    loadAll();
  }, [projectId, router]);

  useEffect(() => {

    if (!intelligenceUpdated)
      return;

    // Refresh intelligence APIs
    loadIntelligence();

    // Refresh dashboard metrics/charts
    loadAll();

    resetIntelligenceUpdated();

  }, [
    intelligenceUpdated,
    loadIntelligence,
    loadAll,
    resetIntelligenceUpdated,
  ]);

  async function handleAnalyze() {
    setAnalyzing(true);
    setActiveTab('live');
    try {
      await api.projects.analyze(projectId);
      toast('info', '⚡ Analysis Started', 'Watch live updates in the Live Feed tab');
    } catch (e: any) {
      toast('error', 'Failed to start analysis', e.message);
      setAnalyzing(false);
    }
  }

  async function handleMLAnalyze() {
    setRunningML(true);
    try {
      const result = await api.ml.analyze(projectId);
      setMlData(result);
      setActiveTab('ml');
      toast('success', '🤖 ML Done', `Score: ${result.projectScore?.toFixed(1)} · Risk: ${result.deliveryRisk}`);
    } catch (e: any) {
      toast('error', 'ML error', e.message);
    } finally {
      setRunningML(false);
    }
  }

  const displayHealth =
    engineeringHealth?.score ??
    liveHealthScore ??
    dashboard?.healthScore ??
    0;
  const displayStatus =
    engineeringHealth?.status ||
    liveHealthStatus ||
    dashboard?.healthStatus ||
    '—';
  const isLive = liveHealthScore !== null;
  const devs = dashboard?.leaderboard?.developers || [];
  const riskDevs = dashboard?.developerRisk || [];
  const metrics = dashboard?.metrics || {};

  const tabs = [
    { key: 'overview', label: <><BarChart3 size={16} style={{ marginRight: '0.5rem' }} />Overview</> },
    { key: 'charts', label: <><TrendingUp size={16} style={{ marginRight: '0.5rem' }} />Charts</> },
    { key: 'developers', label: <><Users size={16} style={{ marginRight: '0.5rem' }} />Leaderboard</> },
    { key: 'ml', label: <><Bot size={16} style={{ marginRight: '0.5rem' }} />ML Predictions</> },
    { key: 'live', label: <><Zap size={16} style={{ marginRight: '0.5rem' }} />Live{liveDevs.length > 0 ? ` (${liveDevs.length})` : ''}</> },
  ] as const;

  if (loading) return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content page-main project-detail-main">
        <div className="page-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <NexusPulse size="small" showText={true} text="Loading Data..." />
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content page-main project-detail-main">

        {/* Header */}
        <div className="page-header project-detail-header" style={{
          marginBottom: '1.25rem', position: 'relative',
          overflow: 'hidden'
        }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 40%)',
              pointerEvents: 'none',
            }}
          />
          <div className="project-detail-title-wrap" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => router.push('/projects')}
              className="btn-back"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <ArrowLeft size={16} />
            </button>
            <div className="project-detail-title-content" style={{ flex: 1 }}>
              <div className="project-detail-title-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 className="project-detail-title" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {projectName || 'Project Dashboard'}
                </h1>
                <AnalysisStatusBadge status={analysisStatus} />
              </div>
              <p className="wrap-anywhere" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {dashboard?.repoUrl?.replace('https://github.com/', '') || projectId.slice(0, 8) + '...'}
              </p>
            </div>
          </div>
          <div className="page-actions project-detail-actions">
            <button className="btn-secondary" onClick={handleAnalyze} disabled={analyzing || analysisStatus === 'ANALYZING'}>
              {analyzing || analysisStatus === 'ANALYZING' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Analyzing...</span>
                </div>
              ) : <><RefreshCw size={14} style={{ marginRight: '0.25rem' }} />Re-analyze</>}
            </button>
            <button className="btn-primary" onClick={handleMLAnalyze} disabled={runningML}>
              {runningML ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Running...</span>
                </div>
              ) : <><Bot size={14} style={{ marginRight: '0.25rem' }} />Run ML</>}
            </button>
          </div>
        </div>

        <div className="project-detail-content">
          {/* Status bar */}
          <AnalysisStatusBar status={analysisStatus} message={analysisMessage} />

          {/* KPI Stats */}
          <div className="card-grid compact" style={{ marginBottom: '1.5rem' }}>
            <StatCard
              label="Health Score"

              value={displayHealth}

              sub={displayStatus}

              updating={isLive}

              delta={
                deltas?.healthDelta
              }

              color={
                displayHealth >= 70
                  ? 'var(--success)'
                  : displayHealth >= 40
                    ? 'var(--warning)'
                    : 'var(--danger)'
              }
            />
            <StatCard
              label="Commits"

              value={
                metrics.totalCommits ?? 0
              }

              sub="total"

              delta={
                deltas?.commitDelta
              }
            />
            <StatCard
              label="Pull Requests"

              value={
                metrics.totalPRs ?? 0
              }

              sub="total"

              delta={
                deltas?.prDelta
              }
            />
            <StatCard label="Issues" value={metrics.totalIssues ?? 0} sub="total" />
            <StatCard label="Developers" value={devs.length} sub="active" />
          </div>

          {/* Executive Summary */}
          <div
            className="card"
            style={{
              marginBottom: '1.5rem',
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',

                alignItems: 'center',

                marginBottom: '1rem',
              }}
            >

              <div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                >
                  Executive Summary
                </h3>

                <p
                  style={{
                    color:
                      'var(--text-secondary)',

                    fontSize: '0.85rem',
                  }}
                >
                  AI-generated engineering overview
                </p>

              </div>

              <span className="badge badge-primary">
                AI Generated
              </span>

            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >

              {executiveSummary?.summary?.map(
                (
                  item: string,
                  idx: number,
                ) => (

                  <div
                    key={idx}
                    style={{
                      padding: '1rem',

                      border:
                        '1px solid var(--border)',

                      borderRadius: 14,

                      background:
                        'rgba(255,255,255,0.02)',

                      lineHeight: 1.6,
                    }}
                  >
                    {item}
                  </div>
                ),
              )}

            </div>
          </div>

          {/* Engineering Trends */}
          <div
            className="card"
            style={{
              marginBottom: '1.5rem',
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >

              <div>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  Engineering Trends
                </h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    marginTop: 4,
                  }}
                >
                  Historical engineering activity
                </p>
              </div>

              <span className="badge badge-success">
                30 Days
              </span>
            </div>

            <div
              style={{
                height: 320,
              }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={
                    trends?.commitTrend || []
                  }
                >

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="commits"
                    stroke="var(--accent)"
                    strokeWidth={3}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>
            </div>
          </div>

          {analysisStatus !== 'ANALYZING' &&
            !dashboard?.metrics?.totalCommits && (
              <div
                className="card"
                style={{
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  padding: '2.5rem',
                }}
              >
                <Bot
                  size={48}
                  color="var(--accent)"
                  style={{ marginBottom: '1rem' }}
                />

                <h3
                  style={{
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  No Intelligence Data Yet
                </h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                  }}
                >
                  Run repository analysis to generate AI insights,
                  risks, KPIs and engineering intelligence.
                </p>

                <button
                  className="btn-primary"
                  onClick={handleAnalyze}
                >
                  Run Analysis
                </button>
              </div>
            )}

          {/* Intelligence Layer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >

            {/* AI Insights */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
              }}
            >
              <span className="badge badge-success">
                LIVE AI
              </span>
              {!aiInsights ? (
                <>
                  <Skeleton height={80} radius={12} />
                  <Skeleton height={80} radius={12} />
                </>
              ) : aiInsights?.insights?.length === 0 ? (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-hover)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                  }}
                >
                  No AI insights available yet.
                </div>
              ) : (
                aiInsights.insights.map(
                  (
                    insight: string,
                    index: number,
                  ) => (

                    <div
                      key={index}
                      style={{
                        padding: '1rem',
                        borderRadius: 12,
                        background:
                          'linear-gradient(135deg, var(--accent-soft), var(--bg-hover))',
                        border:
                          '1px solid var(--border)',
                        transition: 'all 0.2s ease',
                      }}
                    >

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: 8,
                        }}
                      >
                        <Bot
                          size={16}
                          color="var(--accent)"
                        />

                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              'var(--text-primary)',
                          }}
                        >
                          AI Insight
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: '0.84rem',
                          lineHeight: 1.7,
                          color:
                            'var(--text-secondary)',
                        }}
                      >
                        {insight}
                      </div>
                    </div>
                  ),
                )
              )}
            </div>

            {/* Predictive Forecast */}
            <div
              className="card"
              style={{
                marginBottom: '1.5rem',
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',

                  alignItems: 'center',

                  marginBottom: '1rem',
                }}
              >

                <div>

                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                    }}
                  >
                    Predictive Forecast
                  </h3>

                  <p
                    style={{
                      color:
                        'var(--text-secondary)',

                      fontSize: '0.85rem',
                    }}
                  >
                    Engineering delivery prediction
                  </p>

                </div>

                <span
                  className={`badge ${forecast?.riskLevel ===
                    'HIGH'
                    ? 'badge-danger'
                    : forecast?.riskLevel ===
                      'MEDIUM'
                      ? 'badge-warning'
                      : 'badge-success'
                    }`}
                >
                  {forecast?.riskLevel}
                </span>

              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >

                {forecast?.forecast?.map(
                  (
                    item: string,
                    idx: number,
                  ) => (

                    <div
                      key={idx}
                      style={{
                        padding: '0.9rem',

                        border:
                          '1px solid var(--border)',

                        borderRadius: 12,

                        background:
                          'rgba(255,255,255,0.02)',
                      }}
                    >
                      {item}
                    </div>
                  ),
                )}

              </div>
            </div>

            {/* Risk Detection */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
              }}
            >
              <span className="badge badge-warning">
                LIVE RISKS
              </span>
              {!riskDetection ? (
                <>
                  <Skeleton height={90} radius={12} />
                  <Skeleton height={90} radius={12} />
                </>
              ) : riskDetection?.risks?.length === 0 ? (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-hover)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                  }}
                >
                  No engineering risks detected.
                </div>
              ) : (
                riskDetection.risks.map(
                  (
                    risk: any,
                    index: number,
                  ) => (

                    <div
                      key={index}
                      style={{
                        padding: '1rem',
                        borderRadius: 12,
                        background:
                          risk.severity === 'HIGH'
                            ? 'rgba(239, 68, 68, 0.08)'
                            : 'rgba(245, 158, 11, 0.08)',

                        border:
                          risk.severity === 'HIGH'
                            ? '1px solid rgba(239, 68, 68, 0.25)'
                            : '1px solid rgba(245, 158, 11, 0.25)',
                      }}
                    >

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              'var(--text-primary)',
                          }}
                        >
                          {risk.title}
                        </span>

                        <span
                          className={
                            risk.severity === 'HIGH'
                              ? 'badge badge-danger'
                              : risk.severity === 'MEDIUM'
                                ? 'badge badge-warning'
                                : 'badge badge-success'
                          }
                        >
                          {risk.severity}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: '0.82rem',
                          lineHeight: 1.6,
                          color:
                            'var(--text-secondary)',
                          marginBottom: 8,
                        }}
                      >
                        {risk.description}
                      </div>

                      {risk.recommendation && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            borderTop: '1px solid var(--border)',
                            paddingTop: 8,
                          }}
                        >
                          Recommendation: {risk.recommendation}
                        </div>
                      )}
                    </div>
                  ),
                )
              )}
            </div>
          </div>

          {/* Health bar */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <HealthBar score={displayHealth} />
            <div className="info-row">
              {[
                { label: 'Status', value: displayStatus },
                { label: 'Risk', value: displayHealth < 30 ? 'High' : displayHealth < 60 ? 'Medium' : 'Low' },
                { label: 'Developers', value: devs.length },
                { label: 'Last Updated', value: isLive ? 'Live 🔴' : 'Cached' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  <div style={{ fontWeight: 600, color: item.label === 'Last Updated' && isLive ? 'var(--success)' : 'var(--text-primary)', marginTop: 2, fontSize: '0.875rem' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-row">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: '0.625rem 1.1rem', background: 'none', border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.key ? 600 : 400,
                fontSize: '0.875rem', cursor: 'pointer', transition: 'color 0.15s', whiteSpace: 'nowrap',
              }}>{tab.label}</button>
            ))}
          </div>

          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Developer Risk Status</h3>
              {riskDevs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No developer data yet — run an analysis first
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Developer</th><th>Last Active</th><th>Days Inactive</th><th>Status</th></tr></thead>
                    <tbody>
                      {riskDevs.map((dev: any) => (
                        <tr key={dev.developer}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <DevAvatar login={dev.developer} />
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{dev.developer}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(dev.lastActive).toLocaleDateString()}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{dev.daysSinceLastCommit}d</td>
                          <td><RiskBadge risk={dev.risk} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Charts Tab ── */}
          {activeTab === 'charts' && (
            <div className="animate-fade-in section-gap">

              {/* Row 1: Activity + Health Trend */}
              <div className="two-col-grid">
                <ChartCard title="📈 Commit Activity Over Time">
                  <CommitActivityChart data={activity} />
                </ChartCard>
                <ChartCard title="💚 Health Score Trend">
                  <HealthTrendChart data={activity} />
                </ChartCard>
              </div>

              {/* Row 2: Productivity + Workload */}
              <div className="two-col-grid">
                <ChartCard title="🏆 Developer Productivity Scores">
                  <DeveloperProductivityChart developers={devs} />
                </ChartCard>
                <ChartCard title="🥧 Workload Distribution">
                  <WorkloadDistributionChart developers={devs} />
                </ChartCard>
              </div>

              {/* Row 3: Risk Overview full width */}
              <ChartCard title="🚨 Risk Distribution">
                <RiskOverviewChart developers={riskDevs} />
              </ChartCard>

            </div>
          )}

          {/* ── Leaderboard Tab ── */}
          {activeTab === 'developers' && (
            <div className="animate-fade-in">
              <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Developer Leaderboard</h3>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>#</th><th>Developer</th><th>Commits</th><th>PRs</th><th>Issues</th><th>Score</th></tr></thead>
                  <tbody>
                    {devs.map((dev: any, i: number) => (
                      <tr key={dev.developerLogin}>
                        <td style={{ fontWeight: 700, color: i < 3 ? 'var(--warning)' : 'var(--text-muted)' }}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <DevAvatar login={dev.developerLogin} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{dev.developerLogin}</span>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{dev.commits}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{dev.prs ?? 0}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{dev.issues ?? 0}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="progress-bar" style={{ width: 80 }}>
                              <div className="progress-fill" style={{
                                width: `${dev.productivityScore}%`,
                                background: dev.productivityScore >= 60 ? 'var(--success)' : dev.productivityScore >= 30 ? 'var(--warning)' : 'var(--danger)',
                              }} />
                            </div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', minWidth: 28 }}>{dev.productivityScore}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ML Tab ── */}
          {activeTab === 'ml' && (
            <div className="animate-fade-in">
              {!mlData ? (
                <div className="empty-state">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                    <Bot size={48} />
                  </div>
                  <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No ML predictions yet</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Click "Run ML" to analyze with Random Forest AI
                  </p>
                  <button className="btn-primary" onClick={handleMLAnalyze} disabled={runningML}>
                    {runningML ? <><Bot size={14} style={{ marginRight: '0.25rem' }} />Running...</> : <><Bot size={14} style={{ marginRight: '0.25rem' }} />Run ML Now</>}
                  </button>
                </div>
              ) : (
                <div className="section-gap">
                  <div className="card-grid compact">
                    <StatCard label="ML Project Score" value={mlData.projectScore?.toFixed(1)} color="var(--accent)" />
                    <StatCard label="Delivery Risk" value={mlData.deliveryRisk}
                      color={mlData.deliveryRisk === 'Low' ? 'var(--success)' : mlData.deliveryRisk === 'Medium' ? 'var(--warning)' : 'var(--danger)'} />
                    <StatCard label="Team Health" value={mlData.teamHealthStatus} />
                    <StatCard label="Workload Forecast" value={mlData.workloadForecast?.toFixed(1)} sub="predicted units" />
                  </div>
                  <div className="table-wrapper">
                    <table>
                      <thead><tr><th>Developer</th><th>Current</th><th>Predicted</th><th>Trend</th><th>Risk</th></tr></thead>
                      <tbody>
                        {mlData.developers?.map((dev: any) => (
                          <tr key={dev.developerLogin}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <DevAvatar login={dev.developerLogin} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{dev.developerLogin}</span>
                              </div>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>{dev.currentScore}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>{dev.predictedScore?.toFixed(1)}</td>
                            <td><TrendIcon trend={dev.trend} /></td>
                            <td><RiskBadge risk={dev.riskLevel} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Generated {new Date(mlData.generatedAt).toLocaleString()} · Random Forest (98.8% accuracy)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Live Feed Tab ── */}
          {activeTab === 'live' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Live Developer Activity</h3>
                {analysisStatus === 'ANALYZING' && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                    Live
                  </span>
                )}
              </div>
              {liveDevs.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                  <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No live data yet</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Click "Re-analyze" and watch developers appear here in real time</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {liveDevs.length} developer{liveDevs.length !== 1 ? 's' : ''} analyzed
                    {analysisStatus === 'ANALYZING' ? ' — updating live...' : ' — complete'}
                  </p>
                  {liveDevs.map((dev: any) => <LiveDevItem key={dev.developer} dev={dev} />)}
                </div>
              )}
            </div>
          )}
        </div>

      </main>

      <ToastContainer />

      <style>{`
        @keyframes slideRight { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}
