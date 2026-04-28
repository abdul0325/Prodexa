'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/api';
import { GitBranch, TrendingUp, Brain, Users, AlertTriangle, Bell, Zap, Code, Database, BarChart3, Star, Award, Activity, Shield, Sparkles } from 'lucide-react';
import { NexusPulse } from '@/components/loader/NexusPulse';

export default function LandingPage() {
  const router = useRouter();
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
      
      {/* Animated Background Grid */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: 0.1,
        animation: 'gridMove 20s linear infinite',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Year Badge */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        background: 'var(--accent)',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 600,
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
      }}>
        ✦ Final Year Project · CS 2026
      </div>

      {/* Section 1 — Hero (Full Viewport) */}
      <section style={{
        padding: '6rem 1rem 4rem',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center',
        }}>
          {/* Left Column - Headlines */}
          <div style={{ textAlign: 'left' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, var(--text-primary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}>
              Ship Faster.<br />
              Track Smarter.
            </h1>
            
            <p style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              marginBottom: '3rem',
              maxWidth: '500px',
              lineHeight: 1.6,
            }}>
              Prodexa connects to your GitHub and uses AI to predict delivery risks, track developer productivity, and give your team real-time intelligence.
            </p>
            
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn-primary" 
                style={{
                    fontSize: '1.1rem',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 8px 25px rgba(99,102,241,0.3)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={() => {
                    // Direct OAuth redirect
                    window.location.href = 'http://localhost:3001/auth/github';
                  }}
                >
                  Get Started with GitHub
                </button>
              
              <button style={{
                fontSize: '1rem',
                padding: '1rem 2rem',
                borderRadius: '12px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                transition: 'all 0.3s ease',
              }}>
                View Dashboard Demo
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>✓</div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Free to use</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>✓</div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>GitHub OAuth</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Dashboard Preview */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Dashboard Header */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {['👤 Alex Chen', '👤 Sarah Kim', '👤 Mike Johnson'].map((dev, i) => (
                  <div key={i} style={{
                    background: 'var(--bg)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}>
                    {dev}
                  </div>
                ))}
              </div>
              <div style={{
                width: '120px',
                height: '8px',
                background: 'var(--border)',
                borderRadius: '4px',
                margin: '0 auto',
              }} />
            </div>
            
            {/* Health Score Gauge */}
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 2rem' }}>
              <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
                {/* Background circle */}
                <circle
                  cx="100" cy="60" r="50"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="8"
                />
                {/* Progress arc */}
                <circle
                  cx="100" cy="60" r="50"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.73)}`}
                  transform="rotate(-90 100 60)"
                  style={{
                    transition: 'stroke-dashoffset 2s ease-out',
                  }}
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <text
                  x="100" y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="24"
                  fontWeight="700"
                  fill="var(--text-primary)"
                >
                  73
                </text>
              </svg>
            </div>
            
            {/* Developer Avatars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {['👤', '👤', '👤'].map((avatar, i) => (
                <div key={i} style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  border: '2px solid var(--border)',
                }}>
                  {avatar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Problem Banner (Dark strip) */}
      <section style={{
        background: '#080a10',
        padding: '4rem 1rem',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '3rem',
            color: 'white',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            The old way is broken.
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
          }}>
            {[
              {
                icon: <AlertTriangle size={40} />,
                title: 'Manual spreadsheet tracking',
                description: 'Hours wasted copying data between tools instead of automated insights',
                color: '#ef4444'
              },
              {
                icon: <AlertTriangle size={40} />,
                title: 'No early warning on delivery risks',
                description: 'Discovering issues when it\'s already too late to fix them',
                color: '#ef4444'
              },
              {
                icon: <AlertTriangle size={40} />,
                title: 'Guessing developer productivity',
                description: 'Making decisions based on feelings instead of real data and metrics',
                color: '#ef4444'
              }
            ].map((problem, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(239,68,68,0.2)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}>
                <div style={{
                  color: problem.color,
                  marginBottom: '1.5rem',
                  display: 'inline-block',
                }}>
                  {problem.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: 'white',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'relative',
                    textDecoration: 'line-through',
                    textDecorationColor: problem.color,
                    textDecorationThickness: '2px',
                  }}>
                    {problem.title}
                  </span>
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.8)',
                }}>
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Features Grid */}
      <section style={{
        padding: '4rem 1rem',
        background: 'var(--bg)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'var(--text-primary)',
          }}>
            Everything your team needs. Nothing it doesn't.
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
          }}>
            {[
              {
                icon: <GitBranch size={40} />,
                title: 'GitHub Integration',
                description: 'Automatic commit, PR, issue sync',
                color: '#6366f1'
              },
              {
                icon: <Brain size={40} />,
                title: 'ML Risk Prediction',
                description: 'Random Forest model, 98.8% accuracy',
                color: '#8b5cf6'
              },
              {
                icon: <Activity size={40} />,
                title: 'Live Dashboard',
                description: 'WebSocket real-time updates',
                color: '#10b981'
              },
              {
                icon: <Award size={40} />,
                title: 'Developer Leaderboard',
                description: 'Ranked productivity scores',
                color: '#f59e0b'
              },
              {
                icon: <Bell size={40} />,
                title: 'Smart Notifications',
                description: 'Auto alerts on productivity drops',
                color: '#8b5cf6'
              },
              {
                icon: <Shield size={40} />,
                title: 'Admin Control',
                description: 'Full user and project management',
                color: '#6366f1'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: `linear-gradient(45deg, transparent 30%, ${feature.color}15 30%, transparent 70%)`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }} />
                <div style={{
                  color: feature.color,
                  marginBottom: '1.5rem',
                  display: 'inline-block',
                  filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.3))',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: 'var(--text-primary)',
                  position: 'relative',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — How It Works (3 steps) */}
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
            How Prodexa Works
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            position: 'relative',
          }}>
            {/* Connecting dotted lines */}
            <svg style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 0,
            }}>
              <defs>
                <pattern id="dots" x="0" y="0" width="20" height="1" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="0.5" r="1" fill="var(--border)" />
                </pattern>
              </defs>
              <line x1="16.67%" y1="50%" x2="50%" y2="50%" stroke="var(--border)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="50%" x2="83.33%" y2="50%" stroke="var(--border)" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
            
            {[
              {
                step: '1',
                title: 'Connect',
                description: 'Paste your GitHub repo URL',
                code: 'https://github.com/username/repo',
                icon: <GitBranch size={32} />
              },
              {
                step: '2',
                title: 'Analyze',
                description: 'Our queue fetches all activity automatically',
                code: 'const analysis = await prodexa.analyze(repo)',
                icon: <Brain size={32} />
              },
              {
                step: '3',
                title: 'Predict',
                description: 'ML model scores your team and flags risks',
                code: 'const risks = await ml.predict(teamData)',
                icon: <Sparkles size={32} />
              }
            ].map((step, index) => (
              <div key={index} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 8px 25px rgba(99,102,241,0.3)',
                }}>
                  {step.step}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: 'var(--text-primary)',
                }}>
                  {step.title}
                </h3>
                <div style={{
                  background: 'var(--bg)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                }}>
                  {step.code}
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

      {/* Section 5 — Live Stats Bar */}
      <section style={{
        padding: '4rem 1rem',
        background: 'var(--bg)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'var(--text-primary)',
          }}>
            Trusted by Teams Worldwide
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
          }}>
            {[
              { value: animatedStats.accuracy, label: 'ML Accuracy', suffix: '%', color: '#10b981' },
              { value: animatedStats.analysisTime, label: 'Analysis Time', suffix: 's', color: '#f59e0b' },
              { value: animatedStats.modules, label: 'Core Modules', suffix: '+', color: '#6366f1' },
              { value: animatedStats.updates, label: 'Real-time Updates', suffix: '/s', color: '#8b5cf6' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: stat.color,
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                }}>
                  {stat.label}
                </div>
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
