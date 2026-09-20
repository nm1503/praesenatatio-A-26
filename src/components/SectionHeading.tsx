import './SectionHeading.css';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  accentColor?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  accentColor,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align} reveal`}>
      {eyebrow && (
        <p
          className="section-heading-eyebrow text-caption"
          style={accentColor ? { color: accentColor } : undefined}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="section-heading-title text-display font-display">{title}</h2>
      {subtitle && (
        <p className="section-heading-subtitle text-body text-muted">{subtitle}</p>
      )}
      <div
        className="section-heading-line"
        style={accentColor ? { background: accentColor } : undefined}
      />
    </div>
  );
}
