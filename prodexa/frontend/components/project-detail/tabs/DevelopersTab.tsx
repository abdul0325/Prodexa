'use client';

import DevAvatar from '@/components/project-detail/shared/DevAvatar';

interface Props {
    developers: any[];
}

export default function DevelopersTab({
    developers,
}: Props) {

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

                {developers?.map((dev, index) => (

                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            borderRadius: 12,
                            background: 'rgba(255,255,255,0.03)',
                        }}
                    >

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >

                            <DevAvatar login={dev.login} />

                            <div>
                                <div style={{ fontWeight: 600 }}>
                                    {dev.login}
                                </div>
                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}