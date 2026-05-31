'use client';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
} from 'recharts';

import ChartCard from '@/components/project-detail/shared/ChartCard';

interface Props {
    trends?: any[];
}

export default function EngineeringTrendChart({
    trends = [],
}: Props) {

    const chartData = trends.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString(
            'en-US',
            {
                month: 'short',
                day: 'numeric',
            },
        ),

        health: Number(item.health ?? 0),
        commits: Number(item.commits ?? 0),
        prs: Number(item.prs ?? 0),
    }));
    const hasPRData = chartData.some(
        item => item.prs > 0,
    );
    return (
        <ChartCard
            title="Engineering Intelligence Trends"
            height={520}
        >
            <div
                style={{
                    width: '100%',
                    height: 430,
                }}
            >
                {chartData.length === 0 ? (

                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                        }}
                    >
                        No engineering trend data available
                    </div>

                ) : (

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 10,
                                bottom: 10,
                            }}
                        >

                            <defs>

                                <linearGradient
                                    id="healthGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#22c55e"
                                        stopOpacity={1}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#22c55e"
                                        stopOpacity={0.4}
                                    />
                                </linearGradient>

                                <linearGradient
                                    id="commitGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#3b82f6"
                                        stopOpacity={1}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.4}
                                    />
                                </linearGradient>

                            </defs>

                            <CartesianGrid
                                strokeDasharray="4 4"
                                opacity={0.12}
                            />

                            <XAxis
                                dataKey="date"
                                tick={{
                                    fontSize: 12,
                                }}
                            />

                            {/* Health Axis */}
                            <YAxis
                                yAxisId="health"
                                domain={[0, 100]}
                                width={45}
                            />

                            {/* Commit Axis */}
                            <YAxis
                                yAxisId="commits"
                                orientation="right"
                                width={45}
                            />

                            <Tooltip
                                contentStyle={{
                                    background:
                                        '#0f172a',
                                    border:
                                        '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 12,
                                    color: '#fff',
                                }}
                            />

                            <Legend
                                verticalAlign="top"
                                height={40}
                            />

                            <Line
                                yAxisId="commits"
                                type="monotone"
                                dataKey="commits"
                                name="Commits"
                                stroke="url(#commitGradient)"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{
                                    r: 7,
                                }}
                                animationDuration={1200}
                            />

                            <Line
                                yAxisId="health"
                                type="monotone"
                                dataKey="health"
                                name="Health Score"
                                stroke="url(#healthGradient)"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{
                                    r: 7,
                                }}
                                animationDuration={1200}
                            />
                            {hasPRData && (
                                <Line
                                    yAxisId="health"
                                    type="monotone"
                                    dataKey="prs"
                                    name="Pull Requests"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    activeDot={{
                                        r: 6,
                                    }}
                                    animationDuration={1200}
                                />
                            )}

                        </LineChart>
                    </ResponsiveContainer>

                )}
            </div>
        </ChartCard>
    );
}