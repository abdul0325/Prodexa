'use client';

import {
  useState,
  useEffect,
  use,
  useCallback,
} from 'react';

import { useRouter } from 'next/navigation';

import Sidebar from '@/components/layout/Sidebar';

import { AnalysisStatusBar } from '@/components/ui/AnalysisStatus';

import { ToastContainer, toast } from '@/components/ui/Toast';

import { useProjectRealtime } from '@/hooks/useSocket';

import {
  api,
  fetchExecutiveSummary,
  fetchAIInsights,
  fetchRiskDetection,
  fetchEngineeringHealth,
  fetchProjectDeltas,
  fetchForecast,
  isAuthenticated,
  fetchProjectTrends,
} from '@/lib/api';

import { NexusPulse } from '@/components/loader/NexusPulse';

import ProjectHeader from '@/components/project-detail/header/ProjectHeader';
import KPIGrid from '@/components/project-detail/stats/KPIGrid';
import ExecutiveSummary from '@/components/project-detail/intelligence/ExecutiveSummary';
import AIInsightsPanel from '@/components/project-detail/intelligence/AIInsightsPanel';
import PredictiveForecast from '@/components/project-detail/intelligence/PredictiveForecast';
import RiskDetectionPanel from '@/components/project-detail/intelligence/RiskDetectionPanel';
import EngineeringTrendChart from '@/components/project-detail/charts/EngineeringTrendChart';
import DevelopersTab from '@/components/project-detail/tabs/DevelopersTab';
import MLTab from '@/components/project-detail/tabs/MLTab';

import {
  AIInsightsResponse,
  RiskDetectionResponse,
  EngineeringHealthResponse,
} from '@/types/intelligence';

import { Users, Bot } from 'lucide-react';

interface DashboardData {
  projectId: string;
  repoUrl?: string;
  healthScore: number;
  healthStatus: string;
  metrics: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
  };
  leaderboard: {
    totals: {
      totalCommits: number;
      totalPRs: number;
      totalIssues: number;
    };
    developers: Developer[];
  };
  developerRisk: DeveloperRiskEntry[];
  prediction?: {
    productivityScore: number;
    deliveryRisk: string;
    workloadForecast: number;
    teamHealthStatus: string;

    avgImpactScore: number;
    avgRiskScore: number;
    noiseRatio: number;
    testingRatio: number;
    hotspotCount: number;

    generatedAt: string;
  };
}

interface Developer {
  developerLogin: string;
  commits: number;
  prs: number;
  issues: number;
  productivityScore: number;
}

interface DeveloperRiskEntry {
  developer: string;
  lastActive: string;
  daysSinceLastCommit: number;
  risk: string;
}

interface ForecastData {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  forecast: string[];
}

interface ExecutiveSummaryData {
  generatedAt: string;
  totalInsights: number;
  summary: string[];
}

interface TrendsData {
  healthTrend: { date: string; health: number; commits: number; prs: number }[];
  commitTrend: { date: string; commits: number }[];
  prTrend: { date: string; prs: number }[];
  velocityTrend: { date: string; velocity: number }[];
}

interface DeltaData {
  healthDelta: number;
  commitDelta: number;
  prDelta: number;
  velocityDelta: number;
}

interface MLPrediction {
  projectId: string;
  projectName: string;
  projectScore: number;
  deliveryRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  teamHealthStatus: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'RISKY';
  forecastConfidence: number; // 0–1 float from Python (e.g. 0.87)
  reasons: string[];
  signals: {
    avgImpactScore: number;
    avgRiskScore: number;
    noiseRatio: number;
    testingRatio: number;
    hotspotCount: number;
  };
  generatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();

  // ── Core dashboard data (GET /dashboard/project/:id)
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  // ── Activity timeline (GET /dashboard/project/:id/activity)
  const [activity, setActivity] = useState<any[]>([]);

  // ── ML prediction result (POST /ml/project/:id/analyze)
  const [mlData, setMlData] = useState<MLPrediction | null>(null);

  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [runningML, setRunningML] = useState(false);

  const [
    activeTab,
    setActiveTab,
  ] = useState<'developers' | 'ml'
  >('developers');

  // ── Intelligence endpoints
  const [aiInsights, setAIInsights] = useState<AIInsightsResponse | null>(null);

  // riskDetection: { totalRisks: number; risks: RiskItem[] }
  const [riskDetection, setRiskDetection] = useState<RiskDetectionResponse | null>(null);

  // engineeringHealth: { score, status, metrics, signals }
  const [engineeringHealth, setEngineeringHealth] = useState<EngineeringHealthResponse | null>(null);

