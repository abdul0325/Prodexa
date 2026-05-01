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
      className={`section ${visible ? 'visible' : ''}`}
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
        className="content-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'start',
        }}
      >
        {/* Left Side - Text Content */}
        <div className="text-content">
          {/* Badge */}
          <div className="badge">
            {badge}
          </div>

          {/* Title */}
          <h2 className="title">
            {title}
          </h2>

          {/* Bullet Points */}
          <div className="points">
            {points.map((point, index) => (
              <div key={index} className="point">
                <div className="check">✓</div>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Demo Card */}
        <div className="demo-wrapper">
          <div className="demo-card">
            {/* Table Header */}
            <div className="table-header">
              <div>Developer</div>
              <div className="center">Score</div>
              <div className="center">Trend</div>
              <div className="center">Risk</div>
            </div>

            {/* Table Rows */}
            {demoData.map((row, index) => (
              <div 
                key={index} 
                className="table-row"
                style={{
                  borderLeftColor: getRiskColor(row.risk),
                  opacity: typingRow >= index ? 1 : 0,
                  transform: typingRow >= index ? 'translateX(0)' : 'translateX(-20px)',
                }}
              >
                <div className="developer">{row.developer}</div>
                <div className="score">{row.score.toFixed(1)}</div>
                <div className="trend" style={{ color: getTrendColor(row.trend) }}>
                  <span>{getTrendIcon(row.trend)}</span>
                  <span>{row.trend}</span>
                </div>
                <div className="risk" style={{ color: getRiskColor(row.risk) }}>{row.risk}</div>
              </div>
            ))}

            {/* Footer Note */}
            <div 
              className="footer-note"
              style={{
                opacity: typingRow >= demoData.length ? 1 : 0,
              }}
            >
              <strong>98.8% model accuracy</strong> on test data • Updated in real-time
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        /* Base Styles */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--purple);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 24px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 2rem;
          font-family: var(--font-body);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }

        .title {
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          font-weight: 800;
          margin-bottom: 2rem;
          font-family: var(--font-display);
          color: var(--text-primary);
          letter-spacing: -0.02em;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out 0.1s;
        }

        .points {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out 0.2s;
        }

        .point {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1rem;
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .check {
          color: var(--green);
          font-size: 1.2rem;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: -2px;
        }

        .demo-wrapper {
        display: flex;
  justify-content: center;
  align-items: flex-start;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out 0.3s;
          height: fit-content;
        }

        .demo-card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 34, 255, 0.1);

  /* ✅ FIX */
  height: auto;
  display: inline-block;
  width: 100%;
}

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
          background: var(--surface-2);
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          font-family: var(--font-body);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .table-header .center {
          text-align: center;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
          background: var(--surface);
          border-radius: 8px;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
          font-family: var(--font-body);
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.3s ease-out;
          border-left: 3px solid var(--green);
        }

        .developer {
          font-weight: 600;
          color: var(--text-primary);
        }

        .score {
          text-align: center;
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--accent);
        }

        .trend {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .risk {
          text-align: center;
          font-weight: 600;
          color: var(--green);
        }

        .footer-note {
          margin-top: 1.5rem;
          padding: 1rem;
          background: var(--accent-glow);
          border-radius: 8px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-family: var(--font-body);
          text-align: center;
          border: 1px solid var(--accent);
          opacity: 0;
          transition: opacity 0.3s ease-out;
        }

        /* Show animations when visible */
        .section.visible .badge {
          opacity: 1;
          transform: translateY(0);
        }

        .section.visible .title {
          opacity: 1;
          transform: translateY(0);
        }

        .section.visible .points {
          opacity: 1;
          transform: translateY(0);
        }

        .section.visible .demo-wrapper {
          opacity: 1;
          transform: translateY(0);
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .content-grid {
            gap: 3rem !important;
          }
          
          .demo-card {
            padding: 1.75rem !important;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .section {
            padding: 5rem 1rem !important;
          }
          
          .content-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }

          .table-header {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
            text-align: left !important;
            display: block !important;
          }

          .table-header > div:first-child {
            display: block !important;
            margin-bottom: 0.5rem !important;
            font-weight: 600 !important;
            color: var(--text-secondary) !important;
          }

          .table-header .center {
            display: inline-block !important;
            margin-right: 1rem !important;
            font-size: 0.8rem !important;
          }

          .table-row {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
            text-align: left !important;
            display: block !important;
          }

          .table-row .developer {
            display: block !important;
            margin-bottom: 0.5rem !important;
            font-weight: 600 !important;
            color: var(--text-primary) !important;
          }

          .table-row .score,
          .table-row .trend,
          .table-row .risk {
            display: inline-block !important;
            margin-right: 1rem !important;
            font-size: 0.85rem !important;
          }

          .table-row .trend {
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.25rem !important;
          }
          
          .demo-card {
            padding: 1.5rem !important;
          }
          
          .point {
            font-size: 0.9rem !important;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .section {
            padding: 4rem 0.75rem !important;
          }
          
          .content-grid {
            gap: 1.5rem !important;
          }
          
          .demo-card {
            padding: 1rem !important;
          }
          
          .table-header,
          .table-row {
            padding: 0.75rem !important;
          }
          
          .point {
            font-size: 0.85rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          .table-row .score,
          .table-row .trend,
          .table-row .risk {
            font-size: 0.8rem !important;
            margin-right: 0.75rem !important;
          }
          
          .table-row {
            margin-bottom: 0.5rem !important;
          }
          
          .footer-note {
            font-size: 0.75rem !important;
          }
        }
      `}</style>
    </section>
  );
}
