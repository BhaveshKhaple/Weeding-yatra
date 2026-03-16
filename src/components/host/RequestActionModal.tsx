import { motion } from 'framer-motion'
import { JoinRequestWithTraveller } from '../../lib/types'
import { useState, useRef, useEffect } from 'react'

interface RequestActionModalProps {
  request: JoinRequestWithTraveller | null
  action: 'approve' | 'decline' | null
  onConfirm: (reason?: string) => Promise<void>
  onClose: () => void
  isLoading: boolean
}

export function RequestActionModal({
  request,
  action,
  onConfirm,
  onClose,
  isLoading,
}: RequestActionModalProps) {
  const [reason, setReason] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus trap on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
    
    // Escape to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!request || !action) return null

  const profile = request.profiles
  const travellerName = profile?.full_name || 'the traveller'

  const isApprove = action === 'approve'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget && !isLoading) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        className="bg-charcoal border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-ivory/40 hover:text-ivory transition-colors disabled:opacity-50"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Content */}
        <h2 id="action-modal-title" className="font-display text-3xl text-ivory mb-2">
          {isApprove ? 'Welcome them aboard! 🎉' : 'Decline Request'}
        </h2>
        
        <p className="font-sans text-ivory/60 mb-6 text-sm">
          {isApprove 
            ? `Send ${travellerName} a personal welcome note (optional).`
            : `Let ${travellerName} know why (optional — they will see this).`
          }
        </p>

        {/* Form */}
        <textarea
          ref={textareaRef}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={isApprove ? 'Write a warm welcome message…' : 'Reason for declining…'}
          disabled={isLoading}
          rows={4}
          className={`w-full bg-black/30 border border-white/10 rounded-xl p-4 text-ivory placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal transition-all disabled:opacity-50 resize-none ${isApprove ? 'focus:ring-emerald-500' : 'focus:ring-rose'}`}
        />

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl font-medium text-ivory/60 hover:text-ivory bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={() => onConfirm(reason)}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors border ${
              isApprove 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-charcoal shadow-glow-warm border-emerald-500' 
                : 'bg-rose/10 hover:bg-rose/20 text-rose border-rose/30'
            } disabled:opacity-50`}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isApprove ? '✓ Approve Request' : '✗ Decline Request'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
