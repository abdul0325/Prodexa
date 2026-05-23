'use client';

import { useEffect, useState } from 'react';

import DevAvatar from '@/components/project-detail/shared/DevAvatar';

import { fetchProjectLeaderboard } from '@/lib/api';

interface Props {

    projectId: string;
}

export default function DevelopersTab({

    projectId,

}: Props) {

    const [leaderboardData, setLeaderboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);

                const leaderboard = await fetchProjectLeaderboard(projectId);

                setLeaderboardData(leaderboard);

            } catch (error) {

                console.error('Error fetching developer data:', error);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, [projectId]);

    if (loading) {

        return (

            <div className="card">

                <h3 style={{ marginBottom: '1rem' }}>

                    Developer Intelligence

                </h3>

                <div

                    style={{

                        display: 'flex',

                        alignItems: 'center',

                        justifyContent: 'center',

                        padding: '2rem',

                        color: 'var(--text-muted)',

                    }}
                >

                    Loading developer data...

                </div>

            </div>

        );
    }

    const developers = leaderboardData?.leaderboard || [];

    return (

        <div className="card">

            <h3 style={{ marginBottom: '1rem' }}>

                Developer Intelligence

            </h3>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >

                {developers.length === 0 ? (

                    <div

                        style={{

                            display: 'flex',

                            alignItems: 'center',

                            justifyContent: 'center',

                            padding: '2rem',

                            color: 'var(--text-muted)',

                        }}
                    >

                        No developer data available

                    </div>

                ) : (

                    developers.map((dev: any, index: number) => (

                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                borderRadius: 12,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                }}
                            >

                                <DevAvatar login={dev.developer} />

                                <div>

                                    <div style={{ fontWeight: 600 }}>
                                        {dev.developer}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-muted)',
                                            marginTop: '0.25rem',
                                        }}
                                    >
                                        Productivity Score: {dev.score?.toFixed(1) || 0}
                                    </div>

                                </div>

                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    fontSize: '0.9rem',
                                }}
                            >

                                <div
                                    style={{
                                        textAlign: 'center',
                                    }}
                                >

                                    <div style={{ fontWeight: 700 }}>
                                        {dev.commits || 0}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        Commits
                                    </div>

                                </div>

                                <div
                                    style={{
                                        textAlign: 'center',
                                    }}
                                >

                                    <div style={{ fontWeight: 700 }}>
                                        {dev.prs || 0}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        PRs
                                    </div>

                                </div>

                                <div
                                    style={{
                                        textAlign: 'center',
                                    }}
                                >

                                    <div style={{ fontWeight: 700 }}>
                                        {dev.issues || 0}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        Issues
                                    </div>

                                </div>

                            </div>

                        </div>

                    ))
                )}

            </div>

        </div>

    );
}