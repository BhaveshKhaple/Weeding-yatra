/**
 * PublicGallery — Responsive masonry-style photo grid for the public wedding page.
 * Each photo fades + scales in as it enters the viewport via Framer Motion viewport animation.
 */

import { motion } from 'framer-motion'
import type { GalleryPhoto } from '../../lib/types'

interface Props {
  photos: GalleryPhoto[]
}

export function PublicGallery({ photos }: Props) {
  if (photos.length === 0) return null

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="font-display text-4xl md:text-5xl text-ivory mb-16 text-center"
      >
        Wedding <span className="text-saffron">Gallery</span>
      </motion.h2>

      {/* Responsive masonry-style CSS grid */}
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: (i % 6) * 0.07, ease: 'easeOut' }}
            className="break-inside-avoid group relative overflow-hidden rounded-2xl border border-white/5 mb-4"
          >
            <img
              src={photo.public_url}
              alt={`Gallery photo ${i + 1}`}
              loading="lazy"
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover luminosity overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
