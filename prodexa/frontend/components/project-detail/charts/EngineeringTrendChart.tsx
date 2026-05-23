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

import ChartCard
    from '@/components/project-detail/shared/ChartCard';

interface Props {

    trends?: any[];
}

export default function EngineeringTrendChart({

    trends = [],

}: Props) {

    const chartData =
        trends?.map((item: any, index: number) => ({

            date:
                new Date(item.date)
                    .toLocaleDateString(
                        'en-US',
                        {
                            month: 'short',
                            day: 'numeric',
                        },
                    ),

            health:
                item?.health || 0,

            commits:
                item?.commits || 0,

            prs:
                item?.prs || 0,

        })) || [];

    return (

        <ChartCard
            title="Engineering Intelligence Trends"
        >

            <div
                style={{
                    height: 360,
                }}
            >

                {chartData.length === 0 ? (

                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color:
                                'var(--text-muted)',
                            fontSize: '0.9rem',
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
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                opacity={0.08}
                            />

                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                tick={{
                                    fontSize: 12,
                                }}
                            />

                            <YAxis
                                stroke="#94a3b8"
                                tick={{
                                    fontSize: 12,
                                }}
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

                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="health"
                                name="Health"
                                stroke="#22c55e"
                                strokeWidth={3}
                                dot={false}
                            />

                            <Line
                                type="monotone"
                                dataKey="commits"
                                name="Commits"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={false}
                            />

                            <Line
                                type="monotone"
                                dataKey="prs"
                                name="PRs"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                dot={false}
                            />


                        </LineChart>

                    </ResponsiveContainer>

                )}

            </div>

        </ChartCard>
    );
}