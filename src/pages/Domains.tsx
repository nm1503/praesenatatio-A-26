import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { domains } from '../data/domainsData';
import Footer from '../components/Footer';
import './Domains.css';

export default function Domains() {
  useReveal();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="domains-page page-wrapper">

      {/* Page Header */}
      <section className="page-header section" aria-labelledby="domains-page-heading">
        <div className="container">
          <p className="text-caption text-gold reveal" style={{ marginBottom: 16 }}>
            The three pillars
          </p>
          <h1
            id="domains-page-heading"
            className="text-hero font-hero reveal"
            style={{ animationDelay: '0.1s' }}
          >
            DOMAINS
          </h1>
          <p className="text-subtitle font-display reveal" style={{ color: 'var(--text-secondary)', maxWidth: 600, marginTop: 24 }}>
            Praesentatio enables expression through three distinct — and deliberately different — forms.
          </p>
        </div>
      </section>

      {/* Domains List */}
      <section className="domains-list" aria-label="Praesentatio domains">
        {domains.map((domain, index) => (
          <article
            key={domain.id}
            className={`domain-section ${index % 2 === 1 ? 'domain-section--reverse' : ''}`}
            data-domain={domain.id}
            onMouseEnter={() => setHoveredId(domain.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              '--domain-color': domain.color,
              opacity: hoveredId && hoveredId !== domain.id ? 0.5 : 1,
              transition: 'opacity 0.4s var(--ease-smooth)',
            } as React.CSSProperties}
          >
            {/* Number + Name column */}
            <div className="domain-identity">
              <span className="domain-index text-caption">
                0{index + 1}
              </span>
              <h2 className="domain-name font-hero reveal">
                {domain.name}
              </h2>
              <div className="domain-keywords">
                {domain.keywords.map((kw) => (
                  <span key={kw} className="domain-keyword text-caption">{kw}</span>
                ))}
              </div>
            </div>

            {/* Content column */}
            <div className="domain-body">
              <p className="domain-tagline font-display reveal">
                {domain.tagline}
              </p>
              <p className="domain-desc text-body reveal">
                {domain.description}
              </p>
            </div>

            {/* Visual placeholder */}
            <div className="domain-visual img-placeholder reveal">
              <div className="domain-visual-inner">
                <span className="domain-visual-letter font-hero">
                  {domain.name[0]}
                </span>
                <span className="text-caption domain-visual-label">
                  {domain.name}
                </span>
              </div>
            </div>

            {/* Color accent strip */}
            <div className="domain-color-strip" />
          </article>
        ))}
      </section>

      {/* Closing */}
      <section className="domains-closing section" aria-hidden="true">
        <div className="container">
          <blockquote className="domains-closing-quote font-display reveal">
            "Find your domain.<br />
            <em>Own your expression.</em>"
          </blockquote>
        </div>
      </section>

      <Footer />
    </div>
  );
}
