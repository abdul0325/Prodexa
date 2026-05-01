'use client';

import { useEffect, useState } from 'react';

interface Tech {
  icon: React.ReactNode;
  name: string;
  role: string;
  color: string;
}

interface TechStackSectionProps {
  title: string;
  techs: Tech[];
}

export function TechStackSection({ title, techs }: TechStackSectionProps) {
  const [visible, setVisible] = useState(false);
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);

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

    const element = document.getElementById('tech-stack');
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
      id="tech-stack"
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
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(224, 35, 78, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, rgba(51, 103, 145, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 90% 10%, rgba(216, 44, 32, 0.02) 0%, transparent 50%)
          `,
          animation: 'meshFloat 30s ease-in-out infinite',
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

        {/* Tech Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {techs.map((tech, index) => (
            <div
              key={index}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${hoveredTech === index ? tech.color : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                transform: `translateY(${visible ? 0 : 30}px) ${hoveredTech === index ? 'translateY(-4px)' : ''}`,
                opacity: visible ? 1 : 0,
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: hoveredTech === index 
                  ? `0 12px 40px ${tech.color}20` 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                animation: visible ? `slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both` : 'none',
              }}
              onMouseEnter={() => setHoveredTech(index)}
              onMouseLeave={() => setHoveredTech(null)}
            >
              {/* Tech Color Glow on Hover */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at center, ${tech.color}08 0%, transparent 70%)`,
                  opacity: hoveredTech === index ? 1 : 0,
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
                  background: `${tech.color}15`,
                  border: `1px solid ${tech.color}30`,
                  marginBottom: '1.5rem',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    color: tech.color,
                    filter: hoveredTech === index ? `drop-shadow(0 0 20px ${tech.color})` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {tech.icon}
                </div>
              </div>

              {/* Tech Name */}
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-primary)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {tech.name}
              </h3>

              {/* Role Tag */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: `${tech.color}15`,
                  border: `1px solid ${tech.color}30`,
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: tech.color,
                  fontFamily: 'var(--font-body)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {tech.role}
              </div>

              {/* Hover Effect - Border Animation */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  border: `2px solid ${tech.color}`,
                  borderRadius: '16px',
                  opacity: hoveredTech === index ? 1 : 0,
                  transform: hoveredTech === index ? 'scale(1)' : 'scale(0.95)',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))"] {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1.25rem;
          }
        }

        @media (max-width: 768px) {
          section[style*="padding: 7rem 1rem"] {
            padding: 5rem 1rem;
          }
          
          div[style*="marginBottom: 4rem"] {
            margin-bottom: 3rem;
          }
          
          div[style*="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))"] {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1rem;
          }
          
          div[style*="padding: 2rem"] {
            padding: 1.5rem;
          }
          
          div[style*="width: 64px; height: 64px"] {
            width: 56px;
            height: 56px;
          }
          
          h3[style*="fontSize: 1.1rem"] {
            font-size: 1rem;
          }
          
          div[style*="fontSize: 0.75rem"] {
            font-size: 0.7rem;
          }
        }

        @media (max-width: 480px) {
          section[style*="padding: 7rem 1rem"] {
            padding: 4rem 0.75rem;
          }
          
          div[style*="marginBottom: 4rem"] {
            margin-bottom: 2.5rem;
          }
          
          div[style*="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))"] {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          
          div[style*="padding: 2rem"] {
            padding: 1.25rem;
          }
          
          div[style*="width: 64px; height: 64px"] {
            width: 48px;
            height: 48px;
          }
          
          h3[style*="fontSize: 1.1rem"] {
            font-size: 0.95rem;
          }
          
          div[style*="fontSize: 0.75rem"] {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </section>
  );
}
