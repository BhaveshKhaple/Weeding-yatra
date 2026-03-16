/**
 * useWeddingEvents — React hook for CRUD operations on wedding events.
 *
 * Ensures all fetched events are strictly ordered by date and time.
 */

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { WeddingEvent } from '../lib/types'

export type EventFormData = Omit<WeddingEvent, 'id' | 'listing_id'>

export function useWeddingEvents(listingId?: string) {
  const [events, setEvents] = useState<WeddingEvent[]>([])
  const [fetching, setFetching] = useState(false)
  const [mutating, setMutating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Fetch Events ────────────────────────────────────────────────────────

  const fetchEvents = useCallback(async () => {
    if (!listingId) return
    setFetching(true)
    setError(null)

    const { data, error } = await supabase
      .from('wedding_events')
      .select('*')
      .eq('listing_id', listingId)
      // Chronological sorting: date first, then time
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true })

    if (error) {
      console.error('[useWeddingEvents] fetch error:', error)
      setError(error.message)
    } else {
      setEvents(data || [])
    }
    setFetching(false)
  }, [listingId])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // ── Create Event ────────────────────────────────────────────────────────

  const addEvent = async (formData: EventFormData) => {
    if (!listingId) return false
    setMutating(true)
    setError(null)

    const { error } = await supabase
      .from('wedding_events')
      .insert({ ...formData, listing_id: listingId })

    if (error) {
      console.error('[useWeddingEvents] insert error:', error)
      setError(error.message)
      setMutating(false)
      return false
    }

    await fetchEvents() // refetch to maintain chronological order
    setMutating(false)
    return true
  }

  // ── Update Event ────────────────────────────────────────────────────────

  const updateEvent = async (eventId: string, formData: Partial<EventFormData>) => {
    if (!listingId) return false
    setMutating(true)
    setError(null)

    const { error } = await supabase
      .from('wedding_events')
      .update(formData)
      .eq('id', eventId)
      .eq('listing_id', listingId) // Extra safety check

    if (error) {
      console.error('[useWeddingEvents] update error:', error)
      setError(error.message)
      setMutating(false)
      return false
    }

    await fetchEvents()
    setMutating(false)
    return true
  }

  // ── Delete Event ────────────────────────────────────────────────────────

  const deleteEvent = async (eventId: string) => {
    if (!listingId) return false
    setMutating(true)
    setError(null)

    const { error } = await supabase
      .from('wedding_events')
      .delete()
      .eq('id', eventId)
      .eq('listing_id', listingId)

    if (error) {
      console.error('[useWeddingEvents] delete error:', error)
      setError(error.message)
      setMutating(false)
      return false
    }

    setEvents(prev => prev.filter(e => e.id !== eventId))
    setMutating(false)
    return true
  }

  return {
    events,
    fetching,
    mutating,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  }
}
