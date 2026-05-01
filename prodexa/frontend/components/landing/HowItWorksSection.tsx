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
      className="section"
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
        className="header"
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
          className="steps-container"
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
            className="line"
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
              className="step-wrapper"
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
                className="step-card"
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
                  className="icon-box"
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
                  className="step-title"
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
                  className="step-desc"
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
  /* Tablet */
  @media (max-width: 1024px) {
    .steps-container {
      gap: 1.5rem !important;
    }

    .step-card {
      padding: 1.75rem !important;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .section {
      padding: 5rem 1rem !important;
    }

    .header {
      margin-bottom: 3rem !important;
    }

    .steps-container {
      flex-direction: column !important;
      align-items: center !important;
      gap: 2rem !important;
    }

    .line {
      display: none !important;
    }

    .step-wrapper {
      width: 100% !important;
      max-width: 420px;
    }

    .step-card {
      padding: 1.5rem !important;
    }

    .step-title {
      font-size: 1.1rem !important;
    }

    .step-desc {
      font-size: 0.875rem !important;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .section {
      padding: 4rem 0.75rem !important;
    }

    .header {
      margin-bottom: 2.5rem !important;
    }

    .steps-container {
      gap: 1.5rem !important;
    }

    .step-wrapper {
      max-width: 100%;
    }

    .step-card {
      padding: 1.25rem !important;
    }

    .icon-box {
      width: 48px !important;
      height: 48px !important;
    }

    .step-title {
      font-size: 1rem !important;
    }

    .step-desc {
      font-size: 0.85rem !important;
    }

    .step-number {
      font-size: 2.5rem !important;
    }
  }
`}</style>
      </div>
    </section>
  );
}
