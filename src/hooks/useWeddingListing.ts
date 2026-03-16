/**
 * useWeddingListing — React hook for reading + mutating a host's wedding listing.
 *
 * Design decisions:
 *  - No React Query installed yet → plain useState + useEffect with Supabase client.
 *  - `upsert` with `onConflict: 'host_id'` enforces the 1-listing-per-host rule
 *    at the DB level (the unique constraint set in migration 02-01).
 *  - The slug is auto-generated from bride + groom names on first insert.
 */

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { WeddingListing } from '../lib/types'
import { useAuth } from '../contexts/AuthContext'

// ─── Slug generation ────────────────────────────────────────────────────────

function generateSlug(brideName: string, groomName: string): string {
  const normalise = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

  const timestamp = Date.now().toString(36)
  return `${normalise(brideName)}-and-${normalise(groomName)}-${timestamp}`
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ListingFormData {
  // Step 1 — Couple
  bride_name: string
  groom_name: string
  // Step 2 — Venue / Date
  wedding_date: string   // 'YYYY-MM-DD'
  city: string
  venue_name: string
  // Step 3 — Story
  description: string
}

type MutationStatus = 'idle' | 'loading' | 'success' | 'error'

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useWeddingListing() {
  const { user } = useAuth()

  const [listing, setListing]     = useState<WeddingListing | null>(null)
  const [fetching, setFetching]   = useState(true)
  const [mutStatus, setMutStatus] = useState<MutationStatus>('idle')
  const [mutError, setMutError]   = useState<string | null>(null)

  // ── Fetch existing listing ────────────────────────────────────────────────

  const fetchListing = useCallback(async () => {
    if (!user) { setFetching(false); return }

    setFetching(true)
    const { data, error } = await supabase
      .from('wedding_listings')
      .select('*')
      .eq('host_id', user.id)
      .maybeSingle()

    if (error) console.error('[useWeddingListing] fetch error:', error)
    setListing(data ?? null)
    setFetching(false)
  }, [user])

  useEffect(() => { fetchListing() }, [fetchListing])

  // ── Create / update listing (upsert) ─────────────────────────────────────

  const saveListing = useCallback(async (formData: ListingFormData): Promise<boolean> => {
    if (!user) return false

    setMutStatus('loading')
    setMutError(null)

    // Determine slug — reuse existing or generate new
    const slug = listing?.slug ?? generateSlug(formData.bride_name, formData.groom_name)

    const payload = {
      host_id:     user.id,
      slug,
      bride_name:  formData.bride_name,
      groom_name:  formData.groom_name,
      wedding_date: formData.wedding_date,
      city:        formData.city,
      venue_name:  formData.venue_name,
      description: formData.description || null,
      status:      (listing?.status ?? 'open') as 'open' | 'closed',
    }

    const { data, error } = await supabase
      .from('wedding_listings')
      .upsert(payload, { onConflict: 'host_id' })
      .select()
      .single()

    if (error) {
      console.error('[useWeddingListing] upsert error:', error)
      setMutError(error.message)
      setMutStatus('error')
      return false
    }

    setListing(data)
    setMutStatus('success')
    return true
  }, [user, listing])

  // ── Toggle open / closed ──────────────────────────────────────────────────

  const toggleStatus = useCallback(async (): Promise<void> => {
    if (!listing) return

    const newStatus: 'open' | 'closed' = listing.status === 'open' ? 'closed' : 'open'

    // Optimistic update
    setListing(prev => prev ? { ...prev, status: newStatus } : prev)

    const { error } = await supabase
      .from('wedding_listings')
      .update({ status: newStatus })
      .eq('id', listing.id)

    if (error) {
      console.error('[useWeddingListing] toggle status error:', error)
      // Revert on failure
      setListing(prev => prev ? { ...prev, status: listing.status } : prev)
    }
  }, [listing])

  return {
    listing,
    fetching,
    saveListing,
    toggleStatus,
    mutStatus,
    mutError,
    refetch: fetchListing,
  }
}
