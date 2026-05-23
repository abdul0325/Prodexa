'use client';

interface Props {
    height?: number;
    width?: string;
    radius?: number;
}

export default function Skeleton({
    height = 20,
    width = '100%',
    radius = 10,
}: Props) {

    return (

        <div
            style={{
                width,
                height,
                borderRadius: radius,
                background:
                    'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                backgroundSize: '200% 100%',
                animation:
                    'skeleton-loading 1.5s infinite linear',
            }}
        />

    );
}