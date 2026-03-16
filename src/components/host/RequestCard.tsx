import { motion } from 'framer-motion'
import { JoinRequestWithTraveller } from '../../lib/types'
import { formatDistanceToNow } from 'date-fns'

interface RequestCardProps {
  request: JoinRequestWithTraveller
  onApprove: (request: JoinRequestWithTraveller) => void
  onDecline: (request: JoinRequestWithTraveller) => void
  index: number
}

// Map some common country names to flags (MVP fallback)
function getFlagEmoji(nationality: string) {
  const map: Record<string, string> = {
    'US': '🇺🇸', 'USA': '🇺🇸', 'United States': '🇺🇸',
    'UK': '🇬🇧', 'United Kingdom': '🇬🇧',
    'Canada': '🇨🇦', 'CA': '🇨🇦',
    'Australia': '🇦🇺', 'AU': '🇦🇺',
    'Germany': '🇩🇪', 'DE': '🇩🇪',
    'France': '🇫🇷', 'FR': '🇫🇷',
    'Italy': '🇮🇹', 'IT': '🇮🇹',
    'Spain': '🇪🇸', 'ES': '🇪🇸',
    'Japan': '🇯🇵', 'JP': '🇯🇵',
  }
  return map[nationality] || '🌍'
}

export function RequestCard({ request, onApprove, onDecline, index }: RequestCardProps) {
  const profile = request.profiles
  const name = profile?.full_name || 'Anonymous Traveller'
  const initials = name.substring(0, 2).toUpperCase()
  const nationality = profile?.nationality || 'Unknown'
  const flag = getFlagEmoji(nationality)

  const dateStr = formatDistanceToNow(new Date(request.submitted_at), { addSuffix: true })

  const statusColors = {
    pending: 'bg-turmeric/20 text-turmeric border-turmeric/30',
    approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    declined: 'bg-rose/20 text-rose border-rose/30',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, scale: 0.95 }}
      transition={{ delay: index * 0.05, type: 'spring', damping: 22, stiffness: 300 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-saffron/20 text-saffron flex items-center justify-center font-display text-lg">
            {initials}
          </div>
          <div className="min-w-0">
            <h4 className="font-display text-lg text-ivory truncate">{name}</h4>
            <div className="flex items-center gap-1.5 text-xs text-ivory/60 font-sans">
              <span>{flag}</span>
              <span className="truncate">{nationality}</span>
            </div>
          </div>
        </div>
        
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]} capitalize whitespace-nowrap`}>
          {request.status}
        </div>
      </div>

      {/* Message Block */}
      {request.message && (
        <div className="bg-black/20 rounded-xl p-3 border border-white/5">
          <p className="font-sans text-sm text-ivory/70 italic line-clamp-3 leading-relaxed">
            "{request.message}"
          </p>
        </div>
      )}

      {/* Meta Row */}
      <div className="flex items-center justify-between text-xs font-sans mt-1 gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-ivory/60">
            <span>👥</span>
            <span>{request.guest_count} guest{request.guest_count !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-ivory/60">
            <span className="w-1.5 h-1.5 rounded-full bg-turmeric/50" />
            <span>
              {request.selected_events.length > 0
                ? `${request.selected_events.length} event${request.selected_events.length > 1 ? 's' : ''} chosen`
                : 'All events'}
            </span>
          </div>
        </div>
        <div className="text-ivory/40 whitespace-nowrap">
          {dateStr}
        </div>
      </div>

      {/* Action Buttons (Only for Pending) */}
      {request.status === 'pending' && (
        <div className="flex items-center gap-3 mt-2 pt-4 border-t border-white/10">
          <motion.button
            onClick={() => onApprove(request)}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium transition-colors border border-emerald-500/20"
          >
            ✓ Approve
          </motion.button>
          <motion.button
            onClick={() => onDecline(request)}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-2 rounded-xl bg-transparent hover:bg-rose/10 text-rose text-sm font-medium transition-colors border border-rose/20"
          >
            ✗ Decline
          </motion.button>
        </div>
      )}
      
      {/* Decline Reason (Only for Declined, if exists) */}
      {request.status === 'declined' && request.decline_reason && (
        <div className="mt-2 text-xs text-rose/80 bg-rose/10 px-3 py-2 rounded-lg border border-rose/10">
          <span className="font-semibold">Reason given:</span> {request.decline_reason}
        </div>
      )}
    </motion.div>
  )
}
