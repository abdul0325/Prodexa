'use client';

import { useEffect, useState } from 'react';

interface Problem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface ProblemSectionProps {
  title: string;
  subtitle: string;
  problems: Problem[];
}

export function ProblemSection({ title, subtitle, problems }: ProblemSectionProps) {
  const [visible, setVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !visible) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const element = document.getElementById('problem-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [visible]);

  return (
    <section
      id="problem-section"
      style={{
        padding: '7rem 1rem',
        background: 'var(--background)',
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
            radial-gradient(circle at 25% 25%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 184, 48, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 10%, rgba(157, 91, 255, 0.05) 0%, transparent 50%)
          `,
          animation: 'meshFloat 20s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Section Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '4rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.7,
              fontFamily: 'var(--font-body)',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Problem Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {problems.map((problem, index) => (
            <div
              key={index}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${hoveredCard === index ? 'var(--border-bright)' : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '2.5rem',
                textAlign: 'center',
                transform: `translateY(${visible ? 0 : 30}px) ${hoveredCard === index ? 'translateY(-4px)' : ''}`,
                opacity: visible ? 1 : 0,
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: hoveredCard === index 
                  ? `0 12px 40px ${problem.color}20` 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                animation: visible ? `slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s both` : 'none',
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Icon Container */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: `${problem.color}15`,
                  border: `1px solid ${problem.color}30`,
                  marginBottom: '2rem',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    color: problem.color,
                    filter: hoveredCard === index ? `drop-shadow(0 0 20px ${problem.color})` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {problem.icon}
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-primary)',
                  transition: 'color 0.3s ease',
                }}
              >
                {problem.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                }}
              >
                {problem.description}
              </p>

              {/* Hover Effect Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at center, ${problem.color}08 0%, transparent 70%)`,
                  opacity: hoveredCard === index ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                  borderRadius: '16px',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
