// DomainActivity page
import { useReveal } from '../hooks/useReveal';
import { useCountUp } from '../hooks/useCountUp';
import { domainActivities } from '../data/eventsData';
import Footer from '../components/Footer';
import './DomainActivity.css';

// Individual stat counter card
function StatCard({
  value,
  label,
  sublabel,
  color,
  delay = 0,
}: {
  value: number;
  label: string;
  sublabel?: string;
  color: string;
  delay?: number;
}) {
  const { count, ref } = useCountUp(value, 1800);

  return (
    <div
      className="stat-card"
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ '--stat-color': color, animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      <span className="stat-card-label text-caption">{label}</span>
      <span className="stat-card-value font-hero" style={{ color }}>
        {count}
      </span>
      {sublabel && (
        <span className="stat-card-sublabel text-caption">{sublabel}</span>
      )}
    </div>
  );
}

// Fandom constellation dots
function FandomConstellation({ count }: { count: number }) {
  const angles = Array.from({ length: count }, (_, i) => (i / count) * 360);
  return (
    <div className="fandom-constellation" aria-label={`${count} fandoms`}>
      <div className="fandom-center">
        <span className="fandom-center-num font-hero">5</span>
        <span className="text-caption fandom-center-label">Fandoms</span>
      </div>
      {angles.map((angle, i) => (
        <div
          key={i}
          className="fandom-dot"
          style={{
            '--angle': `${angle}deg`,
            animationDelay: `${i * 0.15}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function DomainActivity() {
  useReveal();

  return (
    <div className="domain-activity-page page-wrapper">

      {/* Page Header */}
      <section className="page-header section" aria-labelledby="activity-page-heading">
        <div className="container">
          <p className="text-caption text-gold reveal" style={{ marginBottom: 16 }}>
            Beyond the flagship
          </p>
          <h1
            id="activity-page-heading"
            className="text-hero font-hero reveal"
          >
            DOMAIN ACTIVITY
          </h1>
          <p className="text-subtitle font-display reveal" style={{ color: 'var(--text-secondary)', maxWidth: 640, marginTop: 24 }}>
            Beyond its flagship events, Praesentatio creates domain activities that
            encourage participation, creativity and community engagement.
          </p>
        </div>
      </section>

      {/* Fandom Forge */}
      {domainActivities.map((activity) => (
        <section
          key={activity.id}
          id={activity.id}
          className="activity-section section"
          aria-labelledby={`${activity.id}-heading`}
          style={{ '--activity-color': activity.accentColor } as React.CSSProperties}
        >
          <div className="container">

            {/* Header */}
            <div className="activity-header">
              <div>
                <p className="text-caption reveal" style={{ color: activity.accentColor, marginBottom: 16 }}>
                  Domain Activity · {activity.introduced}
                </p>
                <h2
                  id={`${activity.id}-heading`}
                  className="activity-title font-hero reveal"
                >
                  {activity.name}
                </h2>
                <p className="activity-tagline font-display reveal">
                  {activity.tagline}
                </p>
                <p className="activity-desc text-body reveal">
                  {activity.description}
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="activity-stats-section">
              <p className="text-caption reveal" style={{ color: 'var(--text-muted)', marginBottom: 40 }}>
                Participation — 2025
              </p>

              <div className="activity-stats-grid">
                {/* Day progression */}
                <div className="day-progression">
                  {activity.stats.map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`day-stat ${stat.label === 'Total' ? 'day-stat--total' : ''}`}
                    >
                      <StatCard
                        value={stat.value}
                        label={stat.label}
                        sublabel={stat.sublabel}
                        color={stat.label === 'Total' ? activity.accentColor : 'var(--text-primary)'}
                        delay={i * 100}
                      />
                      {/* Connect arrow between days */}
                      {i < activity.stats.length - 2 && (
                        <div className="day-arrow" aria-hidden="true">
                          <div className="day-arrow-line" />
                          <div className="day-arrow-head" />
                        </div>
                      )}
                      {/* Separator before total */}
                      {i === activity.stats.length - 2 && (
                        <div className="day-total-sep" aria-hidden="true">
                          <div className="day-total-sep-line" />
                          <span className="text-caption day-total-sep-label">Total</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Fandom constellation */}
                <div className="fandom-section reveal">
                  <FandomConstellation count={5} />
                </div>
              </div>

              {/* Highlight pills */}
              <div className="activity-highlights stagger">
                {activity.highlights.map((h) => (
                  <div key={h.label} className="highlight-pill">
                    <span
                      className="highlight-pill-value font-hero"
                      style={{ color: activity.accentColor }}
                    >
                      {h.value}
                    </span>
                    <span className="highlight-pill-label text-caption">
                      {h.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Large bg text */}
          <div className="activity-bg-title font-hero" aria-hidden="true">
            {activity.name.split(' ')[0]}
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
