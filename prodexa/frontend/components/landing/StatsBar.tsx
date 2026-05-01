'use client';

import { useEffect, useState, useRef } from 'react';

interface Stat {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface StatsBarProps {
  stats: Stat[];
}

export function StatsBar({ stats }: StatsBarProps) {
  const [visible, setVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);

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

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const durations = [1800, 1600, 1400, 1200];
      const targetValues = stats.map(stat => {
        const numValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
        return isNaN(numValue) ? 0 : numValue;
      });

      targetValues.forEach((target, index) => {
        const duration = durations[index];
        const startTime = Date.now();
        const startValue = animatedValues[index];

        const animate = () => {
          const currentTime = Date.now();
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function: easeOutExpo
          const easeOutExpo = 1 - Math.pow(2, -10 * progress);
          const currentValue = startValue + (target - startValue) * easeOutExpo;

          setAnimatedValues(prev => {
            const newValues = [...prev];
            newValues[index] = currentValue;
            return newValues;
          });

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      });
    }
  }, [visible, stats, animatedValues]);

  const formatValue = (value: number, stat: Stat) => {
    if (stat.value.includes('%')) {
      return value.toFixed(1) + '%';
    }
    if (stat.value.includes('s')) {
      return '<' + value.toFixed(0) + 's';
    }
    if (stat.value.includes('+')) {
      return value.toFixed(0) + '+';
    }
    if (stat.value === 'Real-time') {
      return 'Real-time';
    }
    return value.toFixed(0);
  };

  return (
    <div
      ref={ref}
      style={{
        background: 'var(--surface)',
        padding: '3rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(91, 127, 255, 0.05), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              textAlign: 'center',
              flex: 1,
              minWidth: '150px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s ease-out ${index * 0.1}s`,
            }}
          >
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
                marginBottom: '0.5rem',
                lineHeight: 1,
              }}
            >
              {visible ? formatValue(animatedValues[index], stat) : stat.prefix || '0'}
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Vertical Dividers */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          bottom: '20%',
          width: '1px',
          background: 'var(--border)',
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          bottom: '20%',
          width: '1px',
          background: 'var(--border)',
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '75%',
          bottom: '20%',
          width: '1px',
          background: 'var(--border)',
          opacity: 0.3,
        }}
      />

      {/* Shimmer Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @media (max-width: 1024px) {
          div[style*="fontSize: 2.5rem"] {
            font-size: 2.2rem;
          }
          
          div[style*="flex: 1"] {
            min-width: 140px;
          }
        }

        @media (max-width: 768px) {
          div[style*="padding: 3rem 1rem"] {
            padding: 2.5rem 1rem;
          }
          
          div[style*="justify-content: space-around"] {
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
          }
          
          div[style*="left: 25%"],
          div[style*="left: 50%"],
          div[style*="left: 75%"] {
            display: none;
          }
          
          div[style*="fontSize: 2.5rem"] {
            font-size: 2rem;
          }
          
          div[style*="flex: 1"] {
            min-width: 120px;
            flex-basis: calc(50% - 1rem);
          }
        }

        @media (max-width: 480px) {
          div[style*="padding: 3rem 1rem"] {
            padding: 2rem 0.75rem;
          }
          
          div[style*="justify-content: space-around"] {
            gap: 1.5rem;
          }
          
          div[style*="fontSize: 2.5rem"] {
            font-size: 1.75rem;
          }
          
          div[style*="fontSize: 0.875rem"] {
            font-size: 0.8rem;
          }
          
          div[style*="flex: 1"] {
            flex-basis: calc(50% - 0.75rem);
            min-width: 100px;
          }
        }
      `}</style>
    </div>
  );
}
