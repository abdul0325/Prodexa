'use client';

import { useEffect, useState } from 'react';

interface MLShowcaseSectionProps {
  badge: string;
  title: string;
  points: string[];
  demoData: Array<{
    developer: string;
    score: number;
    trend: string;
    risk: string;
  }>;
}

export function MLShowcaseSection({ 
  badge, 
  title, 
  points, 
  demoData 
}: MLShowcaseSectionProps) {
  const [visible, setVisible] = useState(false);
  const [typingRow, setTypingRow] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !visible) {
            setVisible(true);
            // Start typing animation for demo card
            const startTyping = () => {
              demoData.forEach((_, index) => {
                setTimeout(() => {
                  setTypingRow(index);
                }, index * 300);
              });
            };
            startTyping();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const element = document.getElementById('ml-showcase');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [visible, demoData]);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'var(--green)';
      case 'medium': return 'var(--amber)';
      case 'high': return '#ff6b6b';
      default: return 'var(--text-secondary)';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'rising': return '↑';
      case 'stable': return '→';
      case 'falling': return '↓';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'rising': return 'var(--green)';
      case 'stable': return 'var(--text-secondary)';
      case 'falling': return '#ff6b6b';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <section
      id="ml-showcase"
      style={{
        padding: '7rem 1rem',
        background: 'var(--surface)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(157, 91, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(91, 127, 255, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(6, 214, 224, 0.04) 0%, transparent 50%)
          `,
          animation: 'meshFloat 28s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}
      >
        {/* Left Side - Text Content */}
        <div>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--purple)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '24px',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '2rem',
              fontFamily: 'var(--font-body)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out',
            }}
          >
            {badge}
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '2rem',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out 0.1s',
            }}
          >
            {title}
          </h2>

          {/* Bullet Points */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out 0.2s',
            }}
          >
            {points.map((point, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                <div
                  style={{
                    color: 'var(--green)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '-2px',
                  }}
                >
                  ✓
                </div>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Demo Card */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out 0.3s',
          }}
        >
          <div
            style={{
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--surface-2)',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <div>Developer</div>
              <div style={{ textAlign: 'center' }}>Score</div>
              <div style={{ textAlign: 'center' }}>Trend</div>
              <div style={{ textAlign: 'center' }}>Risk</div>
            </div>

            {/* Table Rows */}
            {demoData.map((row, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--surface)',
                  borderRadius: '8px',
                  marginBottom: '0.75rem',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-body)',
                  opacity: typingRow >= index ? 1 : 0,
                  transform: typingRow >= index ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.3s ease-out',
                  borderLeft: `3px solid ${getRiskColor(row.risk)}`,
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {row.developer}
                </div>
                <div 
                  style={{ 
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: 'var(--accent)'
                  }}
                >
                  {row.score.toFixed(1)}
                </div>
                <div 
                  style={{ 
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    color: getTrendColor(row.trend),
                    fontWeight: 600
                  }}
                >
                  <span>{getTrendIcon(row.trend)}</span>
                  <span>{row.trend}</span>
                </div>
                <div 
                  style={{ 
                    textAlign: 'center',
                    fontWeight: 600,
                    color: getRiskColor(row.risk)
                  }}
                >
                  {row.risk}
                </div>
              </div>
            ))}

            {/* Footer Note */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'var(--accent-glow)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                textAlign: 'center',
                border: '1px solid var(--accent)',
                opacity: typingRow >= demoData.length ? 1 : 0,
                transition: 'opacity 0.3s ease-out',
              }}
            >
              <strong>98.8% model accuracy</strong> on test data • Updated in real-time
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr;
            gap: 0.5rem;
            text-align: left !important;
          }
        }
      `}</style>
    </section>
  );
}
