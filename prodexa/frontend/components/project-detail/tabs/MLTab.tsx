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
            }}
        >

            {/* HEADER */}

            <div className="card">

                <div
                    style={{
                        display: 'flex',

                        alignItems: 'center',

                        justifyContent:
                            'space-between',

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
                            ML Intelligence Center
                        </h3>

                        <div
                            style={{
                                fontSize: '0.8rem',

                                color:
                                    'var(--text-muted)',
                            }}
                        >
                            Predictive engineering intelligence
                        </div>

                    </div>

                    <div
                        style={{
                            display: 'flex',

                            alignItems: 'center',

                            gap: '1rem',
                        }}
                    >

                        {hasData && (

                            <RiskBadge
                                risk={deliveryRisk}
                            />

                        )}

                        <button
                            className="button"
                            onClick={onRunML}
                            disabled={runningML}
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

                <div className="card">

                    <div
                        style={{
                            padding: '2rem',

                            textAlign: 'center',

                            color:
                                'var(--text-muted)',
                        }}
                    >

                        No ML forecast available yet.
                        Run engineering intelligence analysis
                        to generate predictive telemetry.

                    </div>

                </div>

            )}

            {/* ML OUTPUT */}

            {hasData && (

                <>

                    {/* SUMMARY */}

                    <div className="card">

                        <div
                            style={{
                                display: 'grid',

                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(220px, 1fr))',

                                gap: '1rem',
                            }}
                        >

                            <div>

                                <div
                                    style={{
                                        fontSize:
                                            '0.8rem',

                                        color:
                                            'var(--text-muted)',

                                        marginBottom: 8,
                                    }}
                                >
                                    Engineering Health
                                </div>

                                <div
                                    style={{
                                        fontSize:
                                            '2rem',

                                        fontWeight: 800,
                                    }}
                                >
                                    {mlData?.projectScore || 0}
                                </div>

                            </div>

                            <div>

                                <div
                                    style={{
                                        fontSize:
                                            '0.8rem',

                                        color:
                                            'var(--text-muted)',

                                        marginBottom: 8,
                                    }}
                                >
                                    Delivery Risk
                                </div>

                                <div
                                    style={{
                                        fontSize:
                                            '2rem',

                                        fontWeight: 800,
                                    }}
                                >
                                    {deliveryRisk}
                                </div>

                            </div>

                            <div>

                                <div
                                    style={{
                                        fontSize:
                                            '0.8rem',

                                        color:
                                            'var(--text-muted)',

                                        marginBottom: 8,
                                    }}
                                >
                                    Forecast Confidence
                                </div>

                                <div
                                    style={{
                                        fontSize:
                                            '2rem',

                                        fontWeight: 800,
                                    }}
                                >
                                    {Math.round(
                                        (
                                            mlData?.forecastConfidence ||
                                            0
                                        ) * 100,
                                    )}
                                    %
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* EXPLAINABILITY */}

                    <div className="card">

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
                            }}
                        >

                            {(mlData?.reasons || [])
                                .length === 0 ? (

                                <div
                                    style={{
                                        color:
                                            'var(--text-muted)',
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
                                                        '1rem',

                                                    borderRadius: 12,

                                                    background:
                                                        'rgba(255,255,255,0.03)',

                                                    border:
                                                        '1px solid rgba(255,255,255,0.05)',

                                                    lineHeight:
                                                        1.7,
                                                }}
                                            >
                                                {reason}
                                            </div>

                                        ),
                                    )

                            )}

                        </div>

                    </div>

                    {/* RAW JSON */}

                    <div className="card">

                        <h3
                            style={{
                                marginBottom: '1rem',
                            }}
                        >
                            Raw ML Output
                        </h3>

                        <pre
                            style={{
                                overflowX: 'auto',

                                padding: '1rem',

                                borderRadius: 14,

                                background:
                                    'rgba(255,255,255,0.03)',

                                fontSize: '0.8rem',

                                lineHeight: 1.6,

                                color:
                                    '#cbd5e1',
                            }}
                        >
                            {JSON.stringify(
                                mlData,
                                null,
                                2,
                            )}
                        </pre>

                    </div>

                </>

            )}

        </div>
    );
}