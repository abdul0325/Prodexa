'use client';

import { useEffect, useState } from 'react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

interface FeaturesSectionProps {
  title: string;
  features: Feature[];
}

export function FeaturesSection({ title, features }: FeaturesSectionProps) {
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

    const element = document.getElementById('features-section');
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
      id="features-section"
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
            radial-gradient(circle at 20% 20%, rgba(91, 127, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(6, 214, 224, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(157, 91, 255, 0.05) 0%, transparent 50%)
          `,
          animation: 'meshFloat 25s ease-in-out infinite',
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

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'var(--background)',
                border: `1px solid ${hoveredCard === index ? feature.color : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                transform: `translateY(${visible ? 0 : 30}px) ${hoveredCard === index ? 'translateY(-6px)' : ''}`,
                opacity: visible ? 1 : 0,
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: hoveredCard === index 
                  ? `0 16px 50px ${feature.color}25` 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                animation: visible ? `slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s both` : 'none',
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient Border Background */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: hoveredCard === index ? feature.gradient : 'none',
                  opacity: hoveredCard === index ? 0.1 : 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                }}
              />

              {/* Icon Container */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: `${feature.color}15`,
                  border: `1px solid ${feature.color}30`,
                  marginBottom: '1.5rem',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === index ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <div
                  style={{
                    color: feature.color,
                    filter: hoveredCard === index ? `drop-shadow(0 0 20px ${feature.color})` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {feature.icon}
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-primary)',
                  transition: 'color 0.3s ease',
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  marginBottom: '1rem',
                }}
              >
                {feature.description}
              </p>

              {/* Arrow Indicator */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: feature.color,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  opacity: hoveredCard === index ? 1 : 0,
                  transform: hoveredCard === index ? 'translateX(0)' : 'translateX(-10px)',
                  transition: 'all 0.3s ease',
                }}
              >
                Learn more
                <span style={{ fontSize: '1.2rem' }}>→</span>
              </div>

              {/* Inner Glow Effect */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at center, ${feature.color}08 0%, transparent 70%)`,
                  opacity: hoveredCard === index ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
