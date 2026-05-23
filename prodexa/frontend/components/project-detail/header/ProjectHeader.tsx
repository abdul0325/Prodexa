'use client';

import RiskBadge
    from '@/components/project-detail/stats/RiskBadge';

import {
    GitBranch,
    BrainCircuit,
    Activity,
    ArrowLeft,
} from 'lucide-react';
import { useRouter }
    from 'next/navigation';

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
    const router = useRouter();
    return (

        <div
            className="card"
            style={{

                marginBottom: '1.5rem',

                padding: '1.5rem',

                borderRadius: 24,

                background:
                    'var(--card-bg)',

                border:
'1px solid rgba(148, 163, 184, 0.22)',

                width: '100%',
            }}
        >

            <div
                style={{

                    display: 'flex',

                    justifyContent:
                        'space-between',

                    alignItems: 'center',

                    gap: '1.5rem',

                    flexWrap: 'wrap',
                }}
            >

                {/* LEFT SECTION */}

                <div
                    style={{
                        flex: 1,
                        minWidth: 280,
                    }}
                >
                    <button

                        onClick={() => router.push('/projects')}
                        style={{

                            display: 'flex',

                            alignItems: 'center',

                            gap: '0.5rem',

                            marginBottom: '1rem',

                            background:
                                'var(--surface-secondary)',

                            border:
'1px solid rgba(148, 163, 184, 0.28)',

                            color:
                                'var(--text-primary)',

                            padding:
                                '0.7rem 1rem',

                            borderRadius: 12,

                            cursor: 'pointer',

                            fontWeight: 600,

                            fontSize: '0.9rem',

                            transition:
                                'all 0.2s ease',
                        }}
                    >

                        <ArrowLeft size={16} />

                        Back to Projects

                    </button>
                    {/* TITLE */}

                    <div
                        style={{

                            display: 'flex',

                            alignItems: 'center',

                            gap: '0.85rem',

                            flexWrap: 'wrap',

                            marginBottom: 14,
                        }}
                    >

                        <div
                            style={{

                                width: 12,

                                height: 12,

                                borderRadius: '50%',

                                background:
                                    isLive
                                        ? '#22c55e'
                                        : '#64748b',

                                boxShadow:
                                    isLive
                                        ? '0 0 14px rgba(34,197,94,0.8)'
                                        : 'none',

                                flexShrink: 0,
                            }}
                        />

                        <h1
                            style={{

                                margin: 0,

                                fontSize:
                                    'clamp(1.6rem, 4vw, 2.4rem)',

                                fontWeight: 800,

                                lineHeight: 1.1,

                                color:
                                    'var(--text-primary)',

                                wordBreak: 'break-word',
                            }}
                        >
                            {projectName}
                        </h1>

                    </div>

                    {/* META */}

                    <div
                        style={{

                            display: 'flex',

                            alignItems: 'center',

                            flexWrap: 'wrap',

                            gap: '0.75rem',
                        }}
                    >

                        <span
                            style={{

                                fontSize: '0.95rem',

                                color:
                                    'var(--text-muted)',
                            }}
                        >
                            Engineering Intelligence Command Center
                        </span>

                        <RiskBadge
                            risk={riskLevel}
                        />

                        <span
                            style={{

                                fontSize: '0.78rem',

                                color:
                                    'var(--text-muted)',

                                padding:
                                    '0.45rem 0.8rem',

                                borderRadius: 999,

                                border:
'1px solid rgba(148, 163, 184, 0.25)',

                                background:
                                    'var(--surface-secondary)',

                                maxWidth: '100%',

                                overflow: 'hidden',

                                textOverflow: 'ellipsis',

                                whiteSpace: 'nowrap',
                            }}
                        >
                            {projectId}
                        </span>

                    </div>

                </div>

                {/* RIGHT SECTION */}

                <div
                    style={{

                        display: 'flex',

                        alignItems: 'center',

                        justifyContent:
                            'flex-end',

                        flexWrap: 'wrap',

                        gap: '0.85rem',

                        width: '100%',

                        maxWidth: 520,
                    }}
                >

                    {repoUrl && (

                        <a
                            href={repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{

                                display: 'flex',

                                alignItems: 'center',

                                justifyContent:
                                    'center',

                                gap: '0.55rem',

                                padding:
                                    '0.85rem 1.15rem',

                                borderRadius: 14,

                                fontWeight: 600,

                                fontSize: '0.92rem',

                                textDecoration: 'none',

                                background:
                                    'var(--surface-secondary)',

                                color:
                                    'var(--text-primary)',

                                border:
'1px solid rgba(148, 163, 184, 0.28)',

                                transition:
                                    'all 0.2s ease',

                                minHeight: 48,

                                flex: '1 1 180px',
                            }}
                        >

                            <GitBranch
                                size={18}
                            />

                            Open Repository

                        </a>

                    )}

                    <button
                        onClick={onAnalyze}
                        disabled={analyzing}
                        style={{

                            display: 'flex',

                            alignItems: 'center',

                            justifyContent:
                                'center',

                            gap: '0.55rem',

                            padding:
                                '0.9rem 1.2rem',

                            borderRadius: 14,

                            border: 'none',

                            cursor:
                                analyzing
                                    ? 'not-allowed'
                                    : 'pointer',

                            background:
                                analyzing
                                    ? '#334155'
                                    : 'linear-gradient(135deg,#2563eb,#1d4ed8)',

                            color: '#fff',

                            fontWeight: 700,

                            fontSize: '0.92rem',

                            transition:
                                'all 0.2s ease',

                            minHeight: 48,

                            flex: '1 1 180px',

                            opacity:
                                analyzing
                                    ? 0.7
                                    : 1,

                            boxShadow:
                                analyzing
                                    ? 'none'
                                    : '0 10px 25px rgba(37,99,235,0.35)',
                        }}
                    >

                        <Activity
                            size={18}
                        />

                        {
                            analyzing
                                ? 'Analyzing...'
                                : 'Analyze Project'
                        }

                    </button>

                    <button
                        onClick={onRunML}
                        disabled={runningML}
                        style={{

                            display: 'flex',

                            alignItems: 'center',

                            justifyContent:
                                'center',

                            gap: '0.55rem',

                            padding:
                                '0.9rem 1.2rem',

                            borderRadius: 14,

                            border:
'1px solid rgba(148, 163, 184, 0.28)',

                            cursor:
                                runningML
                                    ? 'not-allowed'
                                    : 'pointer',

                            background:
                                'var(--surface-secondary)',

                            color:
                                'var(--text-primary)',

                            fontWeight: 700,

                            fontSize: '0.92rem',

                            transition:
                                'all 0.2s ease',

                            minHeight: 48,

                            flex: '1 1 180px',

                            opacity:
                                runningML
                                    ? 0.7
                                    : 1,
                        }}
                    >

                        <BrainCircuit
                            size={18}
                        />

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