  // trends: { healthTrend[], commitTrend[], prTrend[], velocityTrend[] }
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);

  // deltas: { healthDelta, commitDelta, prDelta, velocityDelta }
  const [deltas, setDeltas] = useState<DeltaData | null>(null);

  // forecast: { riskLevel, forecast: string[] }
  const [forecast, setForecast] = useState<ForecastData | null>(null);

  // executiveSummary: { generatedAt, totalInsights, summary: string[] }
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummaryData | null>(null);

  const {
    analysisStatus,
    analysisMessage,
    healthScore: liveHealthScore,
    healthStatus: liveHealthStatus,
    dashboardUpdated,
    resetDashboardUpdated,
    intelligenceUpdated,
    resetIntelligenceUpdated,
  } = useProjectRealtime(projectId);

  // ── Load all intelligence endpoints in parallel
  const loadIntelligence = useCallback(async () => {
    try {
      const [
        insights,
        risks,
        deltasData,
        health,
        forecastData,
        executiveData,
        trendData,
      ] = await Promise.all([
        fetchAIInsights(projectId),       // { totalInsights, insights: string[] }
        fetchRiskDetection(projectId),    // { totalRisks, risks: RiskItem[] }
        fetchProjectDeltas(projectId),    // { healthDelta, commitDelta, prDelta, velocityDelta }
        fetchEngineeringHealth(projectId),// { score, status, metrics, signals }
        fetchForecast(projectId),         // { riskLevel, forecast: string[] }
        fetchExecutiveSummary(projectId), // { generatedAt, totalInsights, summary: string[] }
        fetchProjectTrends(projectId),    // { healthTrend[], commitTrend[], prTrend[], velocityTrend[] }
      ]);

      setAIInsights(insights as AIInsightsResponse);
      setRiskDetection(risks as RiskDetectionResponse);
      setEngineeringHealth(health as EngineeringHealthResponse);
      setDeltas(deltasData as DeltaData);
      setForecast(forecastData as ForecastData);
      setExecutiveSummary(executiveData as ExecutiveSummaryData);
      // trendData is the full TrendsData object — keep the whole thing
      setTrendsData(trendData as TrendsData);

    } catch (error) {
      console.error('Failed loading intelligence', error);
    }
  }, [projectId]);

  // ── Load dashboard + activity + project name
  const loadAll = useCallback(async () => {
    try {
      const [dash, act, projects] = await Promise.all([
        api.dashboard.get(projectId),      // DashboardData
        api.dashboard.activity(projectId), // ActivityPoint[]
        api.projects.list(),               // Project[]
      ]);
      const currentProject = (projects as any[]).find(
        (p: any) => p.id === projectId,
      );
      setDashboard(dash as DashboardData);
      const dashboardData = dash as any;

      if (dashboardData.prediction) {
        console.log(
          'PREDICTION LOADED',
          dashboardData.prediction,
        );
        setMlData({

          projectId,

          projectName:
            currentProject?.name || '',

          projectScore:
            dashboardData.prediction.productivityScore,

          deliveryRisk:
            dashboardData.prediction.deliveryRisk,

          teamHealthStatus:
            dashboardData.prediction.teamHealthStatus,

          forecastConfidence:
            Number(
              dashboardData.prediction.workloadForecast,
            ),

          reasons: [],

          signals: {

            avgImpactScore:
              dashboardData.prediction.avgImpactScore,

            avgRiskScore:
              dashboardData.prediction.avgRiskScore,

            noiseRatio:
              dashboardData.prediction.noiseRatio,

            testingRatio:
              dashboardData.prediction.testingRatio,

            hotspotCount:
              dashboardData.prediction.hotspotCount,
          },

          generatedAt:
            dashboardData.prediction.generatedAt,
        });
      }

      setActivity(act || []);


      if (currentProject?.name) {
        setProjectName(currentProject.name);
      }

    } catch (e: any) {
      toast('error', 'Failed to load dashboard', e.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // ── Bootstrap
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }
    loadAll();
    loadIntelligence();
  }, [projectId, router, loadAll, loadIntelligence]);

  // ── WebSocket: dashboard updated
  useEffect(() => {
    if (dashboardUpdated) {
      toast('success', 'Analysis Complete', 'Dashboard updated successfully');
      loadAll();
      resetDashboardUpdated();
      setAnalyzing(false);
    }
  }, [dashboardUpdated, loadAll, resetDashboardUpdated]);

  // ── WebSocket: intelligence updated
  useEffect(() => {
    if (intelligenceUpdated) {
      loadIntelligence();
      resetIntelligenceUpdated();
    }
  }, [intelligenceUpdated, loadIntelligence, resetIntelligenceUpdated]);

  // ── WebSocket: analysis failed
  useEffect(() => {
    if (analysisStatus === 'FAILED') {
      toast('error', 'Analysis Failed', analysisMessage);
      setAnalyzing(false);
    }
  }, [analysisStatus, analysisMessage]);

  // ─────────────────────────────────────────────
  // ACTION HANDLERS
  // ─────────────────────────────────────────────

  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      await api.projects.analyze(projectId);
      toast('info', 'Analysis Started', 'Live feed activated');
    } catch (e: any) {
      toast('error', 'Failed to analyze', e.message);
      setAnalyzing(false);
    }
  }

  async function handleMLAnalyze() {
    setRunningML(true);
    try {
      const result = await api.ml.analyze(projectId) as MLPrediction;
      setMlData(result);
      setActiveTab('ml');
      // projectScore is a number 0–100
      toast(
        'success',
        'ML Analysis Complete',
        `Score: ${Math.round(result.projectScore)}`,
      );
    } catch (e: any) {
      toast('error', 'ML Error', e.message);
    } finally {
      setRunningML(false);
    }
  }

  // ─────────────────────────────────────────────
  // DERIVED DISPLAY VALUES
  // ─────────────────────────────────────────────

  /**
   * Health score priority:
   * 1. engineeringHealth.score  (GET /analytics/:id/engineering-health → { score, status, ... })
   * 2. liveHealthScore          (WebSocket realtime)
   * 3. dashboard.healthScore    (GET /dashboard/project/:id)
   */
  const displayHealth =
    (engineeringHealth as any)?.score ??
    liveHealthScore ??
    dashboard?.healthScore ??
    0;

  /**
   * Health status priority mirrors above
   */
  const displayStatus =
    (engineeringHealth as any)?.status ||
    liveHealthStatus ||
    dashboard?.healthStatus ||
    'UNKNOWN';

  const isLive = liveHealthScore !== null;

  // Developers from the leaderboard
  const devs = dashboard?.leaderboard?.developers || [];

  // Developer risk entries
  const riskDevs = dashboard?.developerRisk || [];

  const metrics = {
    commits:
      dashboard?.metrics?.totalCommits ||
      dashboard?.leaderboard?.totals?.totalCommits ||
      0,

    totalPRs:
      dashboard?.metrics?.totalPRs ||
      dashboard?.leaderboard?.totals?.totalPRs ||
      0,

    totalIssues:
      dashboard?.metrics?.totalIssues ||
      dashboard?.leaderboard?.totals?.totalIssues ||
      0,

    // avgImpactScore is ML-specific, keep using mlData
    avgImpactScore:
      mlData?.signals?.avgImpactScore ?? 0,


    // Use real risk detection data for these metrics
    avgRiskScore:
      mlData?.signals?.avgRiskScore ?? 0,

    hotspotCount:
      mlData?.signals?.hotspotCount ?? 0,

    // forecastConfidence: Python float 0–1, multiply by 100 for display
    // This is ML-only, keep as is
    forecastConfidence: mlData?.forecastConfidence
      ? Math.round(mlData.forecastConfidence * 100)
      : 0,
  };

  const calculatedDeltas = {
    health: deltas?.healthDelta ?? undefined,
    delivery: deltas?.velocityDelta ?? undefined,
    forecast: deltas?.velocityDelta ?? undefined,
    hotspots: deltas?.prDelta ?? undefined,
    impact: deltas?.commitDelta ?? undefined,
    risk: deltas?.healthDelta ?? undefined,
  };

  const forecastPanelData = mlData ?? null;
  const riskPanelData = mlData ?? null;
  const trendChartData = trendsData?.healthTrend ?? [];

  // ─────────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="page-shell">
        <Sidebar />
        <main className="main-content page-main">
          <NexusPulse size="small" showText text="Loading Dashboard..." />
        </main>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // TABS
  // ─────────────────────────────────────────────

  const tabs = [
    { key: 'developers', label: 'Developers', icon: Users },
    { key: 'ml', label: 'ML', icon: Bot },
  ];

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (

    <div
      className="page-shell"
      style={{
        width: '100%',
        overflowX: 'hidden',
      }}
    >

      <Sidebar />

      <main
        className="
        main-content
        page-main
        project-detail-main
      "
        style={{

          width: '100%',

          minWidth: 0,

          overflowX: 'hidden',

          padding:
            'clamp(0.75rem, 2vw, 1.5rem)',
        }}
      >

        {/* HEADER */}

        <ProjectHeader
          projectName={projectName}
          projectId={projectId}
          repoUrl={dashboard?.repoUrl as string | undefined}
          analysisStatus={analysisStatus}
          analyzing={analyzing}
          runningML={runningML}
          onAnalyze={handleAnalyze}
          onRunML={handleMLAnalyze}
        />

        {/* STATUS */}

        <div
          style={{
            marginBottom: '1rem',
          }}
        >

          <AnalysisStatusBar
            status={analysisStatus}
            message={analysisMessage}
          />

        </div>

        {/* KPI GRID */}

        <div
          style={{

            width: '100%',

            overflow: 'visible',

            paddingTop: '0.5rem',

            marginBottom: '1.5rem',
          }}
        >

          <KPIGrid
            displayHealth={displayHealth}
            displayStatus={displayStatus}
            isLive={isLive}
            metrics={metrics}
            deltas={calculatedDeltas}
            developersCount={devs.length}
          />

        </div>

        {/* EXECUTIVE SUMMARY */}

        <div
          style={{
            marginBottom: '1.5rem',
          }}
        >

          <ExecutiveSummary
            summary={
              executiveSummary?.summary || []
            }
            generatedAt={executiveSummary?.generatedAt}
          />

        </div>

        {/* TREND CHART */}

        <div
          style={{

            width: '100%',

            minWidth: 0,

            overflowX: 'hidden',

            marginBottom: '1.5rem',
          }}
        >

          <EngineeringTrendChart
            trends={
              Array.isArray(
                trendChartData,
              )
                ? trendChartData
                : []
            }
          />

        </div>

        {/* INTELLIGENCE GRID */}

        <div
          style={{

            display: 'grid',

            gridTemplateColumns:
              'repeat(auto-fit,minmax(min(100%,340px),1fr))',

            gap:
              'clamp(1rem,2vw,1.4rem)',

            width: '100%',

            alignItems: 'stretch',

            marginBottom: '1.75rem',

            overflow: 'hidden',

            minWidth: 0,
          }}
        >

          {/* AI INSIGHTS */}

          <div
            style={{

              minWidth: 0,

              width: '100%',

              display: 'flex',

              height: 'screen',
            }}
          >

            <AIInsightsPanel
              insights={
                aiInsights?.insights || []
              }
            />

          </div>

          {/* FORECAST */}

          <div
            style={{

              minWidth: 0,

              width: '100%',

              display: 'flex',
            }}
          >

            <PredictiveForecast
              mlData={forecastPanelData}
            />

          </div>

          {/* RISK */}

          <div
            style={{

              minWidth: 0,

              width: '100%',

              display: 'flex',

              flexDirection: 'column',
            }}
          >

            <RiskDetectionPanel
              mlData={riskPanelData}
            />

          </div>

        </div>

        {/* TABS */}

        <div
          className="tabs-container"
          style={{

            width: '100%',

            overflowX: 'auto',

            marginBottom: '1.5rem',

            scrollbarWidth: 'none',

            msOverflowStyle: 'none',
          }}
        >

          <div
            className="tab-row"
            style={{

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',

              gap: '0.75rem',

              minWidth: 'max-content',

              paddingBottom: 4,
            }}
          >

            {tabs.map((tab) => {

              const Icon =
                tab.icon;

              const active =
                activeTab === tab.key;

              return (

                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(
                      tab.key as typeof activeTab,
                    )
                  }
                  style={{

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent: 'center',

                    gap: '0.55rem',

                    whiteSpace: 'nowrap',

                    flexShrink: 0,

                    minHeight: 48,

                    minWidth: 130,

                    padding:
                      '0.8rem 1.15rem',

                    borderRadius: 14,

                    fontSize: '0.92rem',

                    fontWeight: 700,

                    cursor: 'pointer',

                    transition:
                      'all 0.25s ease',

                    border: active

                      ? '1px solid rgba(37,99,235,0.4)'

                      : '1px solid rgba(148,163,184,0.18)',

                    background: active

                      ? 'linear-gradient(135deg,#2563eb,#1d4ed8)'

                      : 'var(--surface-secondary)',

                    color: active

                      ? '#ffffff'

                      : 'var(--text-primary)',

                    transform: active

                      ? 'translateY(-1px)'

                      : 'translateY(0)',
                  }}
                >

                  <Icon size={17} />

                  <span>
                    {tab.label}
                  </span>

                </button>
              );
            })}

          </div>

        </div>

        {/* TAB CONTENT */}

        <div
          className="
          dashboard-grid
          dashboard-grid-1
        "
          style={{

            width: '100%',

            minWidth: 0,

            overflowX: 'hidden',
          }}
        >

          {activeTab === 'developers' && (

            <div
              style={{
                width: '100%',
                minWidth: 0,
              }}
            >

              <DevelopersTab
                projectId={projectId}
              />

            </div>
          )}

          {activeTab === 'ml' && (

            <div
              style={{
                width: '100%',
                minWidth: 0,
              }}
            >

              <MLTab
                mlData={mlData}
                runningML={runningML}
                onRunML={handleMLAnalyze}
              />

            </div>
          )}

        </div>

      </main>

      <ToastContainer />

    </div>
  );
}
