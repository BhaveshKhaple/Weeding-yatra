/**
 * HostDashboard — Phase 2 Plan 03 full implementation.
 *
 * States:
 *  1. Loading   — skeleton pulsing while we fetch the listing
 *  2. No listing — animated CTA to create their first wedding
 *  3. Has listing — shows listing overview card + edit form + status toggle
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useWeddingListing } from '../../hooks/useWeddingListing'
import { ListingMultiStepForm }  from '../../components/host/ListingMultiStepForm'
import { ListingStatusToggle }   from '../../components/host/ListingStatusToggle'
import { EventList } from '../../components/host/events/EventList'

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-8 w-48 bg-white/10 rounded-xl" />
      <div className="h-4 w-64 bg-white/10 rounded-xl" />
      <div className="h-48 bg-white/10 rounded-2xl" />
    </div>
  )
}

// ─── Empty CTA ────────────────────────────────────────────────────────────────

function CreateListingCTA({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center text-center gap-6 py-12"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-7xl"
      >
        🪷
      </motion.div>
      <div>
        <h2 className="font-display text-4xl text-ivory mb-3">
          Begin Your Wedding Story
        </h2>
        <p className="font-sans text-ivory/60 text-sm max-w-sm mx-auto leading-relaxed">
          Create your wedding listing to connect with passionate travellers from around the world
          who want to witness and celebrate your special day.
        </p>
      </div>
      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="btn-primary text-lg px-8 py-4"
      >
        ✨ Create Your Listing
      </motion.button>

      {/* Decorative features */}
      <div className="grid grid-cols-3 gap-6 mt-4 w-full max-w-sm">
        {[
          { icon: '🌍', label: 'Global Reach' },
          { icon: '🔒', label: 'One Listing' },
          { icon: '⚡', label: 'Instant Live' },
        ].map(f => (
          <div key={f.label} className="flex flex-col items-center gap-1">
            <span className="text-2xl">{f.icon}</span>
            <span className="font-sans text-ivory/40 text-xs">{f.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Listing Overview Card ─────────────────────────────────────────────────────

function ListingOverviewCard({ listing, onEdit, toggleStatus }: {
  listing: ReturnType<typeof useWeddingListing>['listing'] & {}
  onEdit: () => void
  toggleStatus: () => Promise<void>
}) {
  const formattedDate = listing
    ? new Date(listing.wedding_date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  if (!listing) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-ivory">
            {listing.bride_name} <span className="text-saffron">&</span> {listing.groom_name}
          </h3>
          <p className="font-sans text-ivory/50 text-sm mt-0.5">
            {listing.city} · {listing.venue_name}
          </p>
          <p className="font-sans text-turmeric text-xs mt-1">📅 {formattedDate}</p>
        </div>
        <ListingStatusToggle listing={listing} onToggle={toggleStatus} />
      </div>

      {/* Description preview */}
      {listing.description && (
        <p className="font-sans text-ivory/50 text-sm leading-relaxed line-clamp-3">
          {listing.description}
        </p>
      )}

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Actions */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-outline border-saffron text-saffron text-sm px-5 py-2"
        >
          ✏️ Edit Listing
        </motion.button>
        <a
          href={`/weddings/${listing.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-ivory/40 text-sm hover:text-ivory/70 transition-colors"
        >
          View Public Page →
        </a>
      </div>
    </motion.div>
  )
}

// ─── Form Modal Shell ─────────────────────────────────────────────────────────

function FormModal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{ opacity: 0, scale: 0.92,    y: 24 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        className="bg-charcoal border border-white/10 rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl"
      >
        {/* Close */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="font-sans text-ivory/40 hover:text-ivory text-xl transition-colors w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function HostDashboard() {
  const { profile, signOut } = useAuth()
  const { listing, fetching, saveListing, toggleStatus, mutStatus, mutError, refetch } =
    useWeddingListing()

  const [showForm, setShowForm] = useState(false)

  async function handleSave(formData: Parameters<typeof saveListing>[0]) {
    const ok = await saveListing(formData)
    if (ok) {
      await refetch()
      // Keep form open briefly so the success animation plays, then close after delay
      setTimeout(() => setShowForm(false), 3200)
    }
    return ok
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-charcoal"
    >
      {/* Top nav */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-saffron text-2xl">WY</span>
          <span className="font-sans text-ivory/30 text-sm">Host Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-sans text-ivory/60 text-sm hidden sm:block">
            {profile?.full_name}
          </span>
          <button
            onClick={signOut}
            className="btn-ghost text-ivory/50 text-sm hover:text-ivory"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="section-container py-10 max-w-2xl">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="font-display text-5xl text-ivory">
            Welcome back,{' '}
            <span className="text-gradient-warm">
              {profile?.full_name?.split(' ')[0] || 'Host'}
            </span>{' '}
            🪷
          </h1>
          <p className="font-sans text-ivory/50 text-sm mt-2">
            Manage your wedding listing and connect with travellers.
          </p>
        </motion.div>

        {/* Content state */}
        {fetching ? (
          <DashboardSkeleton />
        ) : listing ? (
          <div className="flex flex-col gap-12">
            <ListingOverviewCard
              listing={listing}
              onEdit={() => setShowForm(true)}
              toggleStatus={toggleStatus}
            />
            {/* Events Manager section isolated under the overview */}
            <EventList listingId={listing.id} />
          </div>
        ) : (
          <CreateListingCTA onStart={() => setShowForm(true)} />
        )}
      </main>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <FormModal onClose={() => setShowForm(false)}>
            <ListingMultiStepForm
              existingListing={listing}
              onSave={handleSave}
              mutStatus={mutStatus}
              mutError={mutError}
            />
          </FormModal>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default HostDashboard
