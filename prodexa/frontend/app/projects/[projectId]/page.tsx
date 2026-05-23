'use client';

import {
  useState,
  useEffect,
  use,
  useCallback,
} from 'react';

import { useRouter }
  from 'next/navigation';

import Sidebar
  from '@/components/layout/Sidebar';

import {
  AnalysisStatusBar,
} from '@/components/ui/AnalysisStatus';

import {
  ToastContainer,
  toast,
} from '@/components/ui/Toast';

import {
  useProjectRealtime,
} from '@/hooks/useSocket';

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

import {
  NexusPulse,
} from '@/components/loader/NexusPulse';

import ProjectHeader
  from '@/components/project-detail/header/ProjectHeader';

import KPIGrid
  from '@/components/project-detail/stats/KPIGrid';

import ExecutiveSummary
  from '@/components/project-detail/intelligence/ExecutiveSummary';

import AIInsightsPanel
  from '@/components/project-detail/intelligence/AIInsightsPanel';

import PredictiveForecast
  from '@/components/project-detail/intelligence/PredictiveForecast';

import RiskDetectionPanel
  from '@/components/project-detail/intelligence/RiskDetectionPanel';

import EngineeringTrendChart
  from '@/components/project-detail/charts/EngineeringTrendChart';

import ChartsTab
  from '@/components/project-detail/tabs/ChartsTab';

import DevelopersTab
  from '@/components/project-detail/tabs/DevelopersTab';

import MLTab
  from '@/components/project-detail/tabs/MLTab';

import LiveTab
  from '@/components/project-detail/tabs/LiveTab';

import {
  AIInsightsResponse,
  RiskDetectionResponse,
  EngineeringHealthResponse,
} from '@/types/intelligence';

import {
  BarChart3,
  TrendingUp,
  Users,
  Bot,
  Zap,
} from 'lucide-react';


