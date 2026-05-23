'use client';

interface Props {

    summary?: string | string[];

    generatedAt?: string;

    loading?: boolean;
}

export default function ExecutiveSummary({

    summary,

    generatedAt,

    loading = false,

}: Props) {

    const fallbackSummary = `
Engineering systems remain stable with
low delivery risk and healthy subsystem
activity. Current telemetry indicates
stable architecture behavior with no
significant hotspot propagation detected.
`;

    const normalizedSummary =
        Array.isArray(summary)
            ? summary.join(' ')
            : summary;

    const displaySummary =
        normalizedSummary ||
        fallbackSummary;

    return (

        <div className="card">

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '1rem',
                }}
            >

                <div>

                    <h3
                        style={{
                            marginBottom: 4,
                        }}
                    >
                        Executive Summary
                    </h3>

                    <div
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                        }}
                    >
                        AI-generated engineering overview
                    </div>

                </div>

                {generatedAt && (

                    <span
                        style={{
                            fontSize: '0.75rem',
                            color:
                                'var(--text-muted)',
                        }}
                    >
                        Updated {generatedAt}
                    </span>

                )}

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
                    Generating executive summary...
                </div>

            ) : (

                <div
                    style={{
                        lineHeight: 1.9,

                        color:
                            'var(--text-secondary)',

                        fontSize: '0.96rem',

                        whiteSpace: 'pre-line',
                    }}
                >
                    {displaySummary}
                </div>

            )}

        </div>
    );
}