import { NavLink } from 'react-router-dom';
import './Footer.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/domains', label: 'Domain Events' },
  { to: '/flagships', label: 'Flagships' },
  { to: '/domain-activity', label: 'Domain Activities' },
  { to: '/gallery', label: 'Gallery' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-divider" />
      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <h2 className="footer-title font-hero">PRAESENTATIO</h2>
          <p className="footer-tagline text-caption">
            One of the first domains of Aaruush · SRMIST · Est. 2007
          </p>
        </div>

        {/* Nav */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <p className="footer-nav-label text-caption">Navigate</p>
          <ul className="footer-nav-list">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} className="footer-nav-link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social placeholders */}
        <div className="footer-social">
          <p className="footer-nav-label text-caption">Connect</p>
          <div className="footer-social-links">
            {/* Replace href="#" with real social links */}
            <a href="#" className="footer-social-link" aria-label="Instagram">Instagram</a>
            <a href="#" className="footer-social-link" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" className="footer-social-link" aria-label="Twitter / X">X</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-statement font-display">
            Express. Create. Perform.
          </p>
          <p className="footer-copy text-caption">
            © {new Date().getFullYear()} Praesentatio · Aaruush · SRMIST
          </p>
        </div>
      </div>
    </footer>
  );
}
