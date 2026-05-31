'use client';

import StatCard
    from '@/components/project-detail/stats/StatCard';

interface Props {

    displayHealth: number;

    displayStatus: string;

    isLive?: boolean;

    metrics?: any;

    deltas?: any;

    developersCount?: number;
}

export default function KPIGrid({

    displayHealth,

    displayStatus,

    isLive = false,

    metrics = {},

    deltas = {},

    developersCount = 0,

}: Props) {

    const impactScore =
        metrics?.avgImpactScore || 0;

    const riskScore =
        metrics?.avgRiskScore || 0;

    const hotspotCount =
        metrics?.hotspotCount || 0;

    const forecastConfidence =
        metrics?.forecastConfidence || 0;

    return (

       <div className="kpi-grid">

            <StatCard
                label="Engineering Health"
                value={displayHealth}
                sub={
                    isLive
                        ? 'Realtime engineering telemetry'
                        : 'Engineering health score'
                }
                color="var(--success)"
                updating={isLive}
                delta={deltas?.health}
            />

            <StatCard
                label="Delivery Status"
                value={displayStatus}
                sub="Predictive delivery intelligence"
                color="var(--warning)"
                updating={isLive}
                delta={deltas?.delivery}
            />

            <StatCard
                label="Forecast Confidence"
                value={`${Math.round(forecastConfidence)}%`}
                sub="ML prediction confidence"
                color="var(--accent)"
                updating={isLive}
                delta={deltas?.forecast}
            />

            <StatCard
                label="Hotspot Count"
                value={hotspotCount}
                sub="Unstable engineering modules"
                color="var(--danger)"
                updating={isLive}
                delta={deltas?.hotspots}
            />

            <StatCard
                label="Impact Score"
                value={Math.round(impactScore)}
                sub="Commit impact intelligence"
                color="var(--accent)"
                updating={isLive}
                delta={deltas?.impact}
            />

            <StatCard
                label="Risk Score"
                value={Math.round(riskScore)}
                sub="Engineering instability score"
                color="var(--danger)"
                updating={isLive}
                delta={deltas?.risk}
            />

            <StatCard
                label="Developers"
                value={developersCount}
                sub="Active engineering contributors"
                color="var(--success)"
                updating={isLive}
            />

            <StatCard
                label="Commits"
                value={metrics?.commits || 0}
                sub="Tracked engineering commits"
                color="var(--accent)"
                updating={isLive}
            />

        </div>
    );
}