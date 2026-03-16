import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { WeddingListing, JoinRequest } from '../../lib/types'

interface RSVPBottomBarProps {
  listing: WeddingListing
  onRequestJoin: () => void
  existingRequest: JoinRequest | null
}

export function RSVPBottomBar({ listing, onRequestJoin, existingRequest }: RSVPBottomBarProps) {
  const { user, profile } = useAuth()

  // Hosts don't see RSVP
  if (profile?.role === 'host') {
    return null
  }

  // If the listing is somehow closed, it's not taking requests
  if (listing.status === 'closed') {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-xl border-t border-white/10 p-safe"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center">
          <p className="text-ivory/60 font-sans text-sm">This wedding is no longer accepting requests.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal/80 supports-[backdrop-filter]:bg-charcoal/60 backdrop-blur-xl border-t border-white/10 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Helper Text */}
        <div className="text-center sm:text-left">
          {existingRequest ? (
            <div>
              <p className="font-display text-lg text-ivory">Request Sent</p>
              <p className="text-ivory/60 text-xs font-sans">You've requested to join {listing.bride_name} & {listing.groom_name}'s wedding.</p>
            </div>
          ) : (
            <div>
              <p className="font-display text-lg text-ivory">Join the Celebration</p>
              <p className="text-ivory/60 text-xs font-sans">Experience an authentic Indian wedding.</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div key="signup" className="w-full sm:w-auto">
              <Link 
                to="/signup" 
                className="block w-full text-center bg-white/10 hover:bg-white/20 text-ivory px-6 py-3 rounded-xl font-medium transition-colors text-sm border border-white/10"
              >
                Sign up to request an invite →
              </Link>
            </motion.div>
          ) : existingRequest ? (
            <motion.div key={existingRequest.status} className="w-full sm:w-auto">
              <button 
                disabled
                className={`w-full text-center px-6 py-3 rounded-xl font-medium text-sm border ${
                  existingRequest.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    : existingRequest.status === 'approved'
                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                    : 'bg-rose/10 text-rose border-rose/20'
                }`}
              >
                {existingRequest.status === 'pending' && 'Request Pending ⏳'}
                {existingRequest.status === 'approved' && 'Approved 🎉'}
                {existingRequest.status === 'declined' && 'Declined'}
              </button>
            </motion.div>
          ) : (
            <motion.div key="request" className="w-full sm:w-auto">
              <button 
                onClick={onRequestJoin}
                className="w-full bg-gradient-to-r from-turmeric to-saffron hover:opacity-90 text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] px-8 py-3 rounded-xl font-medium transition-all text-sm hover:scale-105 active:scale-95"
              >
                Request to Join 🎊
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}
