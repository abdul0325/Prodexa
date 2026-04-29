'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/api';
import { GitBranch, TrendingUp, Brain, Users, AlertTriangle, Bell, Zap, Code, Database, BarChart3, Star, Award, Activity, Shield, Sparkles, Sun, Moon, ArrowRight, CheckCircle2, Rocket, Target, Lightbulb, Cpu, Globe, Lock, ZapIcon, Flame, Trophy, ChevronDown, Terminal, Package, Cloud, Server, GitPullRequest, GitCommit, GitMerge, Settings, Monitor, Smartphone, Tablet } from 'lucide-react';
import { NexusPulse } from '@/components/loader/NexusPulse';
import { useTheme } from '@/contexts/ThemeContext';

export default function LandingPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [animatedStats, setAnimatedStats] = useState({ accuracy: 0, analysisTime: 0, modules: 0, updates: 0 });

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/projects');
    }
  }, [router]);

  useEffect(() => {
    // Animate stats on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      setAnimatedStats({
        accuracy: Math.round(98.8 * scrollProgress),
        analysisTime: Math.round(30 * scrollProgress),
        modules: Math.round(6 * scrollProgress),
        updates: Math.round(100 * scrollProgress)
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Stunning Premium Background Layers */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 10%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 10% 90%, rgba(251, 146, 60, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, 
            rgba(99, 102, 241, 0.03) 0%, 
            rgba(168, 85, 247, 0.05) 25%, 
            rgba(236, 72, 153, 0.03) 50%, 
            rgba(251, 146, 60, 0.05) 75%, 
            rgba(99, 102, 241, 0.03) 100%
          )
        `,
        animation: 'stunningGradientShift 25s ease-in-out infinite',
        zIndex: 0,
      }} />
      
      {/* Animated Particle Field */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.08) 0%, transparent 30%),
          radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.08) 0%, transparent 30%),
          radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.06) 0%, transparent 40%),
          radial-gradient(circle at 10% 90%, rgba(251, 146, 60, 0.06) 0%, transparent 40%),
          radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.04) 0%, transparent 35%),
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 60px 60px',
        opacity: 0.2,
        animation: 'particleFloat 30s ease-in-out infinite, gridMove 25s linear infinite',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      
      {/* Floating Orbs */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        {[
          { size: 200, left: 15, top: 20, color: 'rgba(99, 102, 241, 0.1)', delay: 0 },
          { size: 150, left: 85, top: 75, color: 'rgba(168, 85, 247, 0.08)', delay: 5 },
          { size: 250, left: 45, top: 10, color: 'rgba(236, 72, 153, 0.06)', delay: 10 },
          { size: 180, left: 70, top: 40, color: 'rgba(99, 102, 241, 0.08)', delay: 15 },
          { size: 220, left: 25, top: 85, color: 'rgba(168, 85, 247, 0.06)', delay: 20 },
          { size: 160, left: 60, top: 60, color: 'rgba(236, 72, 153, 0.08)', delay: 25 }
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

      {/* Premium Year Badge */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '8rem',
        background: 'linear-gradient(135deg, var(--accent), #a855f7)',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '24px',
        fontSize: '0.875rem',
        fontWeight: 600,
        zIndex: 10,
        boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        animation: 'float 6s ease-in-out infinite',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={16} />
          <span>Final Year Project · CS 2026</span>
        </div>
      </div>
        
      {/* Premium Theme Toggle */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}
        >
          <div style={{
            color: 'var(--accent)',
            transition: 'all 0.3s ease',
          }}>
            {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
          </div>
        </button>
      </div>

      {/* Premium Hero Section */}
      <section style={{
        padding: '8rem 1rem 6rem',
        textAlign: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          width: '100%',
        }}>
          {/* Left Column - Premium Headlines */}
          <div style={{ textAlign: 'left' }}>
            {/* Premium Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '0.75rem 1.5rem',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--accent)',
              backdropFilter: 'blur(10px)',
              animation: 'slideInLeft 0.8s ease-out',
            }}>
              <Rocket size={18} />
              <span>AI-Powered Project Intelligence</span>
              <ChevronDown size={16} style={{ animation: 'bounce 2s infinite' }} />
            </div>
            
            {/* Premium Headline */}
            <h1 style={{
              fontSize: 'clamp(3rem, 7vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 30%, #a855f7 60%, var(--text-primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              animation: 'fadeInUp 1s ease-out',
              textShadow: '0 0 80px rgba(99,102,241,0.3)',
            }}>
              Ship Faster.<br />
              Track Smarter.<br />
              <span style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>Deliver Better.</span>
            </h1>
            
            {/* Premium Description */}
            <p style={{
              fontSize: '1.375rem',
              color: 'var(--text-secondary)',
              marginBottom: '3rem',
              maxWidth: '600px',
              lineHeight: 1.7,
              animation: 'fadeInUp 1.2s ease-out',
              fontWeight: 400,
            }}>
              Prodexa connects to your GitHub and uses advanced AI to predict delivery risks, 
              track developer productivity, and provide your team with real-time intelligence 
              that transforms how you build software.
            </p>
            
            {/* Premium Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              animation: 'fadeInUp 1.4s ease-out',
            }}>
              <button 
                className="btn-primary" 
                style={{
                  fontSize: '1.125rem',
                  padding: '1.25rem 2.5rem',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'linear-gradient(135deg, var(--accent), #a855f7)',
                  color: 'white',
                  border: 'none',
                  fontWeight: 600,
                  boxShadow: '0 12px 40px rgba(99,102,241,0.4)',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(99,102,241,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.4)';
                }}
                onClick={() => {
                  window.location.href = 'http://localhost:3001/auth/github';
                }}
              >
                <GitBranch size={20} />
                Get Started with GitHub
                <ArrowRight size={18} />
              </button>
              
              <button style={{
                fontSize: '1rem',
                padding: '1.25rem 2.5rem',
                borderRadius: '16px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                fontWeight: 600,
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <Monitor style={{ marginRight: '0.5rem', display: 'inline' }} size={18} />
                View Dashboard Demo
              </button>
            </div>
            
            {/* Premium Trust Indicators */}
            <div style={{ 
              display: 'flex', 
              gap: '2.5rem', 
              marginTop: '3rem',
              animation: 'fadeInUp 1.6s ease-out',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #34d399, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
                }}>
                  <CheckCircle2 size={14} />
                </div>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Free to use</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #34d399, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
                }}>
                  <Lock size={14} />
                </div>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Secure GitHub OAuth</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Premium Dashboard Preview */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid var(--border)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            animation: 'slideInRight 1s ease-out',
          }}>
            {/* Premium Dashboard Header */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {['Alex Chen', 'Sarah Kim', 'Mike Johnson'].map((dev, i) => (
                  <div key={i} style={{
                    background: 'linear-gradient(135deg, var(--bg), var(--bg-hover))',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                    fontWeight: 500,
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    animation: `fadeInUp 1.2s ease-out ${i * 0.1}s both`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, #6366f1, #a855f7, #ec4899)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}>
                        {dev.charAt(0)}
                      </div>
                      {dev}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                width: '140px',
                height: '6px',
                background: 'linear-gradient(90deg, var(--border), var(--accent), var(--border))',
                borderRadius: '3px',
                margin: '0 auto',
                animation: 'slideInWidth 1.5s ease-out',
              }} />
            </div>
            
            {/* Premium Health Score Gauge */}
            <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 2.5rem' }}>
              <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 8px 32px rgba(99,102,241,0.2))' }}>
                {/* Background circle */}
                <circle
                  cx="100" cy="60" r="50"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="10"
                  opacity="0.3"
                />
                {/* Progress arc */}
                <circle
                  cx="100" cy="60" r="50"
                  fill="none"
                  stroke="url(#premiumGaugeGradient)"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.73)}`}
                  transform="rotate(-90 100 60)"
                  style={{
                    transition: 'stroke-dashoffset 2s ease-out',
                    filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.5))',
                  }}
                />
                <defs>
                  <linearGradient id="premiumGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="30%" stopColor="#fbbf24" />
                    <stop offset="70%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <text
                  x="100" y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="28"
                  fontWeight="800"
                  fill="var(--text-primary)"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
                >
                  73
                </text>
                <text
                  x="100" y="85"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="var(--text-secondary)"
                >
                  Health Score
                </text>
              </svg>
              
              {/* Animated glow effect */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
            </div>
            
            {/* Premium Developer Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Active', value: '3', color: '#34d399' },
                { label: 'Commits', value: '47', color: '#6366f1' },
                { label: 'PRs', value: '12', color: '#a855f7' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'var(--bg)',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  animation: `fadeInUp 1.4s ease-out ${i * 0.15}s both`,
                }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: stat.color, marginBottom: '0.25rem' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Premium Developer Avatars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              {['AC', 'SK', 'MJ'].map((avatar, i) => (
                <div key={i} style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, #6366f1, #a855f7, #ec4899)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'white',
                  border: '2px solid var(--bg-card)',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                  animation: `fadeInUp 1.6s ease-out ${i * 0.1}s both`,
                  transition: 'all 0.3s ease',
                }}>
                  {avatar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Problem Banner (Modern Premium Design) */}
      <section style={{
        background: 'var(--bg-card)',
        padding: '6rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Premium gradient background overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, 
              rgba(99, 102, 241, 0.05) 0%, 
              rgba(168, 85, 247, 0.08) 25%, 
              rgba(236, 72, 153, 0.05) 50%, 
              rgba(251, 146, 60, 0.08) 75%, 
              rgba(99, 102, 241, 0.05) 100%
            )
          `,
          animation: 'gradientShift 15s ease-in-out infinite',
        }} />
        
        {/* Subtle mesh pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 10%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, rgba(251, 146, 60, 0.08) 0%, transparent 50%)
          `,
          animation: 'meshFloat 20s ease-in-out infinite',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Premium heading with modern typography */}
          <div style={{ marginBottom: '4rem' }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}>
              <span style={{
                width: '32px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--accent))',
              }} />
              <span style={{ animation: 'subtlePulse 3s ease-in-out infinite' }}>
                ⚡ The old way is broken.
              </span>
              <span style={{
                width: '32px',
                height: '1px',
                background: 'linear-gradient(90deg, var(--accent), transparent)',
              }} />
            </div>
            
            {/* <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 600,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 50%, var(--text-primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'white'
            }}>
              Traditional methods are holding you back.
            </h2> */}
            
            <p style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Stop wasting time on outdated workflows that drain productivity and obscure real insights.
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
          }}>
            {[
              {
                icon: <AlertTriangle size={44} />,
                title: 'Manual Data Entry',
                description: 'Countless hours lost to copying data between spreadsheets and tools instead of focusing on what matters',
                accent: '#6366f1',
                bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.02))'
              },
              {
                icon: <AlertTriangle size={44} />,
                title: 'Reactive Problem Solving',
                description: 'Discovering critical issues when it\'s already too late, instead of preventing them before they impact delivery',
                accent: '#a855f7',
                bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(168, 85, 247, 0.02))'
              },
              {
                icon: <AlertTriangle size={44} />,
                title: 'Gut-Feel Decisions',
                description: 'Making crucial calls based on intuition rather than data-driven insights and predictive analytics',
                accent: '#ec4899',
                bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(236, 72, 153, 0.02))'
              }
            ].map((problem, index) => (
              <div key={index} style={{
                background: 'var(--bg)',
                backdropFilter: 'blur(20px)',
                padding: '3rem 2rem',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                textAlign: 'center',
                transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateY(0)',
                animation: `slideInUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.15}s both`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              }}>
                {/* Premium gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: problem.bgGradient,
                  opacity: 1,
                }} />
                
                {/* Hover state overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at center, ${problem.accent}15 0%, transparent 70%)`,
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                }} />
                
                {/* Premium icon container */}
                <div style={{
                  marginBottom: '2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '88px',
                  height: '88px',
                  borderRadius: '20px',
                  background: problem.bgGradient,
                  border: '1px solid var(--border)',
                  boxShadow: `0 8px 32px ${problem.accent}20`,
                  position: 'relative',
                  transition: 'all 0.4s ease',
                }}>
                  <div style={{
                    color: problem.accent,
                    filter: 'drop-shadow(0 0 20px currentColor)',
                  }}>
                    {problem.icon}
                  </div>
                </div>
                
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: 'var(--text-primary)',
                  position: 'relative',
                  lineHeight: 1.3,
                }}>
                  <span style={{
                    position: 'relative',
                    display: 'inline-block',
                  }}>
                    {problem.title}
                    <span style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, transparent, ${problem.accent}, transparent)`,
                      transform: 'scaleX(0)',
                      transition: 'transform 0.4s ease',
                    }} />
                  </span>
                </h3>
                
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  fontWeight: 400,
                  position: 'relative',
                }}>
                  {problem.description}
                </p>

                {/* Modern decorative elements */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: problem.accent,
                  opacity: 0.6,
                  animation: 'dotPulse 2s ease-in-out infinite',
                }} />
                
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: problem.accent,
                  opacity: 0.4,
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Premium animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes gradientShift {
              0%, 100% { 
                background-position: 0% 50%;
                transform: rotate(0deg);
              }
              50% { 
                background-position: 100% 50%;
                transform: rotate(1deg);
              }
            }
            
            @keyframes meshFloat {
              0%, 100% { 
                transform: translateY(0px) scale(1);
                opacity: 0.8;
              }
              33% { 
                transform: translateY(-15px) scale(1.02);
                opacity: 0.9;
              }
              66% { 
                transform: translateY(10px) scale(0.98);
                opacity: 0.7;
              }
            }
            
            @keyframes slideInUp {
              from {
                opacity: 0;
                transform: translateY(40px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            @keyframes slideInLeft {
              from {
                opacity: 0;
                transform: translateX(-40px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
            }
            
            @keyframes slideInRight {
              from {
                opacity: 0;
                transform: translateX(40px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
            }
            
            @keyframes slideInDown {
              from {
                opacity: 0;
                transform: translateY(-40px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            @keyframes slideInWidth {
              from {
                width: 0;
                opacity: 0;
              }
              to {
                width: 140px;
                opacity: 1;
              }
            }
            
            @keyframes subtlePulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            
            @keyframes dotPulse {
              0%, 100% { 
                transform: scale(1);
                opacity: 0.6;
              }
              50% { 
                transform: scale(1.3);
                opacity: 0.9;
              }
            }
            
            @keyframes bounce {
              0%, 20%, 53%, 80%, 100% {
                transform: translate3d(0,0,0);
              }
              40%, 43% {
                transform: translate3d(0, -8px, 0);
              }
              70% {
                transform: translate3d(0, -4px, 0);
              }
              90% {
                transform: translate3d(0, -2px, 0);
              }
            }
            
            @keyframes float {
              0%, 100% { 
                transform: translateY(0px) rotate(0deg);
              }
              50% { 
                transform: translateY(-10px) rotate(1deg);
              }
            }
            
            @keyframes gridMove {
              0% { 
                transform: translate(0, 0);
              }
              100% { 
                transform: translate(40px, 40px);
              }
            }
            
            @keyframes pulse {
              0%, 100% { 
                transform: scale(1); 
                opacity: 1; 
              }
              50% { 
                transform: scale(1.05); 
                opacity: 0.9; 
              }
            }
            
            @keyframes stunningGradientShift {
              0%, 100% { 
                background-position: 0% 50%;
                transform: rotate(0deg) scale(1);
              }
              25% { 
                background-position: 50% 25%;
                transform: rotate(0.5deg) scale(1.02);
              }
              50% { 
                background-position: 100% 50%;
                transform: rotate(-0.5deg) scale(1.01);
              }
              75% { 
                background-position: 50% 75%;
                transform: rotate(0.3deg) scale(1.02);
              }
            }
            
            @keyframes particleFloat {
              0%, 100% { 
                transform: translateY(0px) translateX(0px) scale(1);
                opacity: 0.2;
              }
              25% { 
                transform: translateY(-20px) translateX(10px) scale(1.05);
                opacity: 0.3;
              }
              50% { 
                transform: translateY(10px) translateX(-15px) scale(0.95);
                opacity: 0.25;
              }
              75% { 
                transform: translateY(-10px) translateX(20px) scale(1.02);
                opacity: 0.35;
              }
            }
            
            @keyframes orbFloat {
              0%, 100% { 
                transform: translate(-50%, -50%) translateY(0px) scale(1);
                opacity: 0.6;
              }
              33% { 
                transform: translate(-50%, -50%) translateY(-30px) translateX(20px) scale(1.1);
                opacity: 0.8;
              }
              66% { 
                transform: translate(-50%, -50%) translateY(20px) translateX(-15px) scale(0.9);
                opacity: 0.4;
              }
            }
          `
        }} />
      </section>

      {/* Section 3 — Premium Features Grid */}
      <section style={{
        padding: '8rem 1rem',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Premium background effects */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.03) 0%, transparent 70%)
          `,
          animation: 'meshFloat 25s ease-in-out infinite',
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Premium Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '1rem 2rem',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--accent)',
              backdropFilter: 'blur(10px)',
              animation: 'slideInDown 0.8s ease-out',
            }}>
              <Sparkles size={18} />
              <span>Premium Features</span>
              <Sparkles size={18} />
            </div>
            
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              animation: 'fadeInUp 1s ease-out',
            }}>
              Everything your team needs.<br />
              Nothing it doesn't.
            </h2>
            
            <p style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.7,
              animation: 'fadeInUp 1.2s ease-out',
            }}>
              Powerful features designed to transform how your team builds, ships, and delivers software.
            </p>
          </div>
          
          {/* Premium Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '2.5rem',
          }}>
            {[
              {
                icon: <GitBranch size={48} />,
                title: 'GitHub Integration',
                description: 'Seamless sync with commits, PRs, and issues. Real-time updates keep your team in sync.',
                color: '#6366f1',
                bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.02))',
                hoverColor: 'rgba(99, 102, 241, 0.15)'
              },
              {
                icon: <Brain size={48} />,
                title: 'ML Risk Prediction',
                description: 'Advanced Random Forest model with 98.8% accuracy predicts delivery risks before they impact.',
                color: '#8b5cf6',
                bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.02))',
                hoverColor: 'rgba(168, 85, 247, 0.15)'
              },
              {
                icon: <Activity size={48} />,
                title: 'Live Dashboard',
                description: 'WebSocket-powered real-time updates give you instant visibility into team performance.',
                color: '#10b981',
                bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))',
                hoverColor: 'rgba(16, 185, 129, 0.15)'
              },
              {
                icon: <Award size={48} />,
                title: 'Developer Leaderboard',
                description: 'Gamified productivity scores and rankings that motivate your team to excel.',
                color: '#f59e0b',
                bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02))',
                hoverColor: 'rgba(245, 158, 11, 0.15)'
              },
              {
                icon: <Bell size={48} />,
                title: 'Smart Notifications',
                description: 'Intelligent alerts on productivity drops, delivery risks, and milestone achievements.',
                color: '#ec4899',
                bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.02))',
                hoverColor: 'rgba(236, 72, 153, 0.15)'
              },
              {
                icon: <Shield size={48} />,
                title: 'Admin Control',
                description: 'Comprehensive user and project management with enterprise-grade security and permissions.',
                color: '#6366f1',
                bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.02))',
                hoverColor: 'rgba(99, 102, 241, 0.15)'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                style={{
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(20px)',
                  padding: '3rem 2.5rem',
                  borderRadius: '24px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: 'translateY(0)',
                  animation: `slideInUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.15}s both`,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 20px 60px ${feature.color}30`;
                  e.currentTarget.style.borderColor = feature.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                {/* Premium gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: feature.bgGradient,
                  opacity: 1,
                  transition: 'opacity 0.4s ease',
                }} />
                
                {/* Hover glow effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at center, ${feature.hoverColor} 0%, transparent 70%)`,
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                }} />
                
                {/* Premium icon container */}
                <div style={{
                  marginBottom: '2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '96px',
                  height: '96px',
                  borderRadius: '24px',
                  background: feature.bgGradient,
                  border: '1px solid var(--border)',
                  boxShadow: `0 8px 32px ${feature.color}25`,
                  position: 'relative',
                  transition: 'all 0.4s ease',
                }}>
                  <div style={{
                    color: feature.color,
                    filter: 'drop-shadow(0 0 20px currentColor)',
                    transition: 'all 0.3s ease',
                  }}>
                    {feature.icon}
                  </div>
                </div>
                
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: 'var(--text-primary)',
                  position: 'relative',
                  lineHeight: 1.3,
                }}>
                  <span style={{
                    position: 'relative',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                  }}>
                    {feature.title}
                    <span style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                      transform: 'scaleX(0)',
                      transition: 'transform 0.4s ease',
                    }} />
                  </span>
                </h3>
                
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  fontWeight: 400,
                  position: 'relative',
                }}>
                  {feature.description}
                </p>

                {/* Premium decorative elements */}
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: feature.color,
                  opacity: 0.6,
                  animation: 'dotPulse 3s ease-in-out infinite',
                }} />
                
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: feature.color,
                  opacity: 0.4,
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Premium How It Works */}
      <section style={{
        padding: '8rem 1rem',
        background: 'var(--bg-card)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Premium background effects */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `
            radial-gradient(circle at 33% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 66% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(168, 85, 247, 0.03) 100%)
          `,
          animation: 'meshFloat 30s ease-in-out infinite',
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Premium Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '1rem 2rem',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--accent)',
              backdropFilter: 'blur(10px)',
              animation: 'slideInDown 0.8s ease-out',
            }}>
              <Zap size={18} />
              <span>Simple Process</span>
              <Zap size={18} />
            </div>
            
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              animation: 'fadeInUp 1s ease-out',
            }}>
              How Prodexa Works
            </h2>
            
            <p style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.7,
              animation: 'fadeInUp 1.2s ease-out',
            }}>
              Get started in minutes with our simple 3-step process for intelligent project management.
            </p>
          </div>
          
          {/* Premium Steps Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '3rem',
            position: 'relative',
          }}>
            {/* Premium connecting lines */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              zIndex: 0,
              animation: 'slideInWidth 2s ease-out',
            }} />
            
            {[
              {
                step: '1',
                title: 'Connect',
                description: 'Simply paste your GitHub repository URL and watch the magic happen',
                code: 'https://github.com/username/repo',
                icon: <GitBranch size={48} />,
                color: '#6366f1',
                bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.02))'
              },
              {
                step: '2',
                title: 'Analyze',
                description: 'Our intelligent queue system automatically fetches and analyzes all repository activity',
                code: 'const analysis = await prodexa.analyze(repo)',
                icon: <Brain size={48} />,
                color: '#8b5cf6',
                bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.02))'
              },
              {
                step: '3',
                title: 'Predict',
                description: 'Advanced ML models score your team performance and flag potential delivery risks',
                code: 'const risks = await ml.predict(teamData)',
                icon: <Sparkles size={48} />,
                color: '#ec4899',
                bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.02))'
              }
            ].map((step, index) => (
              <div 
                key={index} 
                style={{ 
                  textAlign: 'center', 
                  position: 'relative', 
                  zIndex: 1,
                  animation: `slideInUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.2}s both`,
                }}
              >
                {/* Premium Step Circle */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  fontWeight: 800,
                  margin: '0 auto 2rem',
                  boxShadow: `0 15px 40px ${step.color}40`,
                  position: 'relative',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                  e.currentTarget.style.boxShadow = `0 25px 60px ${step.color}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = `0 15px 40px ${step.color}40`;
                }}
              >
                {/* Glow effect */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${step.color}40 0%, transparent 70%)`,
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                <span style={{ position: 'relative', zIndex: 1 }}>{step.step}</span>
              </div>
                
                {/* Premium Icon */}
                <div style={{
                  marginBottom: '2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: step.bgGradient,
                  border: '1px solid var(--border)',
                  boxShadow: `0 8px 32px ${step.color}25`,
                  position: 'relative',
                  transition: 'all 0.4s ease',
                }}>
                  <div style={{
                    color: step.color,
                    filter: 'drop-shadow(0 0 20px currentColor)',
                  }}>
                    {step.icon}
                  </div>
                </div>
                
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  color: 'var(--text-primary)',
                  position: 'relative',
                  lineHeight: 1.3,
                }}>
                  <span style={{
                    position: 'relative',
                    display: 'inline-block',
                  }}>
                    {step.title}
                    <span style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
                      transform: 'scaleX(0)',
                      transition: 'transform 0.4s ease',
                    }} />
                  </span>
                </h3>
                
                {/* Premium Code Block */}
                <div style={{
                  background: 'var(--bg)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  color: 'var(--accent)',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}>
                  {/* Code background gradient */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: step.bgGradient,
                    opacity: 0.5,
                  }} />
                  <code style={{ position: 'relative', zIndex: 1 }}>
                    {step.code}
                  </code>
                </div>
                
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — Premium Stats */}
      <section style={{
        padding: '8rem 1rem',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Premium background effects */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 70%),
            radial-gradient(circle at 10% 90%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)
          `,
          animation: 'meshFloat 25s ease-in-out infinite',
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Premium Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '1rem 2rem',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--accent)',
              backdropFilter: 'blur(10px)',
              animation: 'slideInDown 0.8s ease-out',
            }}>
              <Trophy size={18} />
              <span>Proven Results</span>
              <Trophy size={18} />
            </div>
            
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              animation: 'fadeInUp 1s ease-out',
            }}>
              Trusted by Teams Worldwide
            </h2>
            
            <p style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.7,
              animation: 'fadeInUp 1.2s ease-out',
            }}>
              Join thousands of developers who rely on Prodexa for intelligent project management.
            </p>
          </div>
          
          {/* Premium Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
          }}>
            {[
              { 
                value: animatedStats.accuracy, 
                label: 'ML Accuracy', 
                suffix: '%', 
                color: '#10b981',
                bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))',
                icon: <Target size={32} />
              },
              { 
                value: animatedStats.analysisTime, 
                label: 'Analysis Time', 
                suffix: 's', 
                color: '#f59e0b',
                bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02))',
                icon: <Zap size={32} />
              },
              { 
                value: animatedStats.modules, 
                label: 'Core Modules', 
                suffix: '+', 
                color: '#6366f1',
                bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.02))',
                icon: <Package size={32} />
              },
              { 
                value: animatedStats.updates, 
                label: 'Real-time Updates', 
                suffix: '/s', 
                color: '#8b5cf6',
                bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.02))',
                icon: <Activity size={32} />
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                style={{
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(20px)',
                  padding: '3rem 2rem',
                  borderRadius: '24px',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: 'translateY(0)',
                  animation: `slideInUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.15}s both`,
                  transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 20px 60px ${stat.color}30`;
                  e.currentTarget.style.borderColor = stat.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                {/* Premium gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: stat.bgGradient,
                  opacity: 1,
                  transition: 'opacity 0.4s ease',
                }} />
                
                {/* Hover glow effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at center, ${stat.color}15 0%, transparent 70%)`,
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                }} />
                
                {/* Premium icon container */}
                <div style={{
                  marginBottom: '2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: stat.bgGradient,
                  border: '1px solid var(--border)',
                  boxShadow: `0 8px 32px ${stat.color}25`,
                  position: 'relative',
                  transition: 'all 0.4s ease',
                }}>
                  <div style={{
                    color: stat.color,
                    filter: 'drop-shadow(0 0 20px currentColor)',
                  }}>
                    {stat.icon}
                  </div>
                </div>
                
                {/* Animated number display */}
                <div style={{
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: 900,
                  color: stat.color,
                  marginBottom: '1rem',
                  fontFamily: 'monospace',
                  position: 'relative',
                  display: 'inline-block',
                  textShadow: `0 0 20px ${stat.color}40`,
                  animation: 'pulse 2s ease-in-out infinite',
                }}>
                  <span style={{
                    position: 'relative',
                    display: 'inline-block',
                  }}>
                    {stat.value}
                    <span style={{
                      fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                      marginLeft: '0.25rem',
                    }}>
                      {stat.suffix}
                    </span>
                    <span style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                      transform: 'scaleX(0)',
                      transition: 'transform 0.4s ease',
                    }} />
                  </span>
                </div>
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  position: 'relative',
                  lineHeight: 1.3,
                  marginBottom: '0.5rem',
                }}>
                  {stat.label}
                </h3>
                
                {/* Decorative elements */}
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: stat.color,
                  opacity: 0.6,
                  animation: 'dotPulse 3s ease-in-out infinite',
                }} />
                
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: stat.color,
                  opacity: 0.4,
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — Tech Stack */}
      <section style={{
        padding: '4rem 1rem',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'var(--text-primary)',
          }}>
            Built with Modern, Production-Grade Technology
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}>
            {[
              { name: 'NestJS', color: '#ea580c' },
              { name: 'FastAPI', color: '#009688' },
              { name: 'Next.js', color: '#000000' },
              { name: 'PostgreSQL', color: '#336791' },
              { name: 'Redis', color: '#dc382d' }
            ].map((tech, index) => (
              <div key={index} style={{
                background: tech.color,
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '20px',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>
                {tech.name}
              </div>
            ))}
          </div>
          
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            Each technology chosen for scalability, security, and performance in enterprise environments
          </p>
        </div>
      </section>

      {/* Section 7 — Final CTA */}
      <section style={{
        padding: '6rem 1rem',
        background: 'linear-gradient(135deg, var(--bg-card), var(--bg))',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, var(--text-primary), var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Ready to bring intelligence to your project?
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            color: 'var(--text-secondary)',
            marginBottom: '3rem',
            lineHeight: 1.6,
          }}>
            No credit card. No setup. Just GitHub.
          </p>
          
          <a href="http://localhost:3001/auth/github" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{
              fontSize: '1.4rem',
              padding: '1.5rem 4rem',
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 12px 30px rgba(99,102,241,0.4)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0, left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shimmer 2s infinite',
              }} />
              <GitBranch size={28} style={{ position: 'relative', zIndex: 1 }} />
              Bring Intelligence to Your Project
            </button>
          </a>
        </div>
      </section>

      {/* Section 8 — Footer */}
      <footer style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        padding: '3rem 1rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'white',
              }}>
                P
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Prodexa</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Built for FYP · CS Department · 2026
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="/projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Projects</a>
              <a href="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Admin</a>
              <a href="/notifications" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Notifications</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes countUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(99,102,241,0.4) !important;
        }
      `}</style>
    </div>
  );
}
