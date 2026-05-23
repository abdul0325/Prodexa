'use client';

interface StatCardProps {
    label: string;
    value: any;
    sub?: string;
    color?: string;
    updating?: boolean;
    delta?: number;
}

export default function StatCard({
    label,
    value,
    sub,
    color,
    updating,
    delta,
}: StatCardProps) {

    const hasDelta =
        delta !== undefined &&
        delta !== null;

    const positive =
        (delta || 0) >= 0;

    return (
        <div
            className="stat-card"
            style={{
                position: 'relative',
                overflow: 'hidden',
            }}
        >

            {updating && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: 'var(--accent)',
                        animation: 'slideRight 1s ease infinite',
                    }}
                />
            )}

            <div className="stat-label">
                {label}
            </div>

            <div
                className="stat-value"
                style={{
                    color: color || 'var(--text-primary)',
                }}
            >
                {value}
            </div>

            {sub && (
                <div
                    style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginTop: 4,
                    }}
                >
                    {sub}
                </div>
            )}

            {hasDelta && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginTop: 10,
                    }}
                >

                    <span
                        style={{
                            color: positive
                                ? '#22c55e'
                                : '#ef4444',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                        }}
                    >
                        {positive ? '↑' : '↓'}
                        {Math.abs(delta || 0)}%
                    </span>

                    <span
                        style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                        }}
                    >
                        vs previous period
                    </span>

                </div>
            )}

        </div>
    );
}