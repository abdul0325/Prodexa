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
                        AI Engineering Insights
                    </h3>

                    <div
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
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
                    }}
                >

                    {generatedAt && (

                        <span
                            style={{
                                fontSize: '0.75rem',
                                color:
                                    'var(--text-muted)',
                            }}
                        >
                            {generatedAt}
                        </span>

                    )}

                    <div
                        className="badge badge-success"
                    >
                        LIVE
                    </div>

                </div>

            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >

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
                                    padding: '1rem',
                                    borderRadius: 14,
                                    background:
                                        'rgba(255,255,255,0.03)',

                                    border:
                                        '1px solid rgba(255,255,255,0.06)',

                                    transition:
                                        'all 0.2s ease',
                                }}
                            >

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        alignItems:
                                            'flex-start',
                                    }}
                                >

                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius:
                                                '50%',
                                            marginTop: 8,
                                            background:
                                                '#22c55e',
                                            flexShrink: 0,
                                        }}
                                    />

                                    <div
                                        style={{
                                            fontSize:
                                                '0.92rem',

                                            color:
                                                'var(--text-secondary)',

                                            lineHeight: 1.7,
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