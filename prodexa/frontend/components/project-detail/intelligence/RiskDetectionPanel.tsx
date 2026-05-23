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

        <div className="card">

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
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
                        Risk Detection
                    </h3>

                    <div
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                        }}
                    >
                        Engineering instability analysis
                    </div>

                </div>

                <RiskBadge
                    risk={deliveryRisk}
                />

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
                    Running risk analysis...
                </div>

            ) : (

                <>

                    <div
                        style={{
                            display: 'grid',

                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(180px, 1fr))',

                            gap: '1rem',
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
                                        padding: '1rem',

                                        borderRadius: 14,

                                        background:
                                            'rgba(255,255,255,0.03)',

                                        border:
                                            '1px solid rgba(255,255,255,0.06)',
                                    }}
                                >

                                    <div
                                        style={{
                                            display: 'flex',

                                            alignItems:
                                                'center',

                                            justifyContent:
                                                'space-between',

                                            marginBottom: 10,
                                        }}
                                    >

                                        <div
                                            style={{
                                                fontSize:
                                                    '0.8rem',

                                                color:
                                                    'var(--text-muted)',
                                            }}
                                        >
                                            {signal.label}
                                        </div>

                                        <div
                                            style={{
                                                width: 8,
                                                height: 8,

                                                borderRadius:
                                                    '50%',

                                                background:
                                                    getSeverityColor(
                                                        signal.severity,
                                                    ),
                                            }}
                                        />

                                    </div>

                                    <div
                                        style={{
                                            fontSize:
                                                '1.5rem',

                                            fontWeight: 700,

                                            color:
                                                'var(--text-primary)',
                                        }}
                                    >
                                        {signal.value}
                                    </div>

                                </div>

                            ),
                        )}

                    </div>

                    {(mlData?.reasons || [])
                        .length > 0 && (

                            <div
                                style={{
                                    marginTop: '1.5rem',

                                    display: 'flex',

                                    flexDirection: 'column',

                                    gap: '0.8rem',
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
                                                        '0.9rem 1rem',

                                                    borderRadius: 12,

                                                    background:
                                                        'rgba(239,68,68,0.08)',

                                                    border:
                                                        '1px solid rgba(239,68,68,0.15)',

                                                    color:
                                                        '#fca5a5',

                                                    fontSize:
                                                        '0.88rem',

                                                    lineHeight:
                                                        1.6,
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