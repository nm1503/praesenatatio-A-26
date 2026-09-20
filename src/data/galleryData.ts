// ============================================================
// DATA: Gallery Images
// To replace images: update the `src` path for each entry.
// All images should be placed in /public/images/gallery/
// To add more images, add new entries following the same format.
// ============================================================

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  orientation: 'landscape' | 'portrait' | 'square';
  category?: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: '/images/gallery/img1.jpg',
    alt: 'Praesentatio team at Aaruush — event coordinators post-event',
    orientation: 'landscape',
    category: 'General',
  },
  {
    id: 2,
    src: '/images/gallery/img2.jpg',
    alt: 'NX-Gen Forum — Praesentatio team and participants at Aaruush\'25',
    orientation: 'landscape',
    category: 'NX-Gen Forum',
  },
  {
    id: 3,
    src: '/images/gallery/img3.jpg',
    alt: 'Spotlight 2.0 — event host presenting at the podium',
    orientation: 'portrait',
    category: 'Spotlight',
  },
  {
    id: 4,
    src: '/images/gallery/img4.jpg',
    alt: 'Praesentatio participants group photo at SRMIST campus',
    orientation: 'landscape',
    category: 'General',
  },
];

// Gallery filter categories (derived from data, add more as needed)
export const galleryCategories = [
  'All',
  ...Array.from(new Set(galleryImages.map((img) => img.category).filter(Boolean))),
] as string[];
