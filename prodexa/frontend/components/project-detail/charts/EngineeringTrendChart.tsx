'use client';

import {
    ResponsiveContainer,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    Area,
    ComposedChart,
} from 'recharts';
import { useEffect, useState } from 'react';

import ChartCard from '@/components/project-detail/shared/ChartCard';

interface Props {
    trends?: any[];
}

export default function EngineeringTrendChart({
    trends = [],
}: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const chartData = trends.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }),
        fullDate: new Date(item.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }),
        health: Number(item.health ?? 0),
        commits: Number(item.commits ?? 0),
        prs: Number(item.prs ?? 0),
        contributors: Number(item.contributors ?? 0),
        issues: Number(item.issues ?? 0),
        closedIssues: Number(item.closedIssues ?? 0),
        mergedPRs: Number(item.mergedPRs ?? 0),
        velocity: Number(item.velocity ?? 0),
        averagePRMergeTime: Number(item.averagePRMergeTime ?? 0),
    }));

    const hasPRData = chartData.some(item => item.prs > 0);
    const hasVelocityData = chartData.some(item => item.velocity > 0);
    const hasContributorsData = chartData.some(item => item.contributors > 0);

    const textColor = '#64748b';
    const gridColor = 'rgba(0,0,0,0.06)';

    const formatMergeTime = (hours: number) => {
        if (hours < 24) return `${Math.round(hours)}h`;
        const days = Math.floor(hours / 24);
        const remainingHours = Math.round(hours % 24);
        return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0]?.payload;
            return (
                <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-4 min-w-[260px] backdrop-blur-sm">
                    <p className="text-sm font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">
                        {data?.fullDate || label}
                    </p>
                    
                    <div className="space-y-2">
                        {payload.map((p: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: p.color }}
                                    />
                                    <span className="text-slate-600">{p.name}:</span>
                                </div>
                                <span className="font-semibold text-slate-800">
                                    {p.name === 'Health Score'
                                        ? `${p.value}%`
                                        : p.name === 'Avg Merge Time'
                                        ? formatMergeTime(p.value)
                                        : p.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                        <div>
                            <div className="text-slate-500">Merged PRs</div>
                            <div className="font-semibold text-slate-800 text-base">
                                {data?.mergedPRs ?? 0}
                            </div>
                        </div>
                        <div>
                            <div className="text-slate-500">Issues</div>
                            <div className="font-semibold text-slate-800 text-base">
                                {data?.issues ?? 0}
                            </div>
                        </div>
                        <div>
                            <div className="text-slate-500">Closed Issues</div>
                            <div className="font-semibold text-green-600 text-base">
                                {data?.closedIssues ?? 0}
                            </div>
                        </div>
                        <div>
                            <div className="text-slate-500">Open Issues</div>
                            <div className="font-semibold text-orange-600 text-base">
                                {(data?.issues ?? 0) - (data?.closedIssues ?? 0)}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (!mounted) {
        return (
            <ChartCard title="Engineering Intelligence Trends" height={520}>
                <div className="w-full h-[430px] flex items-center justify-center">
                    <div className="animate-pulse text-slate-400">Loading chart...</div>
                </div>
            </ChartCard>
        );
    }

    return (
        <ChartCard title="Engineering Intelligence Trends" height={520}>
            <div className="w-full h-[430px]">
                {chartData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-sm font-medium">No engineering trend data available</p>
                        <p className="text-xs">Check back later for insights</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                        >
                            <defs>
                                <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid 
                                strokeDasharray="4 4" 
                                stroke={gridColor}
                                vertical={false}
                            />

                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: textColor }}
                                tickLine={{ stroke: textColor }}
                                axisLine={{ stroke: textColor }}
                                interval="preserveStartEnd"
                                padding={{ left: 10, right: 10 }}
                            />

                            <YAxis
                                yAxisId="health"
                                domain={[0, 100]}
                                tick={{ fontSize: 11, fill: textColor }}
                                tickLine={{ stroke: textColor }}
                                axisLine={{ stroke: textColor }}
                                label={{
                                    value: 'Health Score (%)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { fill: textColor, fontSize: 10, fontWeight: 500 },
                                    offset: 10,
                                }}
                            />

                            <YAxis
                                yAxisId="activity"
                                orientation="right"
                                tick={{ fontSize: 11, fill: textColor }}
                                tickLine={{ stroke: textColor }}
                                axisLine={{ stroke: textColor }}
                                label={{
                                    value: 'Activity Count',
                                    angle: 90,
                                    position: 'insideRight',
                                    style: { fill: textColor, fontSize: 10, fontWeight: 500 },
                                    offset: 10,
                                }}
                            />

                            <Tooltip content={<CustomTooltip />} />

                            <Legend
                                verticalAlign="top"
                                height={45}
                                iconType="circle"
                                wrapperStyle={{
                                    fontSize: 12,
                                    paddingBottom: 10,
                                }}
                            />

                            <Area
                                yAxisId="health"
                                type="monotone"
                                dataKey="health"
                                name="Health Score"
                                stroke="#22c55e"
                                strokeWidth={3}
                                fill="url(#healthGradient)"
                                dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 7, strokeWidth: 2, stroke: "#fff" }}
                                animationDuration={1500}
                                animationEasing="ease-out"
                            />

                            <Line
                                yAxisId="activity"
                                type="monotone"
                                dataKey="commits"
                                name="Commits"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                dot={{ r: 3, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                                animationDuration={1500}
                                animationEasing="ease-out"
                            />

                            {hasPRData && (
                                <Line
                                    yAxisId="activity"
                                    type="monotone"
                                    dataKey="prs"
                                    name="Pull Requests"
                                    stroke="#f59e0b"
                                    strokeWidth={2.5}
                                    strokeDasharray="6 4"
                                    dot={{ r: 3, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                            )}

                            {hasVelocityData && (
                                <Area
                                    yAxisId="activity"
                                    type="monotone"
                                    dataKey="velocity"
                                    name="Velocity"
                                    stroke="#8b5cf6"
                                    strokeWidth={2.5}
                                    fill="url(#velocityGradient)"
                                    dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                            )}

                            {hasContributorsData && (
                                <Line
                                    yAxisId="activity"
                                    type="monotone"
                                    dataKey="contributors"
                                    name="Contributors"
                                    stroke="#ec4899"
                                    strokeWidth={2.5}
                                    dot={{ r: 3, fill: "#ec4899", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Responsive Summary Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-4 pt-4 ">
                <div className="text-center p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-transparent">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                        {chartData.at(-1)?.health ?? 0}%
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Health Score</div>
                    {chartData.length > 1 && (
                        <div className="text-xs mt-1">
                            {(() => {
                                const change = (chartData.at(-1)?.health ?? 0) - (chartData.at(-2)?.health ?? 0);
                                if (change === 0) return <span className="text-slate-400">→ 0%</span>;
                                return change > 0 
                                    ? <span className="text-emerald-500">↑ +{change}%</span>
                                    : <span className="text-red-500">↓ {change}%</span>;
                            })()}
                        </div>
                    )}
                </div>

                <div className="text-center p-2 rounded-lg bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-transparent">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {chartData.reduce((sum, d) => sum + d.commits, 0)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Total Commits</div>
                    <div className="text-xs text-slate-400 mt-1">
                        avg {Math.round(chartData.reduce((sum, d) => sum + d.commits, 0) / chartData.length)}/day
                    </div>
                </div>

                <div className="text-center p-2 rounded-lg bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-transparent">
                    <div className="text-xl sm:text-2xl font-bold text-violet-600">
                        {chartData.at(-1)?.velocity?.toFixed(1) ?? 0}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Velocity</div>
                    <div className="text-xs text-slate-400 mt-1">commits/day</div>
                </div>

                <div className="text-center p-2 rounded-lg bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/20 dark:to-transparent">
                    <div className="text-xl sm:text-2xl font-bold text-pink-600">
                        {chartData.at(-1)?.contributors ?? 0}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Contributors</div>
                    <div className="text-xs text-slate-400 mt-1">active devs</div>
                </div>

                <div className="text-center p-2 rounded-lg bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-transparent">
                    <div className="text-xl sm:text-2xl font-bold text-amber-600">
                        {chartData.at(-1)?.mergedPRs ?? 0}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Merged PRs</div>
                    <div className="text-xs text-slate-400 mt-1">
                        {((chartData.at(-1)?.mergedPRs ?? 0) / ((chartData.at(-1)?.prs ?? 1)) * 100).toFixed(0)}% merge rate
                    </div>
                </div>

                <div className="text-center p-2 rounded-lg bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/20 dark:to-transparent">
                    <div className="text-xl sm:text-2xl font-bold text-cyan-600">
                        {formatMergeTime(chartData.at(-1)?.averagePRMergeTime ?? 0)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Avg Merge Time</div>
                    <div className="text-xs text-slate-400 mt-1">PR to merge</div>
                </div>
            </div>
        </ChartCard>
    );
}