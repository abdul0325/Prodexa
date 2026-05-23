'use client';

import { useEffect, useState } from 'react';

import ChartCard
    from '@/components/project-detail/shared/ChartCard';

import EngineeringTrendChart
    from '@/components/project-detail/charts/EngineeringTrendChart';

import { fetchProjectTrends, fetchProjectLeaderboard, fetchProjectRisk } from '@/lib/api';

interface Props {

    projectId: string;
}

export default function ChartsTab({

    projectId,

}: Props) {

    const [trendsData, setTrendsData] = useState<any>(null);
    const [leaderboardData, setLeaderboardData] = useState<any>(null);
    const [riskData, setRiskData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);

                const [trends, leaderboard, risk] = await Promise.all([

                    fetchProjectTrends(projectId),

                    fetchProjectLeaderboard(projectId),

                    fetchProjectRisk(projectId),

                ]);

                setTrendsData(trends);

                setLeaderboardData(leaderboard);

                setRiskData(risk);

            } catch (error) {

                console.error('Error fetching chart data:', error);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, [projectId]);

    if (loading) {

        return (

            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-2
                    gap-6
                    w-full
                    auto-rows-min
                "
            >

                <div
                    className="
                        xl:col-span-2
                    "
                >

                    <ChartCard
                        title="Engineering Trend"
                    >

                        <div
                            className="
                                min-h-[400px]
                                flex
                                items-center
                                justify-center
                                text-slate-400
                                text-sm
                            "
                        >
                            Loading chart data...
                        </div>

                    </ChartCard>

                </div>

                <ChartCard
                    title="Developer Contributions"
                >

                    <div
                        className="
                            h-48
                            flex
                            items-center
                            justify-center
                            text-slate-400
                            text-sm
                        "
                    >
                        Loading developer data...
                    </div>

                </ChartCard>

                <ChartCard
                    title="Engineering Risk Distribution"
                >

                    <div
                        className="
                            h-48
                            flex
                            items-center
                            justify-center
                            text-slate-400
                            text-sm
                        "
                    >
                        Loading risk data...
                    </div>

                </ChartCard>

            </div>

        );
    }

    return (

        <div
            className="
                grid
                grid-cols-1
                xl:grid-cols-2
                gap-6
                w-full
                auto-rows-min
            "
        >

            {/* ENGINEERING TREND - Full width for better chart visibility */}

            <div
                className="
                    xl:col-span-2
                "
            >

                <ChartCard
                    title="Engineering Trend"
                >

                    <div
                        className="
                            min-h-[400px]
                        "
                    >

                        <EngineeringTrendChart
                            trends={trendsData?.healthTrend || []}
                        />

                    </div>

                </ChartCard>

            </div>

            {/* DEVELOPER CONTRIBUTIONS */}

            <ChartCard
                title="Developer Contributions"
            >

                <div
                    className="
                        max-h-[400px]
                        flex
                        flex-col
                        gap-3
                        overflow-y-auto
                        pr-1
                    "
                >

                    {!leaderboardData?.leaderboard || leaderboardData.leaderboard.length === 0 ? (

                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                h-48
                                text-slate-400
                                text-sm
                            "
                        >
                            No developer contribution data
                        </div>

                    ) : (

                        leaderboardData.leaderboard
                            .slice(0, 10)
                            .map(

                                (
                                    dev: any,
                                    index: number,
                                ) => (

                                    <div
                                        key={index}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            rounded-xl
                                            border
                                            border-white/5
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            hover:bg-white/[0.05]
                                            transition-colors
                                        "
                                    >

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            <div
                                                className="
                                                    font-semibold
                                                    truncate
                                                    text-sm
                                                "
                                            >
                                                {dev?.developer ||
                                                    'Unknown'}
                                            </div>

                                            <div
                                                className="
                                                    text-xs
                                                    text-slate-400
                                                    mt-0.5
                                                "
                                            >
                                                Contributor
                                            </div>

                                        </div>

                                        <div
                                            className="
                                                flex
                                                gap-4
                                                items-center
                                            "
                                        >

                                            <div
                                                className="
                                                    text-right
                                                "
                                            >

                                                <div
                                                    className="
                                                        font-bold
                                                        text-base
                                                    "
                                                >
                                                    {dev?.commits || 0}
                                                </div>

                                                <div
                                                    className="
                                                        text-xs
                                                        text-slate-400
                                                    "
                                                >
                                                    Commits
                                                </div>

                                            </div>

                                            <div
                                                className="
                                                    text-right
                                                "
                                            >

                                                <div
                                                    className="
                                                        font-bold
                                                        text-base
                                                    "
                                                >
                                                    {dev?.prs || 0}
                                                </div>

                                                <div
                                                    className="
                                                        text-xs
                                                        text-slate-400
                                                    "
                                                >
                                                    PRs
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ),
                            )

                    )}

                </div>

            </ChartCard>

            {/* RISK DISTRIBUTION */}

            <ChartCard
                title="Engineering Risk Distribution"
            >

                <div
                    className="
                        max-h-[400px]
                        flex
                        flex-col
                        gap-3
                        overflow-y-auto
                        pr-1
                    "
                >

                    {!riskData?.riskDevelopers || riskData.riskDevelopers.length === 0 ? (

                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                h-48
                                text-slate-400
                                text-sm
                            "
                        >
                            No developer risk analytics
                        </div>

                    ) : (

                        riskData.riskDevelopers
                            .slice(0, 10)
                            .map(

                                (
                                    dev: any,
                                    index: number,
                                ) => (

                                    <div
                                        key={index}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            rounded-xl
                                            border
                                            border-red-500/15
                                            bg-red-500/5
                                            px-4
                                            py-3
                                            hover:bg-red-500/10
                                            transition-colors
                                        "
                                    >

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            <div
                                                className="
                                                    font-semibold
                                                    truncate
                                                    text-sm
                                                "
                                            >
                                                {dev?.developer ||
                                                    'Unknown'}
                                            </div>

                                            <div
                                                className="
                                                    text-xs
                                                    text-red-300
                                                    mt-0.5
                                                "
                                            >
                                                {dev?.risk === 'Inactive'
                                                    ? 'Inactive contributor'
                                                    : 'Active contributor'}
                                            </div>

                                        </div>

                                        <div
                                            className="
                                                font-bold
                                                text-red-300
                                                text-base
                                            "
                                        >
                                            {dev?.daysSinceLastCommit || 0}d
                                        </div>

                                    </div>

                                ),
                            )

                    )}

                </div>

            </ChartCard>

        </div>

    );
}