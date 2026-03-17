import { useState, useEffect, useRef, useCallback, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useJoinRequests } from '../../hooks/useJoinRequests'
import type { WeddingListing, WeddingEvent } from '../../lib/types'
import { RSVPConfirmation } from './RSVPConfirmation'

interface RSVPModalProps {
  isOpen: boolean
  onClose: () => void
  listing: WeddingListing
  events: WeddingEvent[]
  onSuccess: () => void
}

export function RSVPModal({ isOpen, onClose, listing, events, onSuccess }: RSVPModalProps) {
  const { user, profile } = useAuth()
  const { submitRequest, submitting, error } = useJoinRequests()

  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')
  const [nationality, setNationality] = useState(profile?.nationality || '')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  
  const [isSuccess, setIsSuccess] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (guestCount < 1) return setFormError('Guest count must be at least 1.')
    if (message.trim().length < 10) return setFormError('Please write a slightly longer, thoughtful message to the hosts.')
    if (selectedEvents.length === 0) return setFormError('Please select at least one event to attend.')
    
    const result = await submitRequest({
      listing_id: listing.id,
      traveller_id: user!.id,
      message,
      nationality: nationality || 'Not Specified',
      guest_count: guestCount,
      selected_events: selectedEvents
    })

    if (result.success) {
      setIsSuccess(true)
      onSuccess()
    } else {
      setFormError(result.error || 'Oops, something went wrong submitting your request.')
    }
  }

  // Escape key + focus trapping
  const modalRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    // Focus trap
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    // Focus first element on open
    const timer = setTimeout(() => {
      const first = modalRef.current?.querySelector<HTMLElement>('button, input, textarea')
      first?.focus()
    }, 100)
    return () => { document.removeEventListener('keydown', handleKeyDown); clearTimeout(timer) }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-end sm:justify-center overflow-hidden">
        
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Slide-over panel — bottom sheet on mobile, centered on desktop */}
        <motion.div 
          ref={modalRef}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full sm:w-[500px] h-[92vh] sm:h-[85vh] bg-charcoal border border-white/10 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-y-auto flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-modal-title"
        >
          {/* Drag handle — mobile bottom-sheet cue */}
          <div className="sm:hidden flex justify-center py-2">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="sticky top-0 z-10 bg-charcoal/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <h2 id="rsvp-modal-title" className="font-display text-xl text-ivory">Request to Join</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-ivory transition-colors focus-visible-ring"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-6 relative">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <RSVPConfirmation 
                  key="confirm"
                  brideName={listing.bride_name}
                  groomName={listing.groom_name}
                  travellerName={profile?.full_name || 'Traveler'}
                  message={message}
                  onClose={onClose}
                />
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit} 
                  className="flex flex-col gap-6"
                >
                  {(error || formError) && (
                    <div className="bg-rose/10 border border-rose/20 text-rose px-4 py-3 rounded-xl text-sm font-medium">
                      {error || formError}
                    </div>
                  )}

                  {/* Note block */}
                  <div className="bg-saffron/10 border border-saffron/20 rounded-xl p-4 flex gap-3">
                    <span className="text-2xl mt-1">🪔</span>
                    <p className="font-sans text-sm text-ivory/80">
                      Indian weddings are deeply personal cultural celebrations. Please introduce yourself thoughtfully and be respectful of the host's space and requirements.
                    </p>
                  </div>

                  {/* Guest Count */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-ivory/90 font-display">How many travelers?</label>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-2 w-fit">
                      <button 
                        type="button" 
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-ivory transition-colors text-xl font-medium"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-lg font-medium text-ivory">
                        {guestCount}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-saffron/20 hover:bg-saffron/30 text-saffron transition-colors text-xl font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Events Multi-select */}
                  <div className="flex flex-col gap-3 mt-2">
                    <label className="text-sm font-medium text-ivory/90 font-display">Which events would you like to attend?</label>
                    {events.length === 0 ? (
                      <p className="text-sm text-ivory/50 italic">No events listed.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {events.map((event) => {
                          const isSelected = selectedEvents.includes(event.id)
                          return (
                            <button
                              key={event.id}
                              type="button"
                              onClick={() => toggleEvent(event.id)}
                              className={`flex flex-col items-start text-left p-3 rounded-xl border transition-all ${
                                isSelected 
                                  ? 'bg-turmeric/10 border-turmeric text-ivory shadow-[0_0_10px_rgba(255,107,0,0.1)]' 
                                  : 'bg-white/5 border-white/10 text-ivory/70 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex justify-between w-full items-center mb-1">
                                <span className={`font-medium ${isSelected ? 'text-turmeric' : 'text-ivory'}`}>{event.name}</span>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-turmeric bg-turmeric' : 'border-white/30'
                                }`}>
                                  {isSelected && <span className="text-white text-xs">✓</span>}
                                </div>
                              </div>
                              <span className="text-xs opacity-70">
                                {new Date(event.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short'})} 
                                {event.event_time && ` • ${event.event_time.slice(0, 5)}`}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Nationality */}
                  <div className="flex flex-col gap-2 mt-2">
                    <label htmlFor="nationality" className="text-sm font-medium text-ivory/90 font-display">Where are you descending from?</label>
                    <input 
                      type="text" 
                      id="nationality"
                      placeholder="e.g. Canada, Germany, Australia..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-ivory focus:outline-none focus:border-turmeric/50 transition-colors"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                    />
                  </div>

                  {/* Message textarea */}
                  <div className="flex flex-col gap-2 mt-2">
                    <label htmlFor="message" className="text-sm font-medium text-ivory/90 font-display">Message to {listing.bride_name} & {listing.groom_name}</label>
                    <textarea 
                      id="message"
                      rows={4}
                      placeholder="Namaste! We are a couple traveling from Germany and would be honored to experience your beautiful culture..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-ivory resize-none focus:outline-none focus:border-turmeric/50 transition-colors"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-turmeric to-saffron hover:opacity-90 disabled:opacity-50 text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] px-8 py-4 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center"
                    >
                      {submitting ? (
                        <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        'Send Request 🙏'
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  )
}
