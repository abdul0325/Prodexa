'use client';

import RiskBadge
    from '@/components/project-detail/stats/RiskBadge';

interface Props {

    projectName: string;

    projectId: string;

    repoUrl?: string;

    analysisStatus?: string;

    analyzing?: boolean;

    runningML?: boolean;

    onAnalyze?: () => void;

    onRunML?: () => void;
}

export default function ProjectHeader({

    projectName,

    projectId,

    repoUrl,

    analysisStatus,

    analyzing = false,

    runningML = false,

    onAnalyze,

    onRunML,

}: Props) {

    const isLive =
        analysisStatus === 'ANALYZING';

    const riskLevel =
        analysisStatus === 'FAILED'
            ? 'High'
            : analysisStatus === 'ANALYZING'
                ? 'Medium'
                : 'Low';

    return (

        <div
            className="card"
            style={{
                marginBottom: '1.5rem',
            }}
        >

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                }}
            >

                {/* LEFT */}

                <div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: 10,
                            flexWrap: 'wrap',
                        }}
                    >

                        <h1
                            style={{
                                fontSize: '2rem',
                                fontWeight: 800,
                                margin: 0,
                            }}
                        >
                            {projectName}
                        </h1>

                        <div
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background:
                                    isLive
                                        ? '#22c55e'
                                        : '#64748b',

                                boxShadow:
                                    isLive
                                        ? '0 0 12px #22c55e'
                                        : 'none',
                            }}
                        />

                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            flexWrap: 'wrap',
                        }}
                    >

                        <span
                            style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.9rem',
                            }}
                        >
                            Engineering Intelligence Command Center
                        </span>

                        <RiskBadge
                            risk={riskLevel}
                        />

                        <span
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                padding:
                                    '0.35rem 0.7rem',
                                borderRadius: 999,
                                background:
                                    'rgba(255,255,255,0.04)',
                            }}
                        >
                            {projectId}
                        </span>

                    </div>

                </div>

                {/* RIGHT */}

                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                    }}
                >

                    {repoUrl && (

                        <a
                            href={repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="button secondary"
                        >
                            Open Repository
                        </a>

                    )}

                    <button
                        className="button"
                        onClick={onAnalyze}
                        disabled={analyzing}
                    >
                        {
                            analyzing
                                ? 'Analyzing...'
                                : 'Analyze Project'
                        }
                    </button>

                    <button
                        className="button secondary"
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
    );
}