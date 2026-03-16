import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { generateWhatsAppLink } from '../../utils/whatsapp'

interface RSVPConfirmationProps {
  brideName: string
  groomName: string
  travellerName: string
  message: string
  onClose: () => void
}

export function RSVPConfirmation({ brideName, groomName, travellerName, message, onClose }: RSVPConfirmationProps) {
  // We don't have host phone number in the MVP schema, so pass null
  const whatsappUrl = generateWhatsAppLink(null, {
    brideName,
    groomName,
    travellerName,
    message
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20 }}
      className="p-8 flex flex-col items-center justify-center text-center gap-6"
    >
      <motion.div 
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, delay: 0.1 }}
        className="text-7xl mb-2 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]"
      >
        ✅
      </motion.div>
      
      <div>
        <h3 className="font-display text-3xl text-ivory mb-2">Request Sent!</h3>
        <p className="font-sans text-ivory/60 text-sm max-w-xs mx-auto">
          Your request to join {brideName} & {groomName}'s wedding is now pending host approval.
        </p>
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mt-2">
        <p className="font-sans text-ivory/80 text-sm text-left mb-4">
          Want to step out and introduce yourself before they approve?
        </p>
        
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BE5A] text-white px-4 py-3 rounded-lg font-medium transition-colors border border-[#25D366]/40 shadow-lg shadow-[#25D366]/20"
        >
          {/* Simple WhatsApp icon SVG */}
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          Say Hi on WhatsApp
        </a>
      </div>

      <div className="flex flex-col w-full gap-3 mt-4">
        <Link 
          to="/traveller"
          className="w-full py-3 rounded-lg border border-turmeric/30 bg-turmeric/10 text-turmeric font-medium hover:bg-turmeric/20 transition-colors"
        >
          View My Requests
        </Link>
        
        <button 
          onClick={onClose}
          className="w-full py-3 rounded-lg text-ivory/50 font-medium hover:text-ivory transition-colors text-sm"
        >
          Dismiss
        </button>
      </div>

    </motion.div>
  )
}
