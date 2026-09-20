import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal } from '../hooks/useReveal';
import CenterSpiral from '../components/CenterSpiral';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

// Domain showcase data
const coreAreas = [
  {
    id: 'dramatics',
    label: '01',
    name: 'DRAMATICS',
    tagline: 'Where silence becomes spectacle.',
    desc: 'Performance, acting, theatrical storytelling — emotion given form and voice.',
    color: '#c0392b',
  },
  {
    id: 'literature',
    label: '02',
    name: 'LITERATURE',
    tagline: 'Every word a world.',
    desc: 'Poetry, prose and the art of choosing words that outlast the moment.',
    color: '#2e8b57',
  },
  {
    id: 'oration',
    label: '03',
    name: 'ORATION',
    tagline: 'Ideas that demand to be heard.',
    desc: 'Debate, persuasion, rhetoric — the power to make an audience listen.',
    color: '#1a5fa8',
  },
];

export default function Home() {
  useReveal();
  const heroRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLElement>(null);

  // Subtle parallax on hero text based on mouse
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      hero.style.transform = `translate(${dx * -8}px, ${dy * -6}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Ref to track drum card rotation function
  const rotateToCardRef = useRef<((idx: number) => void) | null>(null);
  // Ref to track if user dragged
  const hasDraggedRef = useRef(false);

  // 3D drum rotation driven by vertical scroll + horizontal drag & horizontal wheel
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const drum = drumRef.current;
    const section = coreRef.current;
    if (!drum || !section) return;

    const stage = drum.parentElement;
    if (!stage) return;

    let baseRotation = 0;
    let dragOffset = 0;
    let isDragging = false;
    let startX = 0;
    let dragStartOffset = 0;
    let activePointerId: number | null = null;

    const updateRotation = (duration = isDragging ? 0.1 : 0.4) => {
      const targetRotateY = baseRotation + dragOffset;

      const updateSpiralVisibility = () => {
        const currentY = (gsap.getProperty(drum, 'rotateY') as number) || 0;
        const R = Math.abs(((currentY % 120) + 120) % 120);
        const angleFromCard = R > 60 ? 120 - R : R;
        // angleFromCard = 0° when card is dead front, 60° when gap is dead front.
        // Slowly reveal helix as card moves away (opacity 0 at 8° up to 1 at 36°)
        const opacity = Math.min(1, Math.max(0, (angleFromCard - 8) / 28));

        const spiral = stage.querySelector('.center-spiral') as HTMLElement | null;
        if (spiral) {
          spiral.style.opacity = opacity.toFixed(3);
          spiral.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible';
        }
      };

      gsap.to(drum, {
        rotateY: targetRotateY,
        duration,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: updateSpiralVisibility,
      });

      updateSpiralVisibility();
    };

    // Smoothly rotate clicked card index to the front
    const handleCardClick = (cardIdx: number) => {
      const currentRotateY = (gsap.getProperty(drum, 'rotateY') as number) || 0;
      const targetBase = -cardIdx * 120;
      let diff = (targetBase - currentRotateY) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const targetAngle = currentRotateY + diff;

      dragOffset = targetAngle - baseRotation;
      updateRotation(0.8);
    };

    rotateToCardRef.current = handleCardClick;

    // 1. Vertical scroll drives rotation
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      onUpdate: (self) => {
        baseRotation = -self.progress * 360;
        updateRotation();
      },
    });

    // 2. Horizontal wheel scroll (trackpad / shift+wheel)
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > 0) {
        e.preventDefault();
        dragOffset -= e.deltaX * 0.6;
        updateRotation();
      }
    };

    // 3. Pointer drag & touch swipe (mouse + touch)
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      hasDraggedRef.current = false;
      startX = e.clientX;
      dragStartOffset = dragOffset;
      activePointerId = e.pointerId;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) {
        hasDraggedRef.current = true;
        if (stage && activePointerId !== null) {
          try {
            stage.setPointerCapture(activePointerId);
          } catch (_) {}
        }
        stage.style.cursor = 'grabbing';
      }
      if (hasDraggedRef.current) {
        dragOffset = dragStartOffset + dx * 0.6;
        updateRotation();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      stage.style.cursor = 'grab';
      if (activePointerId !== null) {
        try {
          stage.releasePointerCapture(activePointerId);
        } catch (_) {}
        activePointerId = null;
      }

      // If user clicked (without dragging), search all DOM layers under cursor
      if (!hasDraggedRef.current) {
        const hitElements = document.elementsFromPoint
          ? document.elementsFromPoint(e.clientX, e.clientY)
          : [document.elementFromPoint(e.clientX, e.clientY)];

        for (const el of hitElements) {
          if (!el) continue;
          const panel = el.closest('.core-area-panel') as HTMLElement | null;
          if (panel) {
            const domainId = panel.getAttribute('data-domain');
            const cardIdx = coreAreas.findIndex((a) => a.id === domainId);
            if (cardIdx !== -1) {
              handleCardClick(cardIdx);
              break;
            }
          }
        }
      }
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);

    return () => {
      st.kill();
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerup', onPointerUp);
      stage.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  return (
    <div className="home page-wrapper">

      {/* ============================
          HERO
          ============================ */}
      <section className="hero" aria-label="Hero">
        {/* Background ambient glow */}
        <div className="hero-glow" aria-hidden="true" />

        <div className="container hero-inner">
          <div className="hero-text" ref={heroRef}>
            {/* Eyebrow */}
            <p className="hero-eyebrow text-caption">
              <img
                src="/images/logo.png"
                alt="Praesentatio logo"
                className="hero-logo-img"
              />
              Aaruush · SRMIST · Est. 2007
            </p>

            {/* Main title — split for animation */}
            <h1 className="hero-title text-massive font-hero">
              <span className="hero-title-line">PRAESEN</span>
              <span className="hero-title-line hero-title-line--accent">TATIO</span>
            </h1>

            <p className="hero-subtitle font-display">
              The art of presenting yourself.
            </p>

            <p className="hero-body text-body">
              A space where expression takes the stage — through performance,
              words and the power of the spoken idea.
            </p>

            <div className="hero-actions">
              <Link to="/domains" className="btn btn-solid">
                Explore Domain Events <ArrowRight size={16} />
              </Link>
              <Link to="/flagships" className="btn btn-outline">
                Our Flagships
              </Link>
            </div>
          </div>

          {/* Year badge */}
          <div className="hero-badge" aria-hidden="true">
            <span className="hero-badge-year">2007</span>
            <span className="hero-badge-label text-caption">Est.</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-hint" aria-hidden="true">
          <span className="text-caption">Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* ============================
          ABOUT
          ============================ */}
      <section className="about section" aria-labelledby="about-heading">
        <div className="container about-inner">
          <div className="about-left reveal-left">
            <p className="text-caption text-gold">About Praesentatio</p>
            <div className="divider" style={{ margin: '20px 0 40px' }} />
            <p className="about-stat">
              <span className="about-stat-num font-hero">17+</span>
              <span className="about-stat-label text-caption">Years of expression</span>
            </p>
            <p className="about-stat">
              <span className="about-stat-num font-hero">3</span>
              <span className="about-stat-label text-caption">Core domains</span>
            </p>
            <p className="about-stat">
              <span className="about-stat-num font-hero">2</span>
              <span className="about-stat-label text-caption">Flagship events</span>
            </p>
          </div>

          <div className="about-right">
            <h2 id="about-heading" className="about-heading text-display font-display reveal">
              One of Aaruush's first.<br />
              <em>Still its most expressive.</em>
            </h2>

            <div className="about-body stagger">
              <p className="text-body">
                Praesentatio was born in 2007 as one of the very first domains of Aaruush.
                Its premise was simple, and radical: <strong>how you present yourself matters</strong>.
                Not just in debate halls or boardrooms — but on stage, on the page and in every
                space where a human being dares to be seen and heard.
              </p>
              <p className="text-body">
                Over seventeen years, Praesentatio has become a living stage for students who
                believe they have something worth expressing. It does not dictate the form.
                It only demands that you find your own.
              </p>
              <blockquote className="about-quote font-display">
                "Praesentatio is not about one way of speaking.
                <br />It is about finding your own way to be heard."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          THREE CORE AREAS — 3D revolving drum
          ============================ */}
      <section className="core-areas section" ref={coreRef} aria-labelledby="core-areas-heading">
        <div className="container">
          <p id="core-areas-heading" className="text-caption text-gold reveal" style={{ marginBottom: 24 }}>
            Three ways to express
          </p>
        </div>

        {/* 3D stage with perspective */}
        <div className="core-areas-stage">
          {/* The drum — GSAP rotates this around Y axis */}
          <div className="core-areas-drum" ref={drumRef}>
            {coreAreas.map((area, idx) => (
              <article
                key={area.id}
                className="core-area-panel"
                data-domain={area.id}
                onClick={() => {
                  if (!hasDraggedRef.current && rotateToCardRef.current) {
                    rotateToCardRef.current(idx);
                  }
                }}
                style={{
                  '--domain-color': area.color,
                  transform: `rotateY(${idx * 120}deg) translateZ(var(--drum-radius))`,
                } as React.CSSProperties}
              >
                <div className="core-area-content">
                  <h3 className="core-area-name font-hero">{area.name}</h3>
                  <p className="core-area-tagline font-display">{area.tagline}</p>
                  <p className="core-area-desc text-body">{area.desc}</p>
                </div>
                <div className="core-area-accent" />
                <span className="core-area-bg-letter font-hero" aria-hidden="true">
                  {area.name[0]}
                </span>
              </article>
            ))}
          </div>

          {/* Center spiral — the axis pole the panels revolve around */}
          <CenterSpiral sectionRef={coreRef} drumRef={drumRef} />
        </div>

        <div className="container" style={{ marginTop: 48 }}>
          <Link to="/domains" className="btn btn-outline reveal">
            Explore All Domain Events <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ============================
          FLAGSHIPS TEASER
          ============================ */}
      <section className="flagships-teaser section" aria-labelledby="flagships-heading">
        <div className="container flagships-teaser-inner">
          <div className="reveal">
            <p className="text-caption text-gold" style={{ marginBottom: 16 }}>Flagship Events</p>
            <h2 id="flagships-heading" className="text-display font-display" style={{ marginBottom: 32 }}>
              Where ideas<br /><em>become events.</em>
            </h2>
          </div>

          <div className="flagship-teaser-cards stagger">
            <Link to="/flagships" className="flagship-teaser-card">
              <span className="flagship-teaser-tag text-caption">Digital Diplomacy</span>
              <h3 className="flagship-teaser-name font-hero">NX-GEN FORUM</h3>
              <p className="text-body">A modern UN simulation for the digital age.</p>
              <span className="flagship-teaser-year text-caption">Aaruush'25</span>
            </Link>
            <Link to="/flagships" className="flagship-teaser-card flagship-teaser-card--gold">
              <span className="flagship-teaser-tag text-caption">Multi-Round Creative</span>
              <h3 className="flagship-teaser-name font-hero">SPOTLIGHT</h3>
              <p className="text-body">Storytelling, scripts, acting — across rounds.</p>
              <span className="flagship-teaser-year text-caption">Spotlight 2.0</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================
          CLOSING STATEMENT
          ============================ */}
      <section className="home-closing section--full section" aria-hidden="true">
        <div className="container">
          <p className="home-closing-text text-hero font-display reveal glow-gold">
            Express.<br /><em>Create.</em><br />Perform.
          </p>
        </div>
      </section>
    </div>
  );
}
