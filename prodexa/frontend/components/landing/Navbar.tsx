'use client';

import {
  useState,
  useEffect,
} from 'react';

import {
  GitBranch,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';

import {
  useTheme,
} from '@/contexts/ThemeContext';

import {
  isAuthenticated,
} from '@/lib/api';

interface NavbarProps {

  onThemeToggle: () => void;
}

export function Navbar({

  onThemeToggle,

}: NavbarProps) {

  const { theme } =
    useTheme();

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const authenticated =
    isAuthenticated();

  useEffect(() => {

    const handleScroll =
      () => {

        setScrolled(
          window.scrollY > 40,
        );
      };

    window.addEventListener(
      'scroll',
      handleScroll,
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll,
      );

  }, []);

  const navLinks = [

    {
      label: 'Features',
      id: 'features-section',
    },

    {
      label: 'How it Works',
      id: 'how-it-works',
    },

    {
      label: 'Tech Stack',
      id: 'tech-stack',
    },
  ];

  const handleNavClick =
    (id: string) => {

      const element =
        document.getElementById(id);

      if (element) {

        element.scrollIntoView({
          behavior: 'smooth',
        });

        setMobileMenuOpen(false);
      }
    };

  const handleAuthAction =
    () => {

      if (authenticated) {

        window.location.href =
          '/projects';

        return;
      }

      window.location.href =
        '/login';
    };

  return (

    <>

      {/* NAVBAR */}

      <nav
        style={{

          position: 'fixed',

          top: 0,

          left: 0,

          width: '100%',

          zIndex: 100,

          transition:
            'all 0.25s ease',

          background:
            scrolled
              ? theme === 'dark'
                ? 'rgba(7,8,15,0.82)'
                : 'rgba(248,249,252,0.88)'
              : 'transparent',

          backdropFilter:
            scrolled
              ? 'blur(18px)'
              : 'none',

          borderBottom:
            scrolled
              ? '1px solid var(--border)'
              : '1px solid transparent',
        }}
      >

        <div className="nav-container">

          {/* LEFT */}

          <div
            className="logo"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
          >

            <div className="logo-box">
              P
            </div>

            <span>
              Prodexa
            </span>

          </div>

          {/* DESKTOP NAV */}

          <div className="desktop-nav">

            <div className="nav-links">

              {navLinks.map(
                (link) => (

                  <button
                    key={link.id}
                    onClick={() =>
                      handleNavClick(
                        link.id,
                      )
                    }
                  >
                    {link.label}
                  </button>

                ),
              )}

            </div>

            <button
              className="cta-btn"
              onClick={
                handleAuthAction
              }
            >

              <GitBranch size={16} />

              <span>
                {
                  authenticated
                    ? 'Dashboard'
                    : 'Sign in'
                }
              </span>

            </button>

            <button
              className="theme-btn"
              onClick={
                onThemeToggle
              }
              aria-label="Toggle theme"
            >

              {theme === 'dark'
                ? (
                  <Moon size={16} />
                )
                : (
                  <Sun size={16} />
                )}

            </button>

          </div>

          {/* MOBILE ACTIONS */}

          <div className="mobile-actions">

            {/* THEME BUTTON */}

            <button
              className="theme-btn"
              onClick={
                onThemeToggle
              }
              aria-label="Toggle theme"
            >

              {theme === 'dark'
                ? (
                  <Moon size={16} />
                )
                : (
                  <Sun size={16} />
                )}

            </button>

            {/* MENU BUTTON */}

            <button
              className="menu-btn"
              onClick={() =>
                setMobileMenuOpen(
                  true,
                )
              }
              aria-label="Open menu"
            >

              <Menu size={20} />

            </button>

          </div>

        </div>

      </nav>

      {/* MOBILE MENU */}

      <div
        className={`mobile-menu ${mobileMenuOpen
          ? 'open'
          : ''
          }`}
      >

        {/* HEADER */}

        <div
          className="mobile-menu-header"
        >

          <div className="logo">

            <div className="logo-box">
              P
            </div>

            <span>
              Prodexa
            </span>

          </div>

          <button
            className="close-btn"
            onClick={() =>
              setMobileMenuOpen(
                false,
              )
            }
            aria-label="Close menu"
          >

            <X size={22} />

          </button>

        </div>

        {/* NAV LINKS */}

        <div
          className="mobile-nav-links"
        >

          {navLinks.map(
            (link) => (

              <button
                key={link.id}
                onClick={() =>
                  handleNavClick(
                    link.id,
                  )
                }
              >

                {link.label}

              </button>

            ),
          )}

        </div>

        {/* CTA */}

        <button
          className="mobile-cta"
          onClick={
            handleAuthAction
          }
        >

          <GitBranch size={18} />

          <span>
            {
              authenticated
                ? 'Open Dashboard'
                : 'Sign in with GitHub'
            }
          </span>

        </button>

      </div>

      {/* OVERLAY */}

      {mobileMenuOpen && (

        <div
          className="mobile-overlay"
          onClick={() =>
            setMobileMenuOpen(
              false,
            )
          }
        />

      )}

      {/* STYLES */}

      <style jsx>{`

        .nav-container {

          max-width: 1240px;

          margin: 0 auto;

          padding:
            0.9rem 1rem;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 1rem;
        }

        .logo {

          display: flex;

          align-items: center;

          gap: 0.7rem;

          font-weight: 800;

          font-size: 1.2rem;

          cursor: pointer;

          user-select: none;

          color:
            var(--text-primary);
        }

        .logo-box {

          width: 38px;

          height: 38px;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              var(--accent),
              var(--purple)
            );

          display: flex;

          align-items: center;

          justify-content: center;

          color: white;

          font-weight: 800;

          box-shadow:
            0 8px 20px
            var(--accent-glow);

          flex-shrink: 0;
        }

        .desktop-nav {

          display: flex;

          align-items: center;

          gap: 1rem;
        }

        .nav-links {

          display: flex;

          align-items: center;

          gap: 1.5rem;
        }

        .nav-links button {

          background: none;

          border: none;

          color:
            var(--text-secondary);

          font-size: 0.92rem;

          font-weight: 500;

          cursor: pointer;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .nav-links button:hover {

          color:
            var(--accent);

          transform:
            translateY(-1px);
        }

        .cta-btn {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 0.5rem;

          border: none;

          cursor: pointer;

          border-radius: 12px;

          padding:
            0.8rem 1.2rem;

          background:
            linear-gradient(
              135deg,
              var(--accent),
              var(--accent-bright)
            );

          color: white;

          font-size: 0.9rem;

          font-weight: 600;

          transition:
            all 0.2s ease;

          box-shadow:
            0 10px 24px
            var(--accent-glow);
        }

        .cta-btn:hover {

          transform:
            translateY(-2px);

          box-shadow:
            0 14px 30px
            var(--accent-glow);
        }

        .theme-btn,
        .menu-btn,
        .close-btn {

          width: 42px;

          height: 42px;

          border-radius: 12px;

          border:
            1px solid var(--border);

          background:
            var(--surface);

          color:
            var(--text-primary);

          display: flex;

          align-items: center;

          justify-content: center;

          cursor: pointer;

          transition:
            all 0.2s ease;

          flex-shrink: 0;
        }

        .theme-btn:hover,
        .menu-btn:hover,
        .close-btn:hover {

          transform:
            translateY(-2px);

          border-color:
            var(--accent);

          color:
            var(--accent);
        }

        .mobile-actions {

          display: none;

          align-items: center;

          gap: 0.7rem;
        }

        /* MOBILE MENU */

        .mobile-menu {

          position: fixed;

          top: 0;

          right: -100%;

          width: min(85vw, 360px);

          height: 100vh;

          background:
            var(--bg-card);

          border-left:
            1px solid var(--border);

          z-index: 120;

          padding: 1rem;

          display: flex;

          flex-direction: column;

          transition:
            right 0.3s ease;

          backdrop-filter:
            blur(20px);

          box-shadow:
            -10px 0 40px rgba(0,0,0,0.12);
        }

        .mobile-menu.open {

          right: 0;
        }

        .mobile-overlay {

          position: fixed;

          inset: 0;

          background:
            rgba(0,0,0,0.45);

          z-index: 110;

          backdrop-filter:
            blur(4px);
        }

        .mobile-menu-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 2.5rem;
        }

        .mobile-nav-links {

          display: flex;

          flex-direction: column;

          gap: 0.8rem;

          margin-bottom: auto;
        }

        .mobile-nav-links button {

          background:
            var(--surface);

          border:
            1px solid var(--border);

          border-radius: 14px;

          padding:
            1rem 1rem;

          text-align: left;

          font-size: 1rem;

          font-weight: 600;

          color:
            var(--text-primary);

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .mobile-nav-links button:hover {

          border-color:
            var(--accent);

          color:
            var(--accent);

          transform:
            translateX(4px);
        }

        .mobile-cta {

          margin-top: 2rem;

          width: 100%;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 0.6rem;

          border: none;

          border-radius: 14px;

          padding:
            1rem 1rem;

          background:
            linear-gradient(
              135deg,
              var(--accent),
              var(--accent-bright)
            );

          color: white;

          font-size: 0.95rem;

          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 12px 30px
            var(--accent-glow);
        }

        /* RESPONSIVE */

        @media (max-width: 1024px) {

          .desktop-nav {

            display: none;
          }

          .mobile-actions {

            display: flex;
          }
        }

        @media (max-width: 640px) {

          .nav-container {

            padding:
              0.85rem 0.9rem;
          }

          .logo {

            font-size: 1.05rem;
          }

          .logo-box {

            width: 34px;

            height: 34px;

            border-radius: 10px;
          }

          .mobile-menu {

            width: 100%;
          }
        }

      `}</style>

    </>
  );
}