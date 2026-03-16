/**
 * HeroSection — The immersive full-viewport hero for the wedding detail page.
 * Uses Framer Motion `useScroll` + `useTransform` for parallax and fade.
 * The cover photo scrolls up behind the text, giving a cinematic parallax feel.
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { WeddingListing } from '../../lib/types'

interface Props {
  listing: WeddingListing
}

export function HeroSection({ listing }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Parallax: cover image moves up as you scroll
  const imageY     = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  // Fade + lift: title fades and rises as you scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY       = useTransform(scrollYProgress, [0, 0.5], ['0%', '-20%'])

  const dateObj = listing.wedding_date
    ? new Date(listing.wedding_date + 'T00:00:00')
    : null

  const formattedDate = dateObj?.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) ?? ''

  return (
    <div ref={ref} className="relative w-full h-screen overflow-hidden flex items-center justify-center">

      {/* Parallax cover photo background */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        {listing.cover_photo_url ? (
          <img
            src={listing.cover_photo_url}
            alt={`${listing.bride_name} & ${listing.groom_name} wedding`}
            className="w-full h-full object-cover"
          />
        ) : (
          // Gradient fallback if no cover photo
          <div className="w-full h-full bg-gradient-to-br from-deepraisin via-charcoal to-saffron/40" />
        )}

        {/* Rich overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/20" />
      </motion.div>

      {/* Hero text content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
      >
        {/* Decorative motif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="text-5xl mb-6"
        >
          🪷
        </motion.div>

        {/* Names */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
          className="font-display text-6xl md:text-8xl text-ivory leading-tight mb-4"
        >
          {listing.bride_name}
          <span className="text-saffron mx-4 md:mx-6">&</span>
          {listing.groom_name}
        </motion.h1>

        {/* Date + Location */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-sans text-ivory/70 text-lg md:text-xl tracking-wide"
        >
          {formattedDate} · {listing.city}
        </motion.p>

        {/* Venue */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-sans text-saffron text-base mt-2 font-medium"
        >
          📍 {listing.venue_name}
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="font-sans text-ivory/30 text-xs uppercase tracking-widest">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-ivory/40 to-transparent"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
