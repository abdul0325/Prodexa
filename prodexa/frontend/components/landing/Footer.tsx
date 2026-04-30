'use client';

import { GitBranch } from 'lucide-react';

interface NavItem {
  label: string;
  id: string;
}

interface FooterProps {
  logo: string;
  tagline: string;
  navLinks: NavItem[];
  techBadge: string;
  copyright: string;
  githubLink: string;
}

export function Footer({
  logo,
  tagline,
  navLinks,
  techBadge,
  copyright,
  githubLink,
}: FooterProps) {

  const handleNavClick = (id: string) => {
    // Route case (Dashboard)
    if (id === 'dashboard') {
      window.location.href = 'http://localhost:3001/auth/github';
      return;
    }

    // Scroll case
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // optional offset (for sticky navbar)
      setTimeout(() => {
        window.scrollBy({ top: -80, behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <footer
      style={{
        background: 'var(--surface)',
        padding: '4rem 1rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Gradient Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
          opacity: 0.5,
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Column 1 */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1.2rem',
                fontFamily: 'var(--font-display)',
              }}
            >
              P
            </div>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
              }}
            >
              {logo}
            </span>
          </div>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              fontFamily: 'var(--font-body)',
              marginBottom: '1.5rem',
            }}
          >
            {tagline}
          </p>
        </div>

        {/* Column 2 - Navigation */}
        <div>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Navigation
          </h4>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'color 200ms ease',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Column 3 */}
        <div>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Technology
          </h4>

          <div>
            <div
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Built with:
            </div>

            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.6,
              }}
            >
              {techBadge}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '3rem auto 0',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
          {copyright}
        </div>

        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          <GitBranch size={16} />
          View on GitHub
        </a>
      </div>
    </footer>
  );
}