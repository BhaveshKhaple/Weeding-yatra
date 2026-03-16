/**
 * WeddingDetail — The immersive public scrollytelling page for a single wedding listing.
 * Route: /weddings/:slug
 *
 * Sections:
 *   1. HeroSection       — Full-viewport parallax cover photo + couple names
 *   2. StorySection      — GSAP ScrollTrigger revealed welcome message
 *   3. LottieDivider     — Cultural folk-art animation separator
 *   4. EventsTimeline    — GSAP staggered chronological events
 *   5. PublicGallery     — Framer Motion revealed masonry photo grid
 *   6. Footer CTA        — Join request nudge (implemented in Phase 3)
 */

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { supabase } from '../../lib/supabase'
import type { WeddingListing, WeddingEvent, GalleryPhoto } from '../../lib/types'

import { PageTransition } from '../../components/motion/PageTransition'
import { HeroSection }    from '../../components/listing/HeroSection'
import { StorySection }   from '../../components/listing/StorySection'
import { EventsTimeline } from '../../components/listing/EventsTimeline'
import { PublicGallery }  from '../../components/listing/PublicGallery'
import { RSVPBottomBar }  from '../../components/traveller/RSVPBottomBar'
import { RSVPModal }      from '../../components/traveller/RSVPModal'
import { useJoinRequests } from '../../hooks/useJoinRequests'
import { useAuth }         from '../../contexts/AuthContext'
import type { JoinRequest } from '../../lib/types'

// ─── Not Found ────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center gap-8 text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="text-7xl"
      >
        🪷
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col gap-3"
      >
        <h1 className="font-display text-4xl text-ivory">This wedding isn't here…</h1>
        <p className="font-sans text-ivory/50 text-lg max-w-sm mx-auto">
          The listing may have been removed or the link is incorrect.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link to="/weddings" className="btn-outline text-ivory border-white/20 hover:bg-white/10">
          ← Browse all weddings
        </Link>
      </motion.div>
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-charcoal animate-pulse">
      <div className="h-screen w-full bg-white/5" />
      <div className="max-w-3xl mx-auto px-6 py-24 flex flex-col gap-6">
        <div className="h-10 bg-white/10 rounded-xl w-2/3 mx-auto" />
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-5/6" />
        <div className="h-4 bg-white/5 rounded w-4/6" />
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function WeddingDetail() {
  const { slug } = useParams<{ slug: string }>()

  const [listing, setListing]   = useState<WeddingListing | null>(null)
  const [events,  setEvents]    = useState<WeddingEvent[]>([])
  const [photos,  setPhotos]    = useState<GalleryPhoto[]>([])
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  const { user } = useAuth()
  const { checkExistingRequest } = useJoinRequests()
  const [existingRequest, setExistingRequest] = useState<JoinRequest | null>(null)
  const [showRSVPModal, setShowRSVPModal] = useState(false)

  useEffect(() => {
    if (!slug) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const currentSlug = slug   // narrowed, non-nullable

    async function loadAll() {
      setLoading(true)

      // 1. Fetch the listing by slug (we allow closed listings here so the page still exists)
      const { data: listingData, error: listingErr } = await supabase
        .from('wedding_listings')
        .select('*')
        .eq('slug', currentSlug)
        .single()

      if (listingErr || !listingData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setListing(listingData)

      // 2. Fetch events sorted chronologically
      const { data: eventsData } = await supabase
        .from('wedding_events')
        .select('*')
        .eq('listing_id', listingData.id)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true })

      setEvents(eventsData || [])

      // 3. Fetch gallery photos
      const { data: photosData } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('listing_id', listingData.id)
        .order('created_at', { ascending: false })

      setPhotos(photosData || [])

      // 4. If logged in, check if user has already requested to join
      if (user) {
        const req = await checkExistingRequest(listingData.id)
        setExistingRequest(req)
      }

      setLoading(false)
    }

    loadAll()
  }, [slug, user])

  if (loading)  return <DetailSkeleton />
  if (notFound) return <NotFound />
  if (!listing) return null

  return (
    <PageTransition>
      {/* Dark cultural canvas */}
      <div className="bg-charcoal min-h-screen text-ivory">

        {/* 1 ── Hero: full-viewport parallax cover photo */}
        <HeroSection listing={listing} />

        {/* 2 ── Story: GSAP ScrollTrigger welcome message */}
        <StorySection
          brideName={listing.bride_name}
          groomName={listing.groom_name}
          description={listing.description}
        />

        {/* 3 ── Lottie folk-art divider between story and events */}
        <div className="flex justify-center py-4">
          <div className="w-full max-w-xs opacity-60">
            {/* Inline SVG mandala divider as Lottie placeholder fallback 
                Replace animationData with a real Lottie JSON when available */}
            <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <line x1="0" y1="10" x2="80" y2="10" stroke="rgba(255,165,0,0.3)" strokeWidth="1"/>
              <circle cx="100" cy="10" r="5" fill="none" stroke="rgba(255,165,0,0.5)" strokeWidth="1"/>
              <circle cx="100" cy="10" r="2" fill="rgba(255,165,0,0.5)"/>
              <line x1="120" y1="10" x2="200" y2="10" stroke="rgba(255,165,0,0.3)" strokeWidth="1"/>
            </svg>
          </div>
        </div>

        {/* 4 ── Events: GSAP staggered chronological timeline */}
        {events.length > 0 && (
          <EventsTimeline events={events} />
        )}

        {/* 5 ── Gallery: Framer Motion masonry reveal */}
        {photos.length > 0 && (
          <>
            {/* Another ornamental divider */}
            <div className="flex justify-center">
              <div className="w-full max-w-xs opacity-60">
                <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  <line x1="0" y1="10" x2="75" y2="10" stroke="rgba(255,165,0,0.3)" strokeWidth="1"/>
                  <polygon points="90,4 100,14 110,4 100,10" fill="none" stroke="rgba(255,165,0,0.5)" strokeWidth="1"/>
                  <line x1="125" y1="10" x2="200" y2="10" stroke="rgba(255,165,0,0.3)" strokeWidth="1"/>
                </svg>
              </div>
            </div>
            <PublicGallery photos={photos} />
          </>
        )}

        {/* 6 ── Footer CTA (Join Request) */}
        <div className="pb-32 px-6 pt-12 text-center text-ivory/30">
          <p className="font-sans text-sm pb-4">End of {listing.bride_name} & {listing.groom_name}'s listing</p>
        </div>

      </div>

      <RSVPBottomBar 
        listing={listing} 
        onRequestJoin={() => setShowRSVPModal(true)} 
        existingRequest={existingRequest} 
      />

      <RSVPModal 
        isOpen={showRSVPModal} 
        onClose={() => setShowRSVPModal(false)} 
        listing={listing} 
        events={events}
        onSuccess={() => {
          // After success, re-fetch the existing request state to update the bottom bar to "Pending"
          checkExistingRequest(listing.id).then(req => setExistingRequest(req))
        }}
      />
    </PageTransition>
  )
}
