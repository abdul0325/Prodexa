'use client';

import { useState, useEffect, useRef } from 'react';

import {
  GitBranch,
  ArrowRight,
  Activity,
  Brain,
  Trophy,
} from 'lucide-react';

import {
  isAuthenticated,
} from '@/lib/api';

export function HeroSection() {

  const [
    mousePosition,
    setMousePosition,
  ] = useState({
    x: 0,
    y: 0,
  });

  const cardRef =
    useRef<HTMLDivElement>(null);

  const authenticated =
    isAuthenticated();

  useEffect(() => {

    const handleMouseMove = (
      e: MouseEvent,
    ) => {

      if (cardRef.current) {

        const rect =
          cardRef.current
            .getBoundingClientRect();

        const centerX =
          rect.left +
          rect.width / 2;

        const centerY =
          rect.top +
          rect.height / 2;

        const x =
          (
            e.clientX -
            centerX
          ) /
          (rect.width / 2);

        const y =
          (
            e.clientY -
            centerY
          ) /
          (rect.height / 2);

        setMousePosition({
          x: x * -6,
          y: y * -6,
        });
      }
    };

    const handleMouseLeave =
      () => {

        setMousePosition({
          x: 0,
          y: 0,
        });
      };

    window.addEventListener(
      'mousemove',
      handleMouseMove,
    );

    window.addEventListener(
      'mouseleave',
      handleMouseLeave,
    );

    return () => {

      window.removeEventListener(
        'mousemove',
        handleMouseMove,
      );

      window.removeEventListener(
        'mouseleave',
        handleMouseLeave,
      );
    };

  }, []);

  const handlePrimaryAction =
    () => {

      if (authenticated) {

        window.location.href =
          '/projects';

        return;
      }

      window.location.href =
        '/login';
    };

  const scrollToHowItWorks =
    () => {

      const element =
        document.getElementById(
          'how-it-works',
        );

      if (element) {

        element.scrollIntoView({
          behavior: 'smooth',
        });
      }
    };

  return (

    <section
      className="hero-section"
      style={{

        minHeight: '100dvh',

        padding:
          'clamp(5rem, 6vh, 6rem) 1rem 2rem',

        position: 'relative',

        display: 'flex',

        alignItems: 'center',

        justifyContent: 'center',

        overflow: 'hidden',
      }}
    >

      {/* BACKGROUND */}

      <div
        style={{

          position: 'absolute',

          inset: 0,

          background: `
            radial-gradient(
              ellipse at 20% 30%,
              rgba(91, 127, 255, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 80% 70%,
              rgba(157, 91, 255, 0.12) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 50% 10%,
              rgba(6, 214, 224, 0.08) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 10% 90%,
              rgba(16, 232, 138, 0.1) 0%,
              transparent 50%
            )
          `,

          animation:
            'stunningGradientShift 25s ease-in-out infinite',

          zIndex: 0,
        }}
      />

      {/* GRID */}

      <div
        className="hero-grid"
        style={{

          maxWidth: '1240px',

          width: '100%',

          margin: '0 auto',

          position: 'relative',

          zIndex: 2,
        }}
      >

        {/* LEFT */}

        <div
          className="hero-content"
        >

          {/* BADGE */}

          <div
            className="hero-badge"
          >

            <Trophy size={16} />

            <span>
              Final Year Project 2026
            </span>

          </div>

          {/* TITLE */}

          <h1
            className="hero-title"
          >
            Ship Faster.
            <br />
            Track Smarter.
            <br />
            Predict Everything.
          </h1>

          {/* DESCRIPTION */}

          <p
            className="hero-description"
          >

            Prodexa connects to your GitHub
            and uses advanced AI to predict
            delivery risks, track developer
            productivity, and provide
            real-time engineering
            intelligence.

          </p>

          {/* BUTTONS */}

          <div
            className="hero-buttons"
          >

            <button
              onClick={
                handlePrimaryAction
              }
              className="hero-primary-btn"
            >

              <GitBranch size={18} />

              <span>
                {
                  authenticated
                    ? 'Open Dashboard'
                    : 'Sign in with GitHub'
                }
              </span>

              <ArrowRight size={16} />

            </button>

            <button
              onClick={
                scrollToHowItWorks
              }
              className="hero-secondary-btn"
            >
              See How It Works
            </button>

          </div>

          {/* TRUST */}

          <div
            className="hero-trust"
          >

            <span>•</span>
            <span>No setup</span>

            <span>•</span>
            <span>GitHub OAuth</span>

            <span>•</span>
            <span>Free</span>

            <span>•</span>
            <span>ML-powered</span>

          </div>

        </div>

        {/* RIGHT */}

        <div
          ref={cardRef}
          className="hero-dashboard-card"
          style={{

            transform:
              `perspective(1000px)
              rotateY(${mousePosition.x}deg)
              rotateX(${mousePosition.y}deg)`,
          }}
        >

          {/* GLOW */}

          <div
            className="hero-card-glow"
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >

            {/* TEAM */}

            <div
              style={{
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >

              <div
                className="hero-dev-list"
              >

                {[
                  'Alex Chen',
                  'Sarah Kim',
                  'Mike Johnson',
                ].map(
                  (
                    dev,
                    i,
                  ) => (

                    <div
                      key={i}
                      className="hero-dev-chip"
                    >
                      {dev}
                    </div>

                  ),
                )}

              </div>

            </div>

            {/* STATS */}

            <div
              className="hero-stats-grid"
            >

              {[
                {
                  icon:
                    <Activity size={18} />,
                  label:
                    'Active Devs',
                  value: '3',
                  color:
                    'var(--green)',
                },

                {
                  icon:
                    <GitBranch size={18} />,
                  label:
                    'Commits',
                  value: '47',
                  color:
                    'var(--accent)',
                },

                {
                  icon:
                    <Brain size={18} />,
                  label:
                    'AI Score',
                  value: '73%',
                  color:
                    'var(--purple)',
                },
              ].map(
                (
                  stat,
                  i,
                ) => (

                  <div
                    key={i}
                    className="hero-stat-card"
                  >

                    <div
                      style={{
                        color:
                          stat.color,
                        marginBottom:
                          '0.5rem',
                      }}
                    >
                      {stat.icon}
                    </div>

                    <div
                      className="hero-stat-value"
                    >
                      {stat.value}
                    </div>

                    <div
                      className="hero-stat-label"
                    >
                      {stat.label}
                    </div>

                  </div>

                ),
              )}

            </div>

            {/* HEALTH */}

            <div
              style={{
                textAlign: 'center',
              }}
            >

              <div
                className="hero-health-label"
              >
                Project Health
              </div>

              <div
                className="hero-health-value"
              >
                Excellent
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* STYLES */}

      <style jsx>{`

        .hero-grid {

          display: grid;

          grid-template-columns:
            minmax(0, 1.1fr)
            minmax(320px, 500px);

          align-items: center;

          gap:
            clamp(2rem, 4vw, 4rem);
        }

        .hero-content {

          max-width: 560px;

          min-width: 0;
        }

        .hero-badge {

          display: inline-flex;

          align-items: center;

          gap: 0.65rem;

          padding:
            0.65rem 1.15rem;

          border-radius: 14px;

          background:
            var(--surface);

          border:
            1px solid var(--border);

          margin-bottom: 1.5rem;

          font-size: 0.8rem;

          font-weight: 600;

          color: var(--accent);

          backdrop-filter:
            blur(12px);
        }

        .hero-title {

          font-size:
            clamp(2.1rem, 4vw, 3.8rem);

          line-height: 0.98;

          letter-spacing: -0.04em;

          font-weight: 800;

          margin-bottom: 1.25rem;

          font-family:
            var(--font-display);

          background:
            linear-gradient(
              135deg,
              var(--text-primary) 0%,
              var(--accent) 30%,
              var(--purple) 60%,
              var(--text-primary) 100%
            );

          -webkit-background-clip: text;

          -webkit-text-fill-color:
            transparent;

          background-clip: text;
        }

        .hero-description {

          font-size:
            clamp(1rem, 1.4vw, 1.15rem);

          line-height: 1.7;

          color:
            var(--text-secondary);

          margin-bottom: 1.75rem;

          max-width: 520px;
        }

        .hero-buttons {

          display: flex;

          gap: 1rem;

          flex-wrap: wrap;

          align-items: center;
        }

        .hero-primary-btn {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 0.5rem;

          border: none;

          cursor: pointer;

          border-radius: 12px;

          padding:
            0.9rem 1.4rem;

          background:
            linear-gradient(
              135deg,
              var(--accent),
              var(--accent-bright)
            );

          color: white;

          font-weight: 600;

          font-size: 0.92rem;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;

          box-shadow:
            0 10px 30px
            var(--accent-glow);
        }

        .hero-primary-btn:hover {

          transform:
            translateY(-2px);

          box-shadow:
            0 14px 34px
            var(--accent-glow);
        }

        .hero-secondary-btn {

          border:
            1.5px solid var(--accent);

          background: transparent;

          color: var(--accent);

          border-radius: 12px;

          padding:
            0.9rem 1.4rem;

          font-size: 0.92rem;

          font-weight: 600;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .hero-secondary-btn:hover {

          background:
            var(--accent-glow);

          transform:
            translateY(-2px);
        }

        .hero-trust {

          display: flex;

          align-items: center;

          gap: 0.75rem;

          flex-wrap: wrap;

          margin-top: 1.25rem;

          font-size: 0.82rem;

          color:
            var(--text-dim);
        }

        .hero-dashboard-card {

          position: relative;

          overflow: hidden;

          background:
            var(--surface);

          border:
            1px solid var(--border);

          border-radius: 22px;

          padding: 1.75rem;

          backdrop-filter:
            blur(20px);

          box-shadow:
            0 30px 60px rgba(0,0,0,0.12);

          transition:
            transform 0.2s ease-out;

          width: 100%;

          min-width: 0;
        }

        .hero-card-glow {

          position: absolute;

          inset: -50%;

          background:
            radial-gradient(
              circle,
              var(--accent-glow) 0%,
              transparent 70%
            );

          opacity: 0.5;

          animation:
            pulse 2s ease-in-out infinite;
        }

        .hero-dev-list {

          display: flex;

          justify-content: center;

          gap: 0.5rem;

          flex-wrap: wrap;
        }

        .hero-dev-chip {

          background:
            var(--surface-2);

          border:
            1px solid var(--border);

          border-radius: 12px;

          padding:
            0.5rem 0.9rem;

          font-size: 0.78rem;

          color:
            var(--text-secondary);
        }

        .hero-stats-grid {

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0,1fr));

          gap: 0.9rem;

          margin-bottom: 1.5rem;
        }

        .hero-stat-card {

          background:
            var(--surface-2);

          border:
            1px solid var(--border);

          border-radius: 14px;

          padding: 1rem;

          text-align: center;
        }

        .hero-stat-value {

          font-size: 1.4rem;

          font-weight: 700;

          color:
            var(--text-primary);

          margin-bottom: 0.25rem;
        }

        .hero-stat-label {

          font-size: 0.72rem;

          color:
            var(--text-secondary);
        }

        .hero-health-label {

          font-size: 0.85rem;

          color:
            var(--text-secondary);

          margin-bottom: 0.4rem;
        }

        .hero-health-value {

          font-size:
            clamp(2rem, 4vw, 2.6rem);

          font-weight: 800;

          color:
            var(--green);

          text-shadow:
            0 0 20px
            var(--accent-glow);
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1024px) {

          .hero-section {

            min-height: auto !important;

            padding:
              6rem 1.25rem 4rem !important;
          }

          .hero-grid {

            grid-template-columns:
              1fr;

            text-align: center;
          }

          .hero-content {

            margin: 0 auto;
          }

          .hero-buttons {

            justify-content: center;
          }

          .hero-trust {

            justify-content: center;
          }

          .hero-dashboard-card {

            max-width: 700px;

            margin: 0 auto;
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 768px) {

          .hero-section {

            padding:
              5.5rem 1rem 3rem !important;
          }

          .hero-title {

            font-size:
              clamp(2.3rem, 11vw, 3.4rem);

            line-height: 1.02;
          }

          .hero-description {

            font-size: 1rem;
          }

          .hero-buttons {

            flex-direction: column;

            width: 100%;
          }

          .hero-buttons button {

            width: 100%;
          }

          .hero-stats-grid {

            grid-template-columns:
              1fr;
          }

          .hero-dashboard-card {

            padding: 1.2rem;
          }
        }

        /* =========================
           SMALL MOBILE
        ========================= */

        @media (max-width: 480px) {

          .hero-section {

            padding:
              5rem 0.8rem 2.5rem !important;
          }

          .hero-dashboard-card {

            border-radius: 18px;

            padding: 1rem;
          }

          .hero-dev-chip {

            width: 100%;
          }
        }

      `}</style>

    </section>
  );
}