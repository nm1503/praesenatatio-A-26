import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';
import { galleryImages } from '../data/galleryData';
import Lightbox from '../components/Lightbox';
import Footer from '../components/Footer';
import './GalleryPage.css';

export default function GalleryPage() {
  useReveal();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = galleryImages;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const lightboxImages = filtered;

  return (
    <div className="gallery-page page-wrapper">

      {/* Page Header */}
      <section className="page-header section" aria-labelledby="gallery-page-heading">
        <div className="container">
          <p className="text-caption text-gold reveal" style={{ marginBottom: 16 }}>
            Visual archive
          </p>
          <h1
            id="gallery-page-heading"
            className="text-hero font-hero reveal"
          >
            GALLERY
          </h1>
          <p
            className="text-subtitle font-display reveal"
            style={{ color: 'var(--text-secondary)', maxWidth: 600, marginTop: 24 }}
          >
            Moments from Praesentatio — performance, expression and the human beings
            brave enough to be seen.
          </p>
        </div>
      </section>



      {/* Masonry Gallery Grid */}
      <section className="gallery-section section" aria-label="Gallery images">
        <div className="container">
          <div className="gallery-masonry" role="list">
            {filtered.map((image, index) => (
              <article
                key={image.id}
                className={`gallery-item gallery-item--${image.orientation} reveal`}
                role="listitem"
                style={{ animationDelay: `${(index % 6) * 0.07}s` }}
              >
                <button
                  className="gallery-item-inner"
                  onClick={() => openLightbox(index)}
                  aria-label={`Open image: ${image.alt}`}
                >
                  {/* Real image */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="gallery-img"
                    loading="lazy"
                    onError={(e) => {
                      // Hide broken image, show placeholder
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />

                  {/* Placeholder (shown when image missing) */}
                  <div className="gallery-placeholder img-placeholder">
                    <div className="gallery-placeholder-inner">
                      <span className="text-caption">{image.category}</span>
                    </div>
                  </div>

                  {/* Hover overlay — expand icon only */}
                  <div className="gallery-overlay">
                    <span className="gallery-overlay-icon">↗</span>
                  </div>
                </button>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="gallery-empty">
              <p className="text-body text-muted">No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
