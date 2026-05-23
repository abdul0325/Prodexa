'use client';

import ChartCard
    from '@/components/project-detail/shared/ChartCard';

interface Props {

    activity?: any[];

    developers?: any[];

    riskDevs?: any[];
}

export default function ChartsTab({

    activity = [],

    developers = [],

    riskDevs = [],

}: Props) {

    return (

        <div
            className="
                grid
                grid-cols-1
                xl:grid-cols-2
                gap-6
                w-full
            "
        >

            {/* ENGINEERING TREND */}

            <ChartCard
                title="Engineering Trend"
            >

                <div
                    className="
                        h-[320px]
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        text-sm
                        rounded-xl
                    "
                >

                    {activity.length > 0
                        ? 'Engineering trend visualization'
                        : 'No engineering trend data available'}

                </div>

            </ChartCard>

            {/* RISK TREND */}

            <ChartCard
                title="Risk Trend"
            >

                <div
                    className="
                        h-[320px]
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        text-sm
                        rounded-xl
                    "
                >

                    {riskDevs.length > 0
                        ? 'Risk analytics visualization'
                        : 'No risk telemetry available'}

                </div>

            </ChartCard>

            {/* DEVELOPER CONTRIBUTIONS */}

            <ChartCard
                title="Developer Contributions"
            >

                <div
                    className="
                        h-[320px]
                        flex
                        flex-col
                        gap-3
                        overflow-y-auto
                        pr-1
                    "
                >

                    {developers.length === 0 ? (

                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                h-full
                                text-slate-400
                                text-sm
                            "
                        >
                            No developer contribution data
                        </div>

                    ) : (

                        developers
                            .slice(0, 8)
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
                                            py-4
                                        "
                                    >

                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >

                                            <div
                                                className="
                                                    font-semibold
                                                    truncate
                                                "
                                            >
                                                {dev?.login ||
                                                    'Unknown'}
                                            </div>

                                            <div
                                                className="
                                                    text-xs
                                                    text-slate-400
                                                    mt-1
                                                "
                                            >
                                                Contributor
                                            </div>

                                        </div>

                                        <div
                                            className="
                                                font-bold
                                                text-base
                                                shrink-0
                                            "
                                        >
                                            {dev?.commits || 0}
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
                        h-[320px]
                        flex
                        flex-col
                        gap-3
                        overflow-y-auto
                        pr-1
                    "
                >

                    {riskDevs.length === 0 ? (

                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                h-full
                                text-slate-400
                                text-sm
                            "
                        >
                            No developer risk analytics
                        </div>

                    ) : (

                        riskDevs
                            .slice(0, 8)
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
                                            py-4
                                        "
                                    >

                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >

                                            <div
                                                className="
                                                    font-semibold
                                                    truncate
                                                "
                                            >
                                                {dev?.developer ||
                                                    'Unknown'}
                                            </div>

                                            <div
                                                className="
                                                    text-xs
                                                    text-red-300
                                                    mt-1
                                                "
                                            >
                                                Risk contributor
                                            </div>

                                        </div>

                                        <div
                                            className="
                                                font-bold
                                                text-red-300
                                                shrink-0
                                            "
                                        >
                                            {dev?.riskScore || 0}
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