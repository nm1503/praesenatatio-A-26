import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/domains', label: 'Domain Events' },
  { to: '/flagships', label: 'Flagships' },
  { to: '/domain-activity', label: 'Domain Activities' },
  { to: '/gallery', label: 'Gallery' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Detect scroll to switch navbar style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo" aria-label="Praesentatio Home">
          <img
            src="/images/logo.png"
            alt="Praesentatio logo"
            className="navbar-logo-img"
          />
          <div className="navbar-logo-text">
            <span className="navbar-logo-main">PRAESENTATIO</span>
            <span className="navbar-logo-sub">Aaruush · SRMIST</span>
          </div>
        </NavLink>

        {/* Desktop links */}
        <ul className="navbar-links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'navbar-link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className={`navbar-hamburger ${menuOpen ? 'navbar-hamburger--open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Aaruush Logo — top right */}
        <a
          href="https://www.aaruush.org"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-aaruush-logo"
          aria-label="Aaruush website"
        >
          <img
            src="/images/aaruush-logo.png"
            alt="Aaruush logo"
            className="navbar-aaruush-img"
          />
        </a>
      </nav>

      {/* Mobile full-screen overlay menu */}
      <div
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
        ref={menuRef}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-bg" />
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `mobile-menu-link ${isActive ? 'mobile-menu-link--active' : ''}`
              }
              style={{ animationDelay: `${0.05 + i * 0.07}s` }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="mobile-menu-num">0{i + 1}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mobile-menu-footer">
          <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
            Express · Create · Perform
          </p>
        </div>
      </div>
    </>
  );
}
