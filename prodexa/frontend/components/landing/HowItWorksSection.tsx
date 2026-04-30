'use client';

import { useEffect, useState } from 'react';

interface Step {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  title: string;
  steps: Step[];
}

export function HowItWorksSection({ title, steps }: HowItWorksSectionProps) {
  const [visible, setVisible] = useState(false);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !visible) {
            setVisible(true);
            // Animate line drawing
            setTimeout(() => {
              setLineProgress(100);
            }, 300);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const element = document.getElementById('how-it-works');
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
      id="how-it-works"
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
            radial-gradient(circle at 33% 33%, rgba(91, 127, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 66% 66%, rgba(16, 232, 138, 0.05) 0%, transparent 50%)
          `,
          animation: 'meshFloat 22s ease-in-out infinite',
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
        </div>

        {/* Steps Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2rem',
            position: 'relative',
          }}
        >
          {/* Connecting Line */}
          <div
            style={{
              position: 'absolute',
              top: '60px',
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'var(--border)',
              zIndex: 0,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${lineProgress}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--purple))',
                transition: 'width 1.5s ease-out',
                position: 'relative',
              }}
            >
              {/* Animated dots on the line */}
              <div
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '0',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 20px var(--accent)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* Step Cards */}
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s`,
              }}
            >
              {/* Step Number */}
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-display)',
                  marginBottom: '1rem',
                  opacity: 0.3,
                  letterSpacing: '-0.05em',
                }}
              >
                {String(step.number).padStart(2, '0')}
              </div>

              {/* Step Card */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(91, 127, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Background Icon */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '8rem',
                    color: 'var(--accent)',
                    opacity: 0.05,
                    zIndex: 0,
                  }}
                >
                  {step.icon}
                </div>

                {/* Icon Container */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: 'var(--accent-glow)',
                    border: '1px solid var(--accent)',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div style={{ color: 'var(--accent)' }}>
                    {step.icon}
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
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Responsive Styles */}
        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="flex-direction: row"] {
              flex-direction: column;
              align-items: center;
            }

            div[style*="position: absolute; top: 60px; left: 10%; right: 10%"] {
              display: none;
            }

            div[style*="flex: 1"] {
              width: 100%;
              max-width: 400px;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
