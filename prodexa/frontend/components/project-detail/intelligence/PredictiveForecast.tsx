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

       <div
    className="card"
    style={{

        width: '100%',

        minWidth: 0,

        overflow: 'hidden',
    }}
>

    {/* HEADER */}

    <div
        style={{

            display: 'flex',

            alignItems: 'flex-start',

            justifyContent: 'space-between',

            marginBottom: '1.5rem',

            gap: '1rem',

            flexWrap: 'wrap',
        }}
    >

        <div
            style={{
                minWidth: 0,
                flex: 1,
            }}
        >

            <h3
                style={{

                    marginBottom: 6,

                    fontSize:
                        'clamp(1rem, 2vw, 1.15rem)',

                    lineHeight: 1.2,

                    wordBreak: 'break-word',
                }}
            >
                Predictive Forecast
            </h3>

            <div
                style={{

                    fontSize: '0.82rem',

                    color:
                        'var(--text-muted)',

                    lineHeight: 1.5,
                }}
            >
                ML-powered engineering forecasting
            </div>

        </div>

        <div
            className="badge badge-warning"
            style={{

                flexShrink: 0,

                whiteSpace: 'nowrap',

                minHeight: 34,

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center',

                padding:
                    '0.45rem 0.8rem',

                borderRadius: 999,
            }}
        >
            ML
        </div>

    </div>

    {/* LOADING */}

    {loading ? (

        <div
            style={{

                padding: '1rem',

                borderRadius: 14,

                background:
                    'rgba(255,255,255,0.03)',

                color:
                    'var(--text-muted)',

                fontSize: '0.92rem',

                lineHeight: 1.6,
            }}
        >
            Running predictive models...
        </div>

    ) : (

        <>

            {/* STATS */}

            <div
                style={{

                    display: 'grid',

                    gridTemplateColumns:
                        'repeat(auto-fit,minmax(180px,1fr))',

                    gap: '1rem',

                    width: '100%',
                }}
            >

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

            {/* NARRATIVE */}

            <div
                style={{

                    marginTop: '1.5rem',

                    padding:
                        '1rem clamp(1rem,2vw,1.25rem)',

                    borderRadius: 16,

                    background:
                        'rgba(255,255,255,0.03)',

                    border:
                        '1px solid rgba(148,163,184,0.12)',

                    overflow: 'hidden',
                }}
            >

                <div
                    style={{

                        fontSize: '0.86rem',

                        color:
                            'var(--text-muted)',

                        marginBottom: 12,

                        fontWeight: 700,

                        letterSpacing: 0.2,
                    }}
                >
                    Forecast Narrative
                </div>

                <div
                    style={{

                        lineHeight: 1.85,

                        color:
                            'var(--text-secondary)',

                        fontSize:
                            'clamp(0.9rem,1.5vw,0.96rem)',

                        wordBreak: 'break-word',
                    }}
                >
                    {healthNarrative}
                </div>

            </div>

            {/* REASONS */}

            {reasons.length > 0 && (

                <div
                    style={{

                        marginTop: '1rem',

                        display: 'flex',

                        flexDirection: 'column',

                        gap: '0.75rem',

                        width: '100%',
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
                                        '0.95rem 1rem',

                                    borderRadius: 14,

                                    background:
                                        'rgba(245,158,11,0.08)',

                                    border:
                                        '1px solid rgba(245,158,11,0.15)',

                                    color:
                                        '#fcd34d',

                                    fontSize:
                                        '0.88rem',

                                    lineHeight: 1.7,

                                    wordBreak:
                                        'break-word',

                                    overflowWrap:
                                        'break-word',
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