export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{
    projectId: string;
  }>;
}) {

  const { projectId } =
    use(params);

  const router =
    useRouter();

  const [
    dashboard,
    setDashboard,
  ] = useState<any>(null);

  const [
    activity,
    setActivity,
  ] = useState<any[]>([]);

  const [
    mlData,
    setMlData,
  ] = useState<any>(null);

  const [
    projectName,
    setProjectName,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    analyzing,
    setAnalyzing,
  ] = useState(false);

  const [
    runningML,
    setRunningML,
  ] = useState(false);

  const [
    activeTab,
    setActiveTab,
  ] = useState<
    'charts' |
    'developers' |
    'ml' |
    'live'
  >('charts');

  const [
    aiInsights,
    setAIInsights,
  ] = useState<AIInsightsResponse | null>(null);

  const [
    riskDetection,
    setRiskDetection,
  ] = useState<RiskDetectionResponse | null>(null);

  const [
    engineeringHealth,
    setEngineeringHealth,
  ] = useState<EngineeringHealthResponse | null>(null);

  const [
    trends,
    setTrends,
  ] = useState<any>(null);

  const [
    deltas,
    setDeltas,
  ] = useState<any>(null);

  const [
    forecast,
    setForecast,
  ] = useState<any>(null);

  const [
    executiveSummary,
    setExecutiveSummary,
  ] = useState<any>(null);

  const {

    analysisStatus,
    analysisMessage,

    healthScore:
    liveHealthScore,

    healthStatus:
    liveHealthStatus,

    liveDevs,

    dashboardUpdated,
    resetDashboardUpdated,

    intelligenceUpdated,
    resetIntelligenceUpdated,

  } = useProjectRealtime(projectId);

  const loadIntelligence =
    useCallback(async () => {

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

          fetchAIInsights(projectId),

          fetchRiskDetection(projectId),

          fetchProjectDeltas(projectId),

          fetchEngineeringHealth(projectId),

          fetchForecast(projectId),

          fetchExecutiveSummary(projectId),

          fetchProjectTrends(projectId),
        ]);

        setAIInsights(insights);

        setRiskDetection(risks);

        setEngineeringHealth(health);

        setDeltas(deltasData);

        setForecast(forecastData);

        setExecutiveSummary(executiveData);

        setTrends(
          trendData?.healthTrend || [],
        );

      } catch (error) {

        console.error(
          'Failed loading intelligence',
          error,
        );
      }

    }, [projectId]);

  const loadAll =
    useCallback(async () => {

      try {

        const [
          dash,
          act,
          projects,
        ] = await Promise.all([

          api.dashboard.get(projectId),

          api.dashboard.activity(projectId),

          api.projects.list(),
        ]);

        setDashboard(dash);

        setActivity(
          act || [],
        );

        const currentProject =
          projects.find(
            (p: any) =>
              p.id === projectId,
          );

        if (
          currentProject?.name
        ) {

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

    if (
      !isAuthenticated()
    ) {

      router.push('/');

      return;
    }

    loadAll();

    loadIntelligence();

  }, [
    projectId,
    router,
    loadAll,
    loadIntelligence,
  ]);

  useEffect(() => {

    if (
      dashboardUpdated
    ) {

      toast(
        'success',
        'Analysis Complete',
        'Dashboard updated successfully',
      );

      loadAll();

      resetDashboardUpdated();

      setAnalyzing(false);
    }

  }, [
    dashboardUpdated,
    loadAll,
    resetDashboardUpdated,
  ]);

  useEffect(() => {

    if (
      intelligenceUpdated
    ) {

      loadIntelligence();

      resetIntelligenceUpdated();
    }

  }, [
    intelligenceUpdated,
    loadIntelligence,
    resetIntelligenceUpdated,
  ]);

  useEffect(() => {

    if (
      analysisStatus ===
      'ANALYZING' &&
      liveDevs.length > 0
    ) {

      setActiveTab('live');
    }

  }, [
    analysisStatus,
    liveDevs.length,
  ]);

  useEffect(() => {

    if (
      analysisStatus ===
      'FAILED'
    ) {

      toast(
        'error',
        'Analysis Failed',
        analysisMessage,
      );

      setAnalyzing(false);
    }

  }, [
    analysisStatus,
    analysisMessage,
  ]);

  async function handleAnalyze() {

    setAnalyzing(true);

    setActiveTab('live');

    try {

      await api.projects
        .analyze(projectId);

      toast(
        'info',
        'Analysis Started',
        'Live feed activated',
      );

    } catch (e: any) {

      toast(
        'error',
        'Failed to analyze',
        e.message,
      );

      setAnalyzing(false);
    }
  }

  async function handleMLAnalyze() {

    setRunningML(true);

    try {

      const result =
        await api.ml
          .analyze(projectId);

      setMlData(result);

      setActiveTab('ml');

      toast(
        'success',
        'ML Analysis Complete',
        `Score ${result.projectScore}`,
      );

    } catch (e: any) {

      toast(
        'error',
        'ML Error',
        e.message,
      );

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
    'UNKNOWN';

  const isLive =
    liveHealthScore !== null;

  const devs =
    dashboard?.leaderboard?.developers || [];

  const riskDevs =
    dashboard?.developerRisk || [];

  const metrics = {

    commits:
      dashboard?.metrics?.totalCommits ||

      dashboard?.leaderboard?.totals?.totalCommits ||

      activity?.length ||

      0,

    totalPRs:
      dashboard?.metrics?.totalPRs ||

      dashboard?.leaderboard?.totals?.totalPRs ||

      0,

    totalIssues:
      dashboard?.metrics?.totalIssues ||

      dashboard?.leaderboard?.totals?.totalIssues ||

      0,

    avgImpactScore:
      mlData?.signals?.avgImpactScore ||

      forecast?.signals?.avgImpactScore ||

      riskDetection?.signals?.avgImpactScore ||

      Math.round(
        (
          dashboard?.metrics?.totalCommits || 0
        ) * 0.35,
      ),

    avgRiskScore:
      mlData?.signals?.avgRiskScore ||

      forecast?.signals?.avgRiskScore ||

      riskDetection?.signals?.avgRiskScore ||

      Math.round(
        (
          dashboard?.metrics?.totalIssues || 0
        ) * 0.5,
      ),

    hotspotCount:
      mlData?.signals?.hotspotCount ||

      forecast?.signals?.hotspotCount ||

      riskDetection?.signals?.hotspotCount ||

      Math.max(
        0,
        Math.round(
          (
            dashboard?.metrics?.totalPRs || 0
          ) / 5,
        ),
      ),

    forecastConfidence:
      mlData?.forecastConfidence ||

      forecast?.forecastConfidence ||

      95,
  };

  const tabs = [

    {
      key: 'charts',
      label: 'Charts',
      icon: TrendingUp,
    },

    {
      key: 'developers',
      label: 'Developers',
      icon: Users,
    },

    {
      key: 'ml',
      label: 'ML',
      icon: Bot,
    },

    {
      key: 'live',
      label: 'Live',
      icon: Zap,
    },

  ];

  if (loading) {

    return (

      <div className="page-shell">

        <Sidebar />

        <main className="main-content page-main">

          <NexusPulse
            size="small"
            showText
            text="Loading Dashboard..."
          />

        </main>

      </div>
    );
  }
  const latestPrediction =
    dashboard?.predictions?.[0];

  const previousPrediction =
    dashboard?.predictions?.[1];

  const calculateDelta = (
    current?: number,
    previous?: number,
  ) => {

    if (
      current === undefined ||
      previous === undefined ||
      previous === 0
    ) {
      return undefined;
    }

    return Math.round(
      ((current - previous) / previous) * 100,
    );
  };

  const calculatedDeltas = {

    health:
      deltas?.healthDelta,

    delivery:
      deltas?.velocityDelta,

    forecast:
      deltas?.velocityDelta,

    hotspots:
      deltas?.prDelta,

    impact:
      deltas?.commitDelta,

    risk:
      deltas?.healthDelta,
  };

  return (

    <div className="page-shell">

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
        }}
      >

        {/* HEADER */}

        <ProjectHeader
          projectName={projectName}
          projectId={projectId}
          repoUrl={dashboard?.repoUrl}
          analysisStatus={analysisStatus}
          analyzing={analyzing}
          runningML={runningML}
          onAnalyze={handleAnalyze}
          onRunML={handleMLAnalyze}
        />

        {/* STATUS */}

        <AnalysisStatusBar
          status={analysisStatus}
          message={analysisMessage}
        />

        {/* KPI */}

        <KPIGrid
          displayHealth={displayHealth}
          displayStatus={displayStatus}
          isLive={isLive}
          metrics={metrics}
          deltas={calculatedDeltas}
          developersCount={devs.length}
          totalCommits={
            dashboard?.analytics?.totalCommits ||
            0
          }
        />

        {/* EXECUTIVE */}

        <ExecutiveSummary
          summary={
            executiveSummary?.summary || []
          }
        />

        {/* TREND CHART */}

        <div
          style={{
            width: '100%',
            minWidth: 0,
            marginBottom: '1.5rem',
          }}
        >

          <EngineeringTrendChart
            trends={trends}
          />

        </div>

        {/* INTELLIGENCE GRID */}

        <div
          style={{
            display: 'grid',

            gridTemplateColumns:
              'repeat(auto-fit, minmax(320px, 1fr))',

            gap: '1.5rem',

            marginBottom: '1.5rem',

            width: '100%',
          }}
        >

          <AIInsightsPanel
            insights={
              aiInsights?.insights ||
              aiInsights ||
              []
            }
          />

          <PredictiveForecast
            mlData={mlData || forecast}
          />

          <RiskDetectionPanel
            mlData={mlData || riskDetection}
          />

        </div>

        {/* TABS */}

        <div
          className="tabs-container"
          style={{
            width: '100%',
            marginBottom: '1.5rem',
          }}
        >

          <div
            className="tab-row"
            style={{

              display: 'flex',

              alignItems: 'center',

              gap: '0.75rem',

              width: '100%',

              overflowX: 'auto',

              overflowY: 'hidden',

              paddingBottom: 4,

              scrollbarWidth: 'none',

              msOverflowStyle: 'none',
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
                      tab.key as any,
                    )
                  }
                  className={
                    active
                      ? 'tab-active'
                      : 'tab-button'
                  }
                  style={{

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent: 'center',

                    gap: '0.55rem',

                    whiteSpace: 'nowrap',

                    flexShrink: 0,

                    minHeight: 46,

                    padding:
                      '0.75rem 1rem',

                    borderRadius: 14,

                    fontSize: '0.9rem',

                    fontWeight: 600,

                    transition:
                      'all 0.2s ease',
                  }}
                >

                  <Icon size={16} />

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
          }}
        >

          {activeTab ===
            'charts' && (

              <ChartsTab
                activity={activity}
                developers={devs}
                riskDevs={riskDevs}
              />
            )}

          {activeTab ===
            'developers' && (

              <DevelopersTab
                developers={devs}
              />
            )}

          {activeTab ===
            'ml' && (

              <MLTab
                mlData={mlData}
                runningML={runningML}
                onRunML={
                  handleMLAnalyze
                }
              />
            )}

          {activeTab ===
            'live' && (

              <LiveTab
                liveDevs={liveDevs}
                analysisStatus={analysisStatus}
              />
            )}

        </div>

      </main>

      <ToastContainer />

    </div>
  );
}