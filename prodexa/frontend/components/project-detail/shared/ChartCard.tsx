'use client';

import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  height?: number;
}

export default function ChartCard({
  title,
  children,
  height = 500,
}: Props) {
  return (
    <div
      className="card"
      style={{
        width: '100%',
        minHeight: height,
      }}
    >
      <h4
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </h4>

      {children}
    </div>
  );
}