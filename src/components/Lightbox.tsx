import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImage } from '../data/galleryData';
import './Lightbox.css';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, currentIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(currentIndex);
  const [direction, setDirection] = useState(0);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, goNext, goPrev]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const img = images[index];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      transition: { duration: 0.25, ease: [0.87, 0, 0.13, 1] as [number, number, number, number] },
    }),
  };

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      <div className="lightbox-counter text-caption">
        {index + 1} / {images.length}
      </div>

      {/* Main image area */}
      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="lightbox-image-wrap"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="lightbox-image"
              onError={(e) => {
                // Placeholder fallback
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="lightbox-placeholder">
              <span className="text-caption">{img.category || 'Praesentatio'}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <button
        className="lightbox-nav lightbox-nav--prev"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="lightbox-nav lightbox-nav--next"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      {/* Caption */}
      <div className="lightbox-caption" onClick={(e) => e.stopPropagation()}>
        {img.category && (
          <span className="lightbox-category text-caption">{img.category}</span>
        )}
        <p className="lightbox-alt">{img.alt}</p>
      </div>
    </motion.div>
  );
}
