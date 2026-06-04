'use client';

export default function DevAvatar({
  login,
}: {
  login: string;
}) {

  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'var(--accent-soft)',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 700,
        color: 'var(--accent)',
      }}
    >

      <img
        src={`https://avatars.githubusercontent.com/${login}?size=64`}
        alt={login}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={(e) => {
          (e.target as HTMLImageElement)
            .style.display = 'none';
        }}
      />

    </div>
  );
}