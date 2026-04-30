'use client';

import { useState, useEffect, useRef } from 'react';
import { GitBranch, ArrowRight, Activity, Brain, Trophy } from 'lucide-react';

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);
        setMousePosition({ x: x * -10, y: y * -10 });
      }
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleGitHubAuth = () => {
    window.location.href = 'http://localhost:3001/auth/github';
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '7rem 1rem',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Animated Mesh Gradient Background */}
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

      {/* Dot Grid Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          opacity: 0.1,
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

      {/* Hero Content */}
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}
      >
        {/* Left Column - Hero Text */}
        <div>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '0.75rem 1.5rem',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--accent)',
              backdropFilter: 'blur(10px)',
              animation: 'fadeInUp 0.8s ease-out',
            }}
          >
            <Trophy size={18} />
            Final Year Project 2026
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: '2rem',
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 30%, var(--purple) 60%, var(--text-primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              animation: 'fadeInUp 1s ease-out',
            }}
          >
            Ship Faster.<br />
            Track Smarter.<br />
            Predict Everything.
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              marginBottom: '3rem',
              maxWidth: '500px',
              lineHeight: 1.7,
              fontFamily: 'var(--font-body)',
              animation: 'fadeInUp 1.2s ease-out',
            }}
          >
            Prodexa connects to your GitHub and uses advanced AI to predict delivery risks, 
            track developer productivity, and provide your team with real-time intelligence.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              animation: 'fadeInUp 1.4s ease-out',
            }}
          >
            <button
              onClick={handleGitHubAuth}
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-bright))',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 24px var(--accent-glow)',
                transition: 'all 200ms ease',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 32px var(--accent-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 24px var(--accent-glow)';
              }}
            >
              <GitBranch size={18} />
              Sign in with GitHub
              <ArrowRight size={16} />
            </button>

            <button
              onClick={scrollToHowItWorks}
              style={{
                background: 'transparent',
                border: '1.5px solid var(--accent)',
                color: 'var(--accent)',
                borderRadius: '10px',
                padding: '0.75rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-glow)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              See How It Works
            </button>
          </div>

          {/* Trust Line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '2rem',
              fontSize: '0.875rem',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-body)',
              animation: 'fadeInUp 1.6s ease-out',
            }}
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

        {/* Right Column - Hero Visual Card */}
        <div
          ref={cardRef}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)`,
            transition: 'transform 0.2s ease-out',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            animation: 'slideInRight 1s ease-out',
          }}
        >
          {/* Glow Effect */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              right: '-50%',
              bottom: '-50%',
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
              opacity: 0.5,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />

          {/* Dashboard Mockup */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '0.5rem', 
                marginBottom: '1rem' 
              }}>
                {['Alex Chen', 'Sarah Kim', 'Mike Johnson'].map((dev, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--surface-2)',
                      padding: '0.5rem 1rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      fontFamily: 'var(--font-body)',
                      animation: `fadeInUp 1.2s ease-out ${i * 0.1}s both`,
                    }}
                  >
                    {dev}
                  </div>
                ))}
              </div>
              <div
                style={{
                  width: '120px',
                  height: '4px',
                  background: 'linear-gradient(90deg, var(--border), var(--accent), var(--border))',
                  borderRadius: '2px',
                  margin: '0 auto',
                  animation: 'slideInWidth 1.5s ease-out',
                }}
              />
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { icon: <Activity size={20} />, label: 'Active Devs', value: '3', color: 'var(--green)' },
                { icon: <GitBranch size={20} />, label: 'Commits', value: '47', color: 'var(--accent)' },
                { icon: <Brain size={20} />, label: 'AI Score', value: '73%', color: 'var(--purple)' },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--surface-2)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                    animation: `fadeInUp 1.4s ease-out ${i * 0.15}s both`,
                  }}
                >
                  <div style={{ color: stat.color, marginBottom: '0.5rem' }}>
                    {stat.icon}
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '0.25rem' 
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500 
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Project Health */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary)', 
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 500 
              }}>
                Project Health
              </div>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 800, 
                color: 'var(--green)',
                fontFamily: 'var(--font-display)',
                textShadow: '0 0 20px var(--accent-glow)',
                animation: 'pulse 2s ease-in-out infinite',
              }}>
                Excellent
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
