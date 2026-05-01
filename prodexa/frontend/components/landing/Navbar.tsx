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
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'Tech Stack', id: 'tech-stack' },
  ];

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleGitHubAuth = () => {
    window.location.href = 'http://localhost:3001/auth/github';
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 50,
          background: scrolled
            ? theme === 'dark'
              ? 'rgba(7,8,15,0.85)'
              : 'rgba(242,244,251,0.9)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <div className="nav-container">
          {/* LOGO */}
          <div
            className="logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="logo-box">P</div>
            Prodexa
          </div>

          {/* DESKTOP MENU */}
          <div className="nav-right">
            <div className="nav-links">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <button className="cta" onClick={handleGitHubAuth}>
              <GitBranch size={16} />
              Sign in
            </button>

            <button className="theme-btn" onClick={onThemeToggle}>
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="menu-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </button>
          ))}

          <button className="cta" onClick={handleGitHubAuth}>
            <GitBranch size={18} />
            Sign in with GitHub
          </button>
        </div>
      )}

      {/* STYLES */}
      <style jsx>{`
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 1.4rem;
          cursor: pointer;
        }

        .logo-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent), var(--purple));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
        }

        .nav-links button {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.95rem;
        }

        .nav-links button:hover {
          color: var(--accent);
        }

        .cta {
          background: var(--accent);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .theme-btn {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .menu-btn {
          display: none;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          width: 40px;
          height: 40px;
        }

        .mobile-menu {
          position: fixed;
          inset: 0;
          background: var(--background);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          z-index: 60;
        }

        .mobile-menu button {
          font-size: 1.2rem;
          background: none;
          border: none;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }

          .menu-btn {
            display: block;
          }
        }

        @media (max-width: 640px) {
          .cta {
            display: none;
          }
        }
      `}</style>
    </>
  );
}