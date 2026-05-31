'use client';

import RiskBadge
    from '@/components/project-detail/stats/RiskBadge';

interface Props {

    mlData?: any;

    runningML?: boolean;

    onRunML?: () => void;
}

export default function MLTab({

    mlData,

    runningML = false,

    onRunML,

}: Props) {

    const hasData =
        !!mlData;

    const deliveryRisk =
        mlData?.deliveryRisk || 'UNKNOWN';

    return (

        <div
            style={{

                display: 'flex',

                flexDirection: 'column',

                gap: '1.5rem',

                width: '100%',

                minWidth: 0,
            }}
        >

            {/* HEADER */}

            <div
                className="card"
                style={{

                    border:
                        '1px solid rgba(148,163,184,0.18)',

                    width: '100%',

                    minWidth: 0,
                }}
            >

                <div
                    style={{

                        display: 'flex',

                        alignItems: 'flex-start',

                        justifyContent:
                            'space-between',

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
                                    'clamp(1rem,2vw,1.15rem)',

                                lineHeight: 1.2,

                                wordBreak:
                                    'break-word',
                            }}
                        >
                            ML Intelligence Center
                        </h3>

                        <div
                            style={{

                                fontSize: '0.82rem',

                                color:
                                    'var(--text-muted)',

                                lineHeight: 1.5,
                            }}
                        >
                            Predictive engineering intelligence
                        </div>

                    </div>

                    <div
                        style={{

                            display: 'flex',

                            alignItems: 'center',

                            gap: '0.75rem',

                            flexWrap: 'wrap',

                            justifyContent:
                                'flex-end',
                        }}
                    >

                        {hasData && (

                            <RiskBadge
                                risk={deliveryRisk}
                            />

                        )}

                        <button
                            onClick={onRunML}
                            disabled={runningML}
                            style={{

                                minHeight: 46,

                                padding:
                                    '0.8rem 1.1rem',

                                borderRadius: 14,

                                border: 'none',

                                cursor:
                                    runningML
                                        ? 'not-allowed'
                                        : 'pointer',

                                background:
                                    'linear-gradient(135deg,#2563eb,#1d4ed8)',

                                color: '#fff',

                                fontWeight: 700,

                                fontSize: '0.9rem',

                                transition:
                                    'all 0.2s ease',

                                opacity:
                                    runningML
                                        ? 0.7
                                        : 1,

                                whiteSpace: 'nowrap',

                                boxShadow:
                                    '0 10px 25px rgba(37,99,235,0.35)',
                            }}
                        >
                            {
                                runningML
                                    ? 'Running ML...'
                                    : 'Run ML Analysis'
                            }
                        </button>

                    </div>

                </div>

            </div>

            {/* EMPTY STATE */}

            {!hasData && (

                <div
                    className="card"
                    style={{

                        border:
                            '1px solid rgba(148,163,184,0.18)',
                    }}
                >

                    <div
                        style={{

                            padding:
                                '2rem clamp(1rem,2vw,2.5rem)',

                            textAlign: 'center',

                            color:
                                'var(--text-muted)',

                            lineHeight: 1.8,

                            fontSize:
                                'clamp(0.9rem,1.5vw,1rem)',
                        }}
                    >

                        No ML forecast available yet.

                        <br />

                        Run engineering intelligence analysis
                        to generate predictive telemetry.

                    </div>

                </div>

            )}

            {/* ML OUTPUT */}

            {hasData && (

                <>

                    {/* SUMMARY */}

                    <div
                        className="card"
                        style={{

                            border:
                                '1px solid rgba(148,163,184,0.18)',
                        }}
                    >

                        <div
                            style={{

                                display: 'grid',

                                gridTemplateColumns:
                                    'repeat(auto-fit,minmax(min(100%,220px),1fr))',

                                gap: '1rem',

                                width: '100%',
                            }}
                        >

                            {/* HEALTH */}

                            <MetricCard
                                label="Engineering Health"
                                value={
                                    mlData?.projectScore || 0
                                }
                            />

                            {/* RISK */}

                            <MetricCard
                                label="Delivery Risk"
                                value={deliveryRisk}
                            />

                            {/* CONFIDENCE */}

                            <MetricCard
                                label="Forecast Confidence"
                                value={`${Math.round(
                                    (
                                        mlData?.forecastConfidence ||
                                        0
                                    ) * 100,
                                )}%`}
                            />

                        </div>

                    </div>

                    {/* EXPLAINABILITY */}

                    <div
                        className="card"
                        style={{

                            border:
                                '1px solid rgba(148,163,184,0.18)',
                        }}
                    >

                        <h3
                            style={{
                                marginBottom: '1rem',
                            }}
                        >
                            ML Explainability
                        </h3>

                        <div
                            style={{

                                display: 'flex',

                                flexDirection: 'column',

                                gap: '1rem',

                                width: '100%',
                            }}
                        >

                            {(mlData?.reasons || [])
                                .length === 0 ? (

                                <div
                                    style={{

                                        color:
                                            'var(--text-muted)',

                                        padding:
                                            '1rem',

                                        borderRadius: 16,

                                        background:
                                            'rgba(255,255,255,0.03)',

                                        border:
                                            '1px solid rgba(148,163,184,0.14)',
                                    }}
                                >
                                    No ML reasoning available
                                </div>

                            ) : (

                                (mlData?.reasons || [])
                                    .map(

                                        (
                                            reason: string,
                                            index: number,
                                        ) => (

                                            <div
                                                key={index}
                                                style={{

                                                    padding:
                                                        '1rem clamp(1rem,2vw,1.1rem)',

                                                    borderRadius: 16,

                                                    background:
                                                        'rgba(255,255,255,0.03)',

                                                    border:
                                                        '1px solid rgba(148,163,184,0.16)',

                                                    lineHeight:
                                                        1.75,

                                                    fontSize:
                                                        '0.92rem',

                                                    color:
                                                        'var(--text-secondary)',

                                                    wordBreak:
                                                        'break-word',

                                                    overflowWrap:
                                                        'break-word',
                                                }}
                                            >
                                                {reason}
                                            </div>

                                        ),
                                    )

                            )}

                        </div>

                    </div>

                    {/* SIGNALS */}

                    <div
                        className="card"
                        style={{

                            border:
                                '1px solid rgba(148,163,184,0.18)',
                        }}
                    >

                        <h3
                            style={{
                                marginBottom: '1rem',
                            }}
                        >
                            ML Signals
                        </h3>

                        <div
                            style={{

                                display: 'grid',

                                gridTemplateColumns:
                                    'repeat(auto-fit,minmax(min(100%,200px),1fr))',

                                gap: '1rem',

                                width: '100%',
                            }}
                        >

                            <SignalCard
                                label="Average Impact Score"
                                value={mlData?.signals?.avgImpactScore?.toFixed(2) || 0}
                            />

                            <SignalCard
                                label="Average Risk Score"
                                value={mlData?.signals?.avgRiskScore?.toFixed(2) || 0}
                            />

                            <SignalCard
                                label="Noise Ratio"
                                value={`${Math.round(
                                    (mlData?.signals?.noiseRatio || 0) * 100,
                                )}%`}
                            />

                            <SignalCard
                                label="Testing Ratio"
                                value={`${Math.round(
                                    (mlData?.signals?.testingRatio || 0) * 100,
                                )}%`}
                            />

                            <SignalCard
                                label="Hotspot Count"
                                value={
                                    mlData?.signals?.hotspotCount || 0
                                }
                            />

                        </div>

                    </div>

                </>

            )}

        </div>
    );
}

