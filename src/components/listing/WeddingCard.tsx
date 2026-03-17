import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { WeddingListing } from '../../lib/types'

interface WeddingCardProps {
  listing: WeddingListing
}

export function WeddingCard({ listing }: WeddingCardProps) {
  const formattedDate = new Date(listing.wedding_date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <motion.div
      layout
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      // Use LayoutGroup or AnimatePresence tracking via layoutId / key in parent
      className="relative rounded-2xl overflow-hidden shadow-lg group bg-charcoal/50 aspect-[4/5] flex flex-col justify-end isolate"
    >
      <Link to={`/weddings/${listing.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {listing.bride_name} & {listing.groom_name}'s wedding</span>
      </Link>

      {/* Background Image or Fallback Gradient */}
      {listing.cover_photo_url ? (
        <img
          src={listing.cover_photo_url}
          alt={`Cover photo for ${listing.bride_name} and ${listing.groom_name}'s wedding`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-saffron via-turmeric to-rose transition-transform duration-700 group-hover:scale-105" />
      )}

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 p-6 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2 mb-2">
          {/* Status Badge */}
          {listing.status === 'open' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 backdrop-blur-sm border border-green-500/30">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
              Open
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl md:text-3xl text-ivory leading-tight drop-shadow-md">
          {listing.bride_name} & {listing.groom_name}
        </h3>
        
        <div className="flex items-center text-ivory/80 text-sm font-sans gap-3">
          <span className="flex items-center gap-1">
            📍 {listing.city}
          </span>
          <span className="flex items-center gap-1">
            🗓️ {formattedDate}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
