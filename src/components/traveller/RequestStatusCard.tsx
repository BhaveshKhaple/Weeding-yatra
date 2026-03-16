import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { JoinRequestWithListing } from '../../lib/types'

interface RequestStatusCardProps {
  request: JoinRequestWithListing
  index: number
}

// Relative time formatting helper
function getRelativeTimeString(date: string | Date): string {
  const timeMs = typeof date === "number" ? date : new Date(date).getTime()
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity]
  const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"]
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds))
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
}

export function RequestStatusCard({ request, index }: RequestStatusCardProps) {
  const listing = request.wedding_listings

  const isPending = request.status === 'pending'
  const isApproved = request.status === 'approved'
  const isDeclined = request.status === 'declined'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="bg-charcoal/50 border border-white/5 hover:border-white/15 transition-all rounded-2xl p-6 flex flex-col gap-4 shadow-xl shadow-black/20"
    >
      {/* Header: Names & Status */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-display text-2xl text-ivory">
            {listing.bride_name} & {listing.groom_name}
          </h3>
          <p className="text-ivory/60 font-sans text-sm flex items-center gap-2 mt-1">
            <span>📍 {listing.city}</span>
            <span>•</span>
            <span>🗓️ {new Date(listing.wedding_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
          </p>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
          isPending ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
          isApproved ? 'bg-green-500/10 text-green-500 border-green-500/20' :
          'bg-rose/10 text-rose border-rose/20'
        }`}>
          {isPending && '⏳ Pending'}
          {isApproved && '✅ Approved'}
          {isDeclined && '❌ Declined'}
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 mt-2">
        <p className="text-ivory/80 font-sans text-sm italic line-clamp-2">"{request.message}"</p>
        <p className="text-ivory/40 text-xs mt-2 uppercase tracking-wider font-semibold">
          {request.guest_count} Guest{request.guest_count > 1 ? 's' : ''} • Requested {getRelativeTimeString(request.submitted_at)}
        </p>
      </div>

      {isDeclined && request.decline_reason && (
        <div className="bg-rose/5 border-l-2 border-rose p-3 rounded-r-lg">
          <p className="text-rose/80 text-sm font-sans flex items-center gap-2">
            <span className="text-lg">💬</span> {request.decline_reason}
          </p>
        </div>
      )}

      {/* Action / Link */}
      <div className="mt-auto pt-4 border-t border-white/5 flex justify-end">
        <Link 
          to={`/weddings/${listing.slug}`}
          className="text-ivory/50 hover:text-turmeric text-sm font-medium transition-colors flex items-center gap-1"
        >
          View Wedding <span>→</span>
        </Link>
      </div>
    </motion.div>
  )
}
