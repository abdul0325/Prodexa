'use client';

import {
    useEffect,
    useState,
} from 'react';

import DevAvatar
    from '@/components/project-detail/shared/DevAvatar';

import {
    fetchProjectLeaderboard,
} from '@/lib/api';

interface Props {

    projectId: string;
}

export default function DevelopersTab({

    projectId,

}: Props) {

    const [
        leaderboardData,
        setLeaderboardData,
    ] = useState<any>(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    useEffect(() => {

        const fetchData =
            async () => {

                try {

                    setLoading(true);

                    const leaderboard =
                        await fetchProjectLeaderboard(
                            projectId,
                        );

                    setLeaderboardData(
                        leaderboard,
                    );

                } catch (error) {

                    console.error(
                        'Error fetching developer data:',
                        error,
                    );

                } finally {

                    setLoading(false);
                }
            };

        fetchData();

    }, [projectId]);

    const developers =
        leaderboardData?.leaderboard || [];

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

                    gap: '1rem',

                    flexWrap: 'wrap',

                    marginBottom: '1.5rem',
                }}
            >

                <div
                    style={{
                        minWidth: 0,
                    }}
                >

                    <h3
                        style={{

                            marginBottom: 6,

                            fontSize:
                                'clamp(1rem,2vw,1.15rem)',

                            lineHeight: 1.2,
                        }}
                    >
                        Developer Intelligence
                    </h3>

                    <div
                        style={{

                            fontSize: '0.82rem',

                            color:
                                'var(--text-muted)',

                            lineHeight: 1.5,
                        }}
                    >
                        Contributor productivity and activity analytics
                    </div>

                </div>

                <div
                    style={{

                        padding:
                            '0.45rem 0.8rem',

                        borderRadius: 999,

                        background:
                            'var(--surface-secondary)',

                        border:
                            '1px solid rgba(148,163,184,0.18)',

                        fontSize: '0.78rem',

                        color:
                            'var(--text-muted)',

                        whiteSpace: 'nowrap',
                    }}
                >
                    {developers.length} Developers
                </div>

            </div>

            {/* LOADING */}

            {loading ? (

                <div
                    style={{

                        display: 'flex',

                        alignItems: 'center',

                        justifyContent: 'center',

                        padding: '2rem',

                        borderRadius: 16,

                        background:
                            'rgba(255,255,255,0.03)',

                        border:
                            '1px solid rgba(148,163,184,0.14)',

                        color:
                            'var(--text-muted)',

                        fontSize: '0.92rem',
                    }}
                >
                    Loading developer intelligence...
                </div>

            ) : developers.length === 0 ? (

                <div
                    style={{

                        display: 'flex',

                        alignItems: 'center',

                        justifyContent: 'center',

                        padding: '2rem',

                        borderRadius: 16,

                        background:
                            'rgba(255,255,255,0.03)',

                        border:
                            '1px solid rgba(148,163,184,0.14)',

                        color:
                            'var(--text-muted)',

                        fontSize: '0.92rem',
                    }}
                >
                    No developer data available
                </div>

            ) : (

                <div
                    style={{

                        display: 'flex',

                        flexDirection: 'column',

                        gap: '1rem',

                        width: '100%',
                    }}
                >

                    {developers.map(

                        (
                            dev: any,
                            index: number,
                        ) => (

                            <div
                                key={index}
                                style={{

                                    display: 'flex',

                                    alignItems: 'center',

                                    justifyContent:
                                        'space-between',

                                    gap: '1rem',

                                    flexWrap: 'wrap',

                                    padding:
                                        '1rem clamp(1rem,2vw,1.2rem)',

                                    borderRadius: 18,

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

                                {/* LEFT */}

                                <div
                                    style={{

                                        display: 'flex',

                                        alignItems: 'center',

                                        gap: '1rem',

                                        minWidth: 0,

                                        flex: 1,
                                    }}
                                >

                                    <DevAvatar
                                        login={
                                            dev.developer
                                        }
                                    />

                                    <div
                                        style={{
                                            minWidth: 0,
                                        }}
                                    >

                                        <div
                                            style={{

                                                fontWeight: 700,

                                                color:
                                                    'var(--text-primary)',

                                                lineHeight: 1.3,

                                                wordBreak:
                                                    'break-word',
                                            }}
                                        >
                                            {dev.developer}
                                        </div>

                                        <div
                                            style={{

                                                fontSize:
                                                    '0.84rem',

                                                color:
                                                    'var(--text-muted)',

                                                marginTop: 4,

                                                lineHeight: 1.5,

                                                wordBreak:
                                                    'break-word',
                                            }}
                                        >
                                            Productivity Score:{' '}

                                            {dev.score?.toFixed(
                                                1,
                                            ) || 0}
                                        </div>

                                    </div>

                                </div>

                                {/* RIGHT */}

                                <div
                                    style={{

                                        display: 'grid',

                                        gridTemplateColumns:
                                            'repeat(auto-fit,minmax(70px,1fr))',

                                        gap: '1rem',

                                        width: '100%',

                                        maxWidth: 320,

                                        minWidth: 220,
                                    }}
                                >

                                    {/* COMMITS */}

                                    <div
                                        style={{
                                            textAlign: 'center',
                                        }}
                                    >

                                        <div
                                            style={{

                                                fontWeight: 800,

                                                fontSize:
                                                    '1.1rem',

                                                color:
                                                    'var(--text-primary)',
                                            }}
                                        >
                                            {dev.commits || 0}
                                        </div>

                                        <div
                                            style={{

                                                fontSize:
                                                    '0.75rem',

                                                color:
                                                    'var(--text-muted)',

                                                marginTop: 4,
                                            }}
                                        >
                                            Commits
                                        </div>

                                    </div>

                                    {/* PRS */}

                                    <div
                                        style={{
                                            textAlign: 'center',
                                        }}
                                    >

                                        <div
                                            style={{

                                                fontWeight: 800,

                                                fontSize:
                                                    '1.1rem',

                                                color:
                                                    'var(--text-primary)',
                                            }}
                                        >
                                            {dev.prs || 0}
                                        </div>

                                        <div
                                            style={{

                                                fontSize:
                                                    '0.75rem',

                                                color:
                                                    'var(--text-muted)',

                                                marginTop: 4,
                                            }}
                                        >
                                            PRs
                                        </div>

                                    </div>

                                    {/* ISSUES */}

                                    <div
                                        style={{
                                            textAlign: 'center',
                                        }}
                                    >

                                        <div
                                            style={{

                                                fontWeight: 800,

                                                fontSize:
                                                    '1.1rem',

                                                color:
                                                    'var(--text-primary)',
                                            }}
                                        >
                                            {dev.issues || 0}
                                        </div>

                                        <div
                                            style={{

                                                fontSize:
                                                    '0.75rem',

                                                color:
                                                    'var(--text-muted)',

                                                marginTop: 4,
                                            }}
                                        >
                                            Issues
                                        </div>

                                    </div>

                                </div>

                            </div>

                        ),
                    )}

                </div>

            )}

        </div>
    );
}