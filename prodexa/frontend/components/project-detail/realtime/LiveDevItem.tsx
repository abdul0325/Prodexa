'use client';

import DevAvatar
    from '@/components/project-detail/shared/DevAvatar';

interface Props {
    developer: any;
}

export default function LiveDevItem({
    developer,
}: Props) {

    return (

        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
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
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >

                <DevAvatar
                    login={developer?.login}
                />

                <div>

                    <div
                        style={{
                            fontWeight: 600,
                            marginBottom: 4,
                        }}
                    >
                        {developer?.login}
                    </div>

                    <div
                        style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-muted)',
                        }}
                    >
                        {developer?.activity ||
                            'Active now'}
                    </div>

                </div>

            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                }}
            >

                <div
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#22c55e',
                        boxShadow:
                            '0 0 10px #22c55e',
                    }}
                />

                <span
                    style={{
                        fontSize: '0.8rem',
                        color: '#22c55e',
                        fontWeight: 600,
                    }}
                >
                    LIVE
                </span>

            </div>

        </div>
    );
}