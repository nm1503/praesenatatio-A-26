import { useReveal } from '../hooks/useReveal';
import { flagshipEvents } from '../data/eventsData';
import Footer from '../components/Footer';
import './Flagships.css';

export default function Flagships() {
  useReveal();

  return (
    <div className="flagships-page page-wrapper">

      {/* Page Header */}
      <section className="page-header section" aria-labelledby="flagships-page-heading">
        <div className="container">
          <p className="text-caption text-gold reveal" style={{ marginBottom: 16 }}>
            Flagship events
          </p>
          <h1
            id="flagships-page-heading"
            className="text-hero font-hero reveal"
          >
            FLAGSHIPS
          </h1>
          <p className="text-subtitle font-display reveal" style={{ color: 'var(--text-secondary)', maxWidth: 600, marginTop: 24 }}>
            The events that define what Praesentatio can become — and what its participants can be.
          </p>
        </div>
      </section>

      {/* Events */}
      {flagshipEvents.map((event, index) => (
        <section
          key={event.id}
          id={event.id}
          className={`flagship-event ${index % 2 === 1 ? 'flagship-event--alt' : ''}`}
          aria-labelledby={`${event.id}-heading`}
          style={{ '--event-color': event.accentColor } as React.CSSProperties}
        >
          <div className="container flagship-event-inner">

            {/* Left: text content */}
            <div className="flagship-event-content">
              {/* Tag */}
              <p className="text-caption reveal" style={{ color: event.accentColor, marginBottom: 20 }}>
                {event.type === 'flagship' ? 'Flagship Event' : 'Domain Activity'}
              </p>

              {/* Title */}
              <h2
                id={`${event.id}-heading`}
                className="flagship-event-title font-hero reveal"
              >
                {event.name}
              </h2>

              {/* Tagline */}
              <p className="flagship-event-tagline font-display reveal">
                {event.tagline}
              </p>

              {/* Description */}
              <p className="flagship-event-desc text-body reveal">
                {event.description}
              </p>

              {/* Emphasis tags */}
              <div className="flagship-emphasis-tags stagger">
                {event.emphasis.map((tag) => (
                  <span
                    key={tag}
                    className="flagship-emphasis-tag text-caption"
                    style={{ borderColor: `${event.accentColor}40`, color: event.accentColor }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Timeline */}
            <div className="flagship-event-timeline">
              <p className="text-caption reveal" style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
                Timeline
              </p>
              <div className="timeline-entries stagger">
                {event.timeline.map((entry) => (
                  <div key={entry.year} className="timeline-entry">
                    <div
                      className="timeline-node"
                      style={{ background: event.accentColor }}
                    />
                    <div className="timeline-line" />
                    <div className="timeline-content">
                      <span
                        className="timeline-year font-hero"
                        style={{ color: event.accentColor }}
                      >
                        {entry.year}
                      </span>
                      <span className="timeline-label text-body">
                        {entry.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Version badge (if applicable) */}
              {event.version && (
                <div
                  className="flagship-version-badge reveal"
                  style={{ borderColor: `${event.accentColor}40` }}
                >
                  <span className="text-caption" style={{ color: event.accentColor }}>
                    Current
                  </span>
                  <span className="flagship-version-name font-hero">
                    {event.version}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Giant bg title */}
          <div className="flagship-event-bg-title font-hero" aria-hidden="true">
            {event.name.split(' ')[0]}
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
