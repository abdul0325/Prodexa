'use client';

import { useState, useEffect } from 'react';
import { GitBranch, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface NavbarProps {
  onThemeToggle: () => void;
}

export function Navbar({ onThemeToggle }: NavbarProps) {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
  { label: 'Features', id: 'features-section' },
  { label: 'How it Works', id: 'how-it-works' },
  { label: 'Tech Stack', id: 'tech-stack' },
];

const handleNavClick = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  }
};

  const handleGitHubAuth = () => {
    window.location.href = 'http://localhost:3001/auth/github';
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled 
            ? theme === 'dark' 
              ? 'rgba(7,8,15,0.85)' 
              : 'rgba(242,244,251,0.9)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.5)' : 'none',
          borderBottom: scrolled ? `1px solid var(--border)` : 'none',
          transition: 'all 200ms ease',
          padding: '1rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1.2rem',
              }}
            >
              P
            </div>
            Prodexa
          </div>

          {/* Desktop Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            {/* Nav Links */}
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
              }}
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 200ms ease',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent)';
                    const underline = e.currentTarget.querySelector('::after');
                    if (underline) {
                      (underline as HTMLElement).style.transform = 'scaleX(1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    const underline = e.currentTarget.querySelector('::after');
                    if (underline) {
                      (underline as HTMLElement).style.transform = 'scaleX(0)';
                    }
                  }}
                >
                  {link.label}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'center',
                      transition: 'transform 200ms ease',
                    }}
                  />
                </button>
              ))}
            </div>

            {/* CTA Button */}
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
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 200ms ease',
                boxShadow: '0 0 24px var(--accent-glow)',
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
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                color: 'var(--accent)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 51,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          width: '44px',
          height: '44px',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Menu size={20} color="var(--text-primary)" />
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme === 'dark' ? 'rgba(7,8,15,0.98)' : 'rgba(242,244,251,0.98)',
            backdropFilter: 'blur(16px)',
            zIndex: 52,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            padding: '2rem',
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} color="var(--text-primary)" />
          </button>

          {/* Mobile Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1.5rem',
              }}
            >
              P
            </div>
            Prodexa
          </div>

          {/* Mobile Nav Links */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {navLinks.map((link, index) => (
              <button
                key={link}
                onClick={() => handleNavClick(link)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Mobile CTA Button */}
          <button
            onClick={handleGitHubAuth}
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-bright))',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 0 32px var(--accent-glow)',
              fontFamily: 'var(--font-body)',
              animation: 'fadeInUp 0.5s ease-out 0.4s both',
            }}
          >
            <GitBranch size={20} />
            Sign in with GitHub
          </button>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          nav > div > div:last-child {
            display: none;
          }
          button[style*="display: none"] {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
