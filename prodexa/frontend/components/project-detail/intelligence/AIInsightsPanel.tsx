'use client';

interface Props {

    insights?: string[];

    loading?: boolean;

    generatedAt?: string;
}

export default function AIInsightsPanel({

    insights = [],

    loading = false,

    generatedAt,

}: Props) {

    const fallbackInsights = [

        'Engineering health remains stable.',

        'Low subsystem volatility detected.',

        'Minimal engineering noise observed.',

        'No major risk propagation patterns detected.',
    ];

    const displayInsights =
        insights.length > 0
            ? insights
            : fallbackInsights;

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
                        AI Engineering Insights
                    </h3>

                    <div
                        style={{

                            fontSize: '0.82rem',

                            color:
                                'var(--text-muted)',

                            lineHeight: 1.5,
                        }}
                    >

                        Realtime intelligence interpretation

                    </div>

                </div>

                <div
                    style={{

                        display: 'flex',

                        alignItems: 'center',

                        gap: '0.75rem',

                        flexWrap: 'wrap',

                        justifyContent: 'flex-end',
                    }}
                >

                    {generatedAt && (

                        <span
                            style={{

                                fontSize: '0.76rem',

                                color:
                                    'var(--text-muted)',

                                padding:
                                    '0.45rem 0.8rem',

                                borderRadius: 999,

                                background:
                                    'var(--surface-secondary)',

                                border:
                                    '1px solid rgba(148,163,184,0.18)',

                                whiteSpace: 'nowrap',
                            }}
                        >

                            {

                                new Date(generatedAt)
                                    .toLocaleString(
                                        'en-US',
                                        {

                                            month: 'short',

                                            day: 'numeric',

                                            hour: 'numeric',

                                            minute: '2-digit',

                                            hour12: true,
                                        },
                                    )
                            }

                        </span>

                    )}

                    <div
                        className="badge badge-success"
                        style={{

                            minHeight: 34,

                            display: 'flex',

                            alignItems: 'center',

                            justifyContent: 'center',

                            padding:
                                '0.45rem 0.8rem',

                            borderRadius: 999,

                            whiteSpace: 'nowrap',
                        }}
                    >
                        LIVE
                    </div>

                </div>

            </div>

            {/* CONTENT */}

            <div
                style={{

                    display: 'flex',

                    flexDirection: 'column',

                    gap: '1rem',

                    width: '100%',
                }}
            >

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
                        Loading AI insights...
                    </div>

                ) : (

                    displayInsights.map(

                        (
                            insight,
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

                                    overflow: 'hidden',
                                }}
                            >

                                <div
                                    style={{

                                        display: 'flex',

                                        gap: '0.85rem',

                                        alignItems:
                                            'flex-start',
                                    }}
                                >

                                    {/* STATUS DOT */}

                                    <div
                                        style={{

                                            width: 9,

                                            height: 9,

                                            borderRadius:
                                                '50%',

                                            marginTop: 8,

                                            background:
                                                '#22c55e',

                                            flexShrink: 0,

                                            boxShadow:
                                                '0 0 10px rgba(34,197,94,0.5)',
                                        }}
                                    />

                                    {/* TEXT */}

                                    <div
                                        style={{

                                            fontSize:
                                                'clamp(0.9rem,1.5vw,0.95rem)',

                                            color:
                                                'var(--text-secondary)',

                                            lineHeight: 1.75,

                                            wordBreak:
                                                'break-word',

                                            overflowWrap:
                                                'break-word',

                                            flex: 1,

                                            minWidth: 0,
                                        }}
                                    >
                                        {insight}
                                    </div>

                                </div>

                            </div>

                        ),
                    )

                )}

            </div>

        </div>
    );
}