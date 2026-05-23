'use client';

export default function RiskBadge({
  risk,
}: {
  risk: string;
}) {

  const normalized =
    risk?.toLowerCase?.() || '';

  const map: any = {

    low: 'badge-success',

    medium: 'badge-warning',

    high: 'badge-danger',

    active: 'badge-success',

    inactive: 'badge-danger',
  };

  return (

    <span
      className={`
        badge
        ${map[normalized] || 'badge-neutral'}
      `}
    >

      {risk}

    </span>
  );
}