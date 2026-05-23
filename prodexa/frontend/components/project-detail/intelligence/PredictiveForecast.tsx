'use client';

import StatCard
    from '@/components/project-detail/stats/StatCard';

interface Props {

    mlData?: any;

    loading?: boolean;
}

export default function PredictiveForecast({

    mlData,

    loading = false,

}: Props) {

    const confidence =
        Math.round(
            (mlData?.forecastConfidence || 0.95)
            * 100,
        );

    const projectScore =
        mlData?.projectScore || 0;

    const deliveryRisk =
        mlData?.deliveryRisk || 'LOW';

    const reasons =
        mlData?.reasons || [];

    const healthNarrative =
        projectScore >= 80
            ? 'Engineering systems appear stable with strong delivery confidence and healthy development velocity.'
            : projectScore >= 60
                ? 'Project delivery remains relatively stable, though several engineering signals require monitoring.'
                : projectScore >= 40
                    ? 'Engineering instability patterns detected. Delivery confidence may degrade if current trends continue.'
                    : 'Critical engineering instability detected. Immediate architectural intervention is recommended.';

    return (

        <div className="card">

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}
            >

                <div>

                    <h3
                        style={{
                            marginBottom: 4,
                        }}
                    >
                        Predictive Forecast
                    </h3>

                    <div
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                        }}
                    >
                        ML-powered engineering forecasting
                    </div>

                </div>

                <div
                    className="badge badge-warning"
                >
                    ML
                </div>

            </div>

            {loading ? (

                <div
                    style={{
                        padding: '1rem',
                        borderRadius: 14,
                        background:
                            'rgba(255,255,255,0.03)',
                        color:
                            'var(--text-muted)',
                    }}
                >
                    Running predictive models...
                </div>

            ) : (

                <>

                    <div className="stats-grid">

                        <StatCard
                            label="Forecast Confidence"
                            value={`${confidence}%`}
                            sub="Prediction confidence"
                            color="var(--accent)"
                        />

                        <StatCard
                            label="Delivery Risk"
                            value={deliveryRisk}
                            sub="Predicted delivery stability"
                            color="var(--warning)"
                        />

                        <StatCard
                            label="Engineering Health"
                            value={projectScore}
                            sub="Predicted engineering score"
                            color="var(--success)"
                        />

                    </div>

                    <div
                        style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            borderRadius: 14,
                            background:
                                'rgba(255,255,255,0.03)',
                            border:
                                '1px solid rgba(255,255,255,0.05)',
                        }}
                    >

                        <div
                            style={{
                                fontSize: '0.85rem',
                                color:
                                    'var(--text-muted)',
                                marginBottom: 10,
                                fontWeight: 600,
                            }}
                        >
                            Forecast Narrative
                        </div>

                        <div
                            style={{
                                lineHeight: 1.8,
                                color:
                                    'var(--text-secondary)',
                                fontSize: '0.92rem',
                            }}
                        >
                            {healthNarrative}
                        </div>

                    </div>

                    {reasons.length > 0 && (

                        <div
                            style={{
                                marginTop: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                            }}
                        >

                            {reasons.map(

                                (
                                    reason: string,
                                    index: number,
                                ) => (

                                    <div
                                        key={index}
                                        style={{
                                            padding:
                                                '0.9rem 1rem',

                                            borderRadius: 12,

                                            background:
                                                'rgba(245,158,11,0.08)',

                                            border:
                                                '1px solid rgba(245,158,11,0.15)',

                                            color:
                                                '#fcd34d',

                                            fontSize:
                                                '0.88rem',
                                        }}
                                    >
                                        {reason}
                                    </div>

                                ),
                            )}

                        </div>

                    )}

                </>

            )}

        </div>
    );
}