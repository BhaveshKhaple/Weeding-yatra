/**
 * ListingStatusToggle — Open / Closed switch for the host's listing.
 *
 * Uses an animated pill/track toggle with Framer Motion layout animation.
 * Calls useWeddingListing.toggleStatus() and shows a transient saving indicator.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { WeddingListing } from '../../lib/types'

interface Props {
  listing:      WeddingListing
  onToggle:     () => Promise<void>
}

export function ListingStatusToggle({ listing, onToggle }: Props) {
  const isOpen = listing.status === 'open'
  const [saving, setSaving] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  async function handleToggle() {
    if (saving) return
    setSaving(true)
    await onToggle()
    setSaving(false)
    setSavedFlash(true)
  }

  useEffect(() => {
    if (!savedFlash) return
    const t = setTimeout(() => setSavedFlash(false), 1800)
    return () => clearTimeout(t)
  }, [savedFlash])

  return (
    <div className="flex items-center gap-4">
      {/* Track */}
      <button
        id="listing-status-toggle"
        onClick={handleToggle}
        disabled={saving}
        aria-label={isOpen ? 'Close listing' : 'Open listing'}
        className="relative w-14 h-7 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron disabled:opacity-50 transition-colors duration-300"
        style={{ backgroundColor: isOpen ? '#FF6B00' : 'rgba(255,255,255,0.15)' }}
      >
        {/* Thumb */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm ${isOpen ? 'left-auto right-0.5' : 'left-0.5'}`}
        />
      </button>

      <div className="flex flex-col">
        <span className={`font-sans text-sm font-semibold ${isOpen ? 'text-saffron' : 'text-ivory/40'}`}>
          {isOpen ? '🟢 Open' : '⚫ Closed'}
        </span>
        <AnimatePresence mode="popLayout">
          {saving && (
            <motion.span
              key="saving"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-sans text-xs text-ivory/40"
            >
              Saving…
            </motion.span>
          )}
          {savedFlash && !saving && (
            <motion.span
              key="saved"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-sans text-xs text-teal-400"
            >
              ✓ Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
