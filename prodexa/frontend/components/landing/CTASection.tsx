'use client';

import { useEffect, useState } from 'react';
import { GitBranch, Rocket } from 'lucide-react';

interface CTASectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  note: string;
}

export function CTASection({ title, subtitle, buttonText, note }: CTASectionProps) {
  const [visible, setVisible] = useState(false);

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

    const element = document.getElementById('cta-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [visible]);

  const handleGitHubAuth = () => {
    window.location.href = 'http://localhost:3001/auth/github';
  };

  return (
    <section
      id="cta-section"
      style={{
        padding: '7rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Mesh Gradient Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(91, 127, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(157, 91, 255, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 10%, rgba(6, 214, 224, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 10% 90%, rgba(16, 232, 138, 0.1) 0%, transparent 50%)
          `,
          animation: 'stunningGradientShift 25s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      {/* Floating Orbs */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {[
          { size: 200, left: 15, top: 20, color: 'rgba(91, 127, 255, 0.1)', delay: 0 },
          { size: 150, left: 85, top: 75, color: 'rgba(157, 91, 255, 0.08)', delay: 5 },
          { size: 250, left: 45, top: 10, color: 'rgba(6, 214, 224, 0.06)', delay: 10 },
        ].map((orb, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              animation: `orbFloat ${15 + orb.delay}s ease-in-out infinite`,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Content Container */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'var(--accent-glow)',
              border: '1px solid var(--accent)',
              marginBottom: '2rem',
              animation: 'float 6s ease-in-out infinite',
            }}
          >
            <Rocket size={36} color="var(--accent)" />
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              marginBottom: '3rem',
              lineHeight: 1.7,
              fontFamily: 'var(--font-body)',
              maxWidth: '600px',
              margin: '0 auto 3rem',
            }}
          >
            {subtitle}
          </p>

          {/* CTA Button with Pulsing Glow */}
          <div style={{ display: 'inline-block', position: 'relative' }}>
            {/* Pulsing Glow Effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
                borderRadius: '12px',
                animation: 'pulse 2.5s ease-in-out infinite',
                filter: 'blur(8px)',
              }}
            />

            {/* Main Button */}
            <button
              onClick={handleGitHubAuth}
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-bright))',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 0 40px var(--accent-glow)',
                transition: 'all 200ms ease',
                fontFamily: 'var(--font-body)',
                textTransform: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 50px var(--accent-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 0 40px var(--accent-glow)';
              }}
            >
              <GitBranch size={20} />
              {buttonText}
            </button>
          </div>

          {/* Note */}
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-dim)',
              marginTop: '2rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
            }}
          >
            {note}
          </p>
        </div>
      </div>
    </section>
  );
}