/* METRIC CARD */

function MetricCard({

    label,

    value,

}: {

    label: string;

    value: any;
}) {

    return (

        <div
            style={{

                padding:
                    '1rem clamp(1rem,2vw,1.2rem)',

                borderRadius: 18,

                background:
                    'rgba(255,255,255,0.03)',

                border:
                    '1px solid rgba(148,163,184,0.16)',

                width: '100%',

                minWidth: 0,
            }}
        >

            <div
                style={{

                    fontSize: '0.82rem',

                    color:
                        'var(--text-muted)',

                    marginBottom: 10,

                    lineHeight: 1.5,
                }}
            >
                {label}
            </div>

            <div
                style={{

                    fontSize:
                        'clamp(1.7rem,4vw,2rem)',

                    fontWeight: 800,

                    color:
                        'var(--text-primary)',

                    lineHeight: 1.1,

                    wordBreak:
                        'break-word',
                }}
            >
                {value}
            </div>

        </div>
    );
}

/* SIGNAL CARD */

function SignalCard({

    label,

    value,

}: {

    label: string;

    value: any;
}) {

    return (

        <div
            style={{

                padding:
                    '1rem clamp(1rem,2vw,1.1rem)',

                borderRadius: 16,

                background:
                    'rgba(255,255,255,0.03)',

                border:
                    '1px solid rgba(148,163,184,0.16)',

                width: '100%',

                minWidth: 0,
            }}
        >

            <div
                style={{

                    fontSize: '0.8rem',

                    color:
                        'var(--text-muted)',

                    marginBottom: 10,

                    lineHeight: 1.5,
                }}
            >
                {label}
            </div>

            <div
                style={{

                    fontSize:
                        'clamp(1.3rem,3vw,1.55rem)',

                    fontWeight: 800,

                    color:
                        'var(--text-primary)',

                    lineHeight: 1.1,

                    wordBreak:
                        'break-word',
                }}
            >
                {value}
            </div>

        </div>
    );
}