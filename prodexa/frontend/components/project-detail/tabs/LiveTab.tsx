'use client';

interface Props {

    liveDevs?: any[];

    analysisStatus?: string;
}

export default function LiveTab({

    liveDevs = [],

    analysisStatus,

}: Props) {

    const isAnalyzing =
        analysisStatus === 'ANALYZING';

    const getActivityColor = (
        type?: string,
    ) => {

        switch (type) {

            case 'risk':
                return '#ef4444';

            case 'warning':
                return '#f59e0b';

            case 'success':
                return '#22c55e';

            default:
                return '#3b82f6';
        }
    };

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
                            Realtime Activity Feed
                        </h3>

                        <div
                            style={{
                                fontSize: '0.8rem',

                                color:
                                    'var(--text-muted)',
                            }}
                        >
                            Live engineering telemetry
                        </div>

                    </div>

                    <div
                        style={{
                            display: 'flex',

                            alignItems: 'center',

                            gap: '0.75rem',
                        }}
                    >

                        <div
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',

                                background:
                                    isAnalyzing
                                        ? '#22c55e'
                                        : '#64748b',

                                boxShadow:
                                    isAnalyzing
                                        ? '0 0 12px #22c55e'
                                        : 'none',
                            }}
                        />

                        <span
                            style={{
                                fontSize: '0.85rem',

                                color:
                                    isAnalyzing
                                        ? '#22c55e'
                                        : 'var(--text-muted)',
                            }}
                        >
                            {
                                isAnalyzing
                                    ? 'LIVE'
                                    : 'IDLE'
                            }
                        </span>

                    </div>

                </div>

            </div>

            {/* FEED */}

            <div className="card">

                {liveDevs.length === 0 ? (

                    <div
                        style={{
                            padding: '2rem',

                            textAlign: 'center',

                            color:
                                'var(--text-muted)',
                        }}
                    >
                        No realtime engineering activity available
                    </div>

                ) : (

                    <div
                        style={{
                            display: 'flex',

                            flexDirection: 'column',

                            gap: '1rem',
                        }}
                    >

                        {liveDevs.map(

                            (
                                event,
                                index,
                            ) => {

                                const color =
                                    getActivityColor(
                                        event?.type,
                                    );

                                return (

                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',

                                            alignItems:
                                                'flex-start',

                                            gap: '1rem',

                                            padding:
                                                '1rem',

                                            borderRadius: 14,

                                            background:
                                                'rgba(255,255,255,0.03)',

                                            border:
                                                '1px solid rgba(255,255,255,0.05)',
                                        }}
                                    >

                                        {/* INDICATOR */}

                                        <div
                                            style={{
                                                width: 10,

                                                height: 10,

                                                borderRadius:
                                                    '50%',

                                                background:
                                                    color,

                                                marginTop: 8,

                                                flexShrink: 0,

                                                boxShadow:
                                                    `0 0 10px ${color}`,
                                            }}
                                        />

                                        {/* CONTENT */}

                                        <div
                                            style={{
                                                flex: 1,
                                            }}
                                        >

                                            <div
                                                style={{
                                                    fontWeight: 600,

                                                    marginBottom: 6,
                                                }}
                                            >
                                                {
                                                    event?.title ||
                                                    'Engineering Activity'
                                                }
                                            </div>

                                            <div
                                                style={{
                                                    fontSize:
                                                        '0.88rem',

                                                    color:
                                                        'var(--text-secondary)',

                                                    lineHeight:
                                                        1.7,
                                                }}
                                            >
                                                {
                                                    event?.description ||
                                                    'Realtime engineering event detected'
                                                }
                                            </div>

                                            {event?.timestamp && (

                                                <div
                                                    style={{
                                                        marginTop:
                                                            '0.75rem',

                                                        fontSize:
                                                            '0.75rem',

                                                        color:
                                                            'var(--text-muted)',
                                                    }}
                                                >
                                                    {
                                                        event.timestamp
                                                    }
                                                </div>

                                            )}

                                        </div>

                                    </div>

                                );
                            },
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}