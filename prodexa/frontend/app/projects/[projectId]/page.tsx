'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { api, isAuthenticated } from '@/lib/api';

function StatCard({ label, value, sub, color }: any) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: color || 'var(--text-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

function HealthBar({ score }: { score: number }) {
  const color = score >= 70 ? 'var(--success)' : score >= 40 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Health Score</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{score}/100</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const map: any = {
    Low: 'badge-success', Medium: 'badge-warning', High: 'badge-danger',
    Active: 'badge-success', Inactive: 'badge-danger',
  };
  return <span className={`badge ${map[risk] || 'badge-neutral'}`}>{risk}</span>;
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'improving') return <span style={{ color: 'var(--success)' }}>↑ Improving</span>;
  if (trend === 'declining') return <span style={{ color: 'var(--danger)' }}>↓ Declining</span>;
  return <span style={{ color: 'var(--text-muted)' }}>→ Stable</span>;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [mlData, setMlData] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [runningML, setRunningML] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'developers' | 'ml'>('overview');

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/'); return; }
    loadAll();
  }, [projectId, router]);

  async function loadAll() {
    try {
      const [dash, act] = await Promise.all([
        api.dashboard.get(projectId),
        api.dashboard.activity(projectId),
      ]);
      setDashboard(dash);
      setActivity(act || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      await api.projects.analyze(projectId);
      setTimeout(() => { loadAll(); setAnalyzing(false); }, 8000);
    } catch (e: any) {
      alert(e.message);
      setAnalyzing(false);
    }
  }

  async function handleMLAnalyze() {
    setRunningML(true);
    try {
      const result = await api.ml.analyze(projectId);
      setMlData(result);
    } catch (e: any) {
      alert('ML service error: ' + e.message);
    } finally {
      setRunningML(false);
    }
  }

  if (loading) return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-content" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid var(--accent)',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    </div>
  );

  const devs = dashboard?.leaderboard?.developers || [];
  const riskDevs = dashboard?.developerRisk || [];
  const healthScore = dashboard?.healthScore || 0;
  const metrics = dashboard?.metrics || {};

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-content" style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => router.push('/projects')} style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem',
            }}>←</button>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Project Dashboard
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ID: {projectId.slice(0, 8)}...
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? '⏳ Analyzing...' : '↻ Re-analyze'}
            </button>
            <button className="btn-primary" onClick={handleMLAnalyze} disabled={runningML}>
              {runningML ? '🤖 Running ML...' : '🤖 Run ML Prediction'}
            </button>
          </div>
        </div>

        {/* KPI Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard label="Health Score" value={`${healthScore}`} sub={dashboard?.healthStatus} color={healthScore >= 70 ? 'var(--success)' : healthScore >= 40 ? 'var(--warning)' : 'var(--danger)'} />
          <StatCard label="Total Commits" value={metrics.totalCommits || 0} sub="all time" />
          <StatCard label="Pull Requests" value={metrics.totalPRs || 0} sub="merged + open" />
          <StatCard label="Issues" value={metrics.totalIssues || 0} sub="open + closed" />
          <StatCard label="Developers" value={devs.length} sub="active contributors" />
        </div>

        {/* Health Bar */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <HealthBar score={healthScore} />
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            {[
              { label: 'Status', value: dashboard?.healthStatus || '—' },
              { label: 'Risk Level', value: healthScore < 30 ? 'High' : healthScore < 60 ? 'Medium' : 'Low' },
              { label: 'Active Devs', value: devs.length },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
          {(['overview', 'developers', 'ml'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0.625rem 1.25rem',
              background: 'none', border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab ? 600 : 400,
              fontSize: '0.875rem', cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'color 0.15s',
            }}>{tab === 'ml' ? '🤖 ML Predictions' : tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Developer Risk Status</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Developer</th>
                    <th>Last Active</th>
                    <th>Days Inactive</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {riskDevs.map((dev: any) => (
                    <tr key={dev.developer}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'var(--accent-soft)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)',
                          }}>{dev.developer[0].toUpperCase()}</div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{dev.developer}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {new Date(dev.lastActive).toLocaleDateString()}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{dev.daysSinceLastCommit}d</td>
                      <td><RiskBadge risk={dev.risk} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Developers (Leaderboard) */}
        {activeTab === 'developers' && (
          <div className="animate-fade-in">
            <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Developer Leaderboard</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Developer</th>
                    <th>Commits</th>
                    <th>PRs</th>
                    <th>Issues</th>
                    <th>Productivity</th>
                  </tr>
                </thead>
                <tbody>
                  {devs.map((dev: any, i: number) => (
                    <tr key={dev.developerLogin}>
                      <td style={{ color: i < 3 ? 'var(--warning)' : 'var(--text-muted)', fontWeight: 700 }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'var(--accent-soft)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)',
                          }}>{dev.developerLogin[0].toUpperCase()}</div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{dev.developerLogin}</span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{dev.commits}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{dev.prs || dev.pullRequestCount || 0}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{dev.issues || dev.issueCount || 0}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{
                              width: `${dev.productivityScore}%`,
                              background: dev.productivityScore >= 60 ? 'var(--success)' : dev.productivityScore >= 30 ? 'var(--warning)' : 'var(--danger)',
                            }} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', minWidth: 28 }}>
                            {dev.productivityScore}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: ML Predictions */}
        {activeTab === 'ml' && (
          <div className="animate-fade-in">
            {!mlData ? (
              <div style={{
                textAlign: 'center', padding: '3rem',
                background: 'var(--bg-card)', border: '2px dashed var(--border)',
                borderRadius: 16,
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  No ML predictions yet
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  Click "Run ML Prediction" to analyze this project with Random Forest AI
                </p>
                <button className="btn-primary" onClick={handleMLAnalyze} disabled={runningML}>
                  {runningML ? '🤖 Running...' : '🤖 Run ML Prediction Now'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* ML Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <StatCard label="ML Project Score" value={`${mlData.projectScore?.toFixed(1)}`} color="var(--accent)" />
                  <StatCard label="Delivery Risk" value={mlData.deliveryRisk} color={mlData.deliveryRisk === 'Low' ? 'var(--success)' : mlData.deliveryRisk === 'Medium' ? 'var(--warning)' : 'var(--danger)'} />
                  <StatCard label="Team Health" value={mlData.teamHealthStatus} />
                  <StatCard label="Workload Forecast" value={`${mlData.workloadForecast?.toFixed(1)}`} sub="predicted units" />
                </div>

                {/* Per-developer ML predictions */}
                <div>
                  <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Developer ML Predictions
                  </h3>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Developer</th>
                          <th>Current Score</th>
                          <th>Predicted Score</th>
                          <th>Trend</th>
                          <th>Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mlData.developers?.map((dev: any) => (
                          <tr key={dev.developerLogin}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                  width: 32, height: 32, borderRadius: '50%',
                                  background: 'var(--accent-soft)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)',
                                }}>{dev.developerLogin[0].toUpperCase()}</div>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{dev.developerLogin}</span>
                              </div>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>{dev.currentScore}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent)' }}>
                              {dev.predictedScore?.toFixed(1)}
                            </td>
                            <td><TrendIcon trend={dev.trend} /></td>
                            <td><RiskBadge risk={dev.riskLevel} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Generated at {new Date(mlData.generatedAt).toLocaleString()} · Random Forest Model (98.8% accuracy)
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
