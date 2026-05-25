'use client';

import RiskBadge
    from '@/components/project-detail/stats/RiskBadge';

interface Props {

    mlData?: any;

    loading?: boolean;
}

export default function RiskDetectionPanel({

    mlData,

    loading = false,

}: Props) {

    const deliveryRisk =
        (
            mlData?.deliveryRisk ||
            'LOW'
        ).toUpperCase();

    const signals = [

        {
            label: 'Noise Ratio',

            value:
                mlData?.signals?.noiseRatio || 0,

            severity: 'warning',
        },

        {
            label: 'Testing Ratio',

            value:
                mlData?.signals?.testingRatio || 0,

            severity: 'success',
        },

        {
            label: 'Hotspot Count',

            value:
                mlData?.signals?.hotspotCount || 0,

            severity: 'danger',
        },

        {
            label: 'Risk Score',

            value:
                mlData?.signals?.avgRiskScore || 0,

            severity: 'danger',
        },
    ];

    const getSeverityColor = (
        severity: string,
    ) => {

        switch (severity) {

            case 'success':
                return '#22c55e';

            case 'warning':
                return '#f59e0b';

            case 'danger':
                return '#ef4444';

            default:
                return '#3b82f6';
        }
    };

    return (

        <div
            className="card"
            style={{

                width: '100%',

                minWidth: 0,

                overflow: 'hidden',

                border:
                    '1px solid rgba(148,163,184,0.18)',
            }}
        >

            {/* HEADER */}

            <div
                style={{

                    display: 'flex',

                    alignItems: 'flex-start',

                    justifyContent: 'space-between',

                    marginBottom: '1.25rem',

                    gap: '1rem',

                    flexWrap: 'wrap',
                }}
            >

                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >

                    <h3
                        style={{

                            marginBottom: 6,

                            fontSize:
                                'clamp(1rem,2vw,1.15rem)',

                            lineHeight: 1.2,

                            wordBreak: 'break-word',
                        }}
                    >
                        Risk Detection
                    </h3>

                    <div
                        style={{

                            fontSize: '0.82rem',

                            color:
                                'var(--text-muted)',

                            lineHeight: 1.5,
                        }}
                    >
                        Engineering instability analysis
                    </div>

                </div>

                <div
                    style={{
                        flexShrink: 0,
                    }}
                >

                    <RiskBadge
                        risk={deliveryRisk}
                    />

                </div>

            </div>

            {/* LOADING */}

            {loading ? (

                <div
                    style={{

                        padding: '1rem',

                        borderRadius: 16,

                        background:
                            'rgba(255,255,255,0.03)',

                        border:
                            '1px solid rgba(148,163,184,0.14)',

                        color:
                            'var(--text-muted)',

                        fontSize: '0.92rem',

                        lineHeight: 1.6,
                    }}
                >
                    Running risk analysis...
                </div>

            ) : (

                <>

                    {/* SIGNAL GRID */}

                    <div
                        style={{

                            display: 'grid',

                            gridTemplateColumns:
                                'repeat(auto-fit,minmax(180px,1fr))',

                            gap: '1rem',

                            width: '100%',
                        }}
                    >

                        {signals.map(

                            (
                                signal,
                                index,
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

                                        transition:
                                            'all 0.2s ease',

                                        width: '100%',

                                        minWidth: 0,

                                        overflow: 'hidden',
                                    }}
                                >

                                    <div
                                        style={{

                                            display: 'flex',

                                            alignItems:
                                                'center',

                                            justifyContent:
                                                'space-between',

                                            gap: '0.75rem',

                                            marginBottom: 12,
                                        }}
                                    >

                                        <div
                                            style={{

                                                fontSize:
                                                    '0.82rem',

                                                color:
                                                    'var(--text-muted)',

                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {signal.label}
                                        </div>

                                        <div
                                            style={{

                                                width: 10,

                                                height: 10,

                                                borderRadius:
                                                    '50%',

                                                background:
                                                    getSeverityColor(
                                                        signal.severity,
                                                    ),

                                                flexShrink: 0,

                                                boxShadow:
                                                    `0 0 10px ${getSeverityColor(
                                                        signal.severity,
                                                    )}`,
                                            }}
                                        />

                                    </div>

                                    <div
                                        style={{

                                            fontSize:
                                                'clamp(1.4rem,3vw,1.7rem)',

                                            fontWeight: 800,

                                            color:
                                                'var(--text-primary)',

                                            lineHeight: 1.1,

                                            wordBreak:
                                                'break-word',
                                        }}
                                    >
                                        {signal.value}
                                    </div>

                                </div>

                            ),
                        )}

                    </div>

                    {/* REASONS */}

                    {(mlData?.reasons || [])
                        .length > 0 && (

                            <div
                                style={{

                                    marginTop: '1.5rem',

                                    display: 'flex',

                                    flexDirection: 'column',

                                    gap: '0.85rem',

                                    width: '100%',
                                }}
                            >

                                {(mlData?.reasons || [])
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
                                                        'rgba(239,68,68,0.08)',

                                                    border:
                                                        '1px solid rgba(239,68,68,0.18)',

                                                    color:
                                                        '#fca5a5',

                                                    fontSize:
                                                        '0.9rem',

                                                    lineHeight:
                                                        1.75,

                                                    wordBreak:
                                                        'break-word',

                                                    overflowWrap:
                                                        'break-word',

                                                    width: '100%',
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