import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type {
  JoinRequest,
  JoinRequestInsert,
  JoinRequestStatus,
  JoinRequestWithListing,
  JoinRequestWithTraveller,
} from '../lib/types'
import { useAuth } from '../contexts/AuthContext'

export function useJoinRequests() {
  const { user } = useAuth()

  // ── Shared loading / error states ──────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  // ── TRAVELLER: submit a new join request ───────────────────────────────────

  const submitRequest = async (
    data: JoinRequestInsert
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'You must be logged in to submit a request.' }
    }

    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        listing_id:      data.listing_id,
        traveller_id:    user.id,          // Always enforce their own auth ID
        message:         data.message,
        nationality:     data.nationality,
        guest_count:     data.guest_count,
        selected_events: data.selected_events || [],
      }

      const { error: dbError } = await supabase
        .from('join_requests')
        .insert(payload)

      if (dbError) {
        // Handle PostgREST unique violation specifically
        if (dbError.code === '23505') {
          throw new Error("You've already requested to join this wedding.")
        }
        throw dbError
      }

      return { success: true }
    } catch (err: any) {
      console.error('Error submitting join request:', err)
      const message = err.message || 'Failed to submit request.'
      setError(message)
      return { success: false, error: message }
    } finally {
      setSubmitting(false)
    }
  }

  // ── TRAVELLER: check whether a request already exists for a listing ─────────

  const checkExistingRequest = async (
    listingId: string,
    travellerId?: string
  ): Promise<JoinRequest | null> => {
    const uid = travellerId || user?.id
    if (!uid) return null

    try {
      const { data, error: dbError } = await supabase
        .from('join_requests')
        .select('*')
        .eq('listing_id', listingId)
        .eq('traveller_id', uid)
        .maybeSingle()

      if (dbError) throw dbError
      return data as JoinRequest | null
    } catch (err) {
      console.error('Error checking existing request:', err)
      return null
    }
  }

  // ── TRAVELLER: fetch all requests submitted by the current traveller ────────

  const fetchMyRequests = async (
    travellerId?: string
  ): Promise<JoinRequestWithListing[]> => {
    const uid = travellerId || user?.id
    if (!uid) return []

    try {
      const { data, error: dbError } = await supabase
        .from('join_requests')
        .select(`
          *,
          wedding_listings (
            bride_name,
            groom_name,
            city,
            wedding_date,
            slug,
            cover_photo_url
          )
        `)
        .eq('traveller_id', uid)
        .order('submitted_at', { ascending: false })

      if (dbError) throw dbError
      return data as JoinRequestWithListing[]
    } catch (err) {
      console.error('Error fetching my requests:', err)
      return []
    }
  }

  // ── HOST: fetch all incoming requests for a specific listing ────────────────
  //
  // RLS requirement: "Host can read own listing requests" SELECT policy on
  // join_requests must exist (see 04-01-PLAN.md for exact SQL).
  //
  // Supabase join: joins profiles table to expose traveller name + nationality.

  const fetchHostRequests = async (
    listingId: string
  ): Promise<JoinRequestWithTraveller[]> => {
    setLoading(true)
    try {
      const { data, error: dbError } = await supabase
        .from('join_requests')
        .select(`
          *,
          profiles (
            full_name,
            nationality
          )
        `)
        .eq('listing_id', listingId)
        .order('submitted_at', { ascending: false })

      if (dbError) throw dbError
      return (data as JoinRequestWithTraveller[]) ?? []
    } catch (err) {
      console.error('Error fetching host requests:', err)
      return []
    } finally {
      setLoading(false)
    }
  }

  // ── HOST: approve or decline a pending request ──────────────────────────────
  //
  // RLS requirement: "Host can update request status" UPDATE policy on
  // join_requests must exist (see 04-01-PLAN.md for exact SQL).
  //
  // - On 'declined': decline_reason is stored if provided.
  // - On 'approved': decline_reason left unchanged (remains null).

  const updateRequestStatus = async (
    requestId: string,
    status: JoinRequestStatus,
    declineReason?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setSubmitting(true)
    setError(null)
    try {
      const updatePayload: Partial<JoinRequest> = { status }

      // Only persist a reason when explicitly declining
      if (status === 'declined' && declineReason?.trim()) {
        updatePayload.decline_reason = declineReason.trim()
      }

      const { error: dbError } = await supabase
        .from('join_requests')
        .update(updatePayload)
        .eq('id', requestId)

      if (dbError) throw dbError
      return { success: true }
    } catch (err: any) {
      console.error('Error updating request status:', err)
      const message = err.message || 'Failed to update request.'
      setError(message)
      return { success: false, error: message }
    } finally {
      setSubmitting(false)
    }
  }

  // ── Return ─────────────────────────────────────────────────────────────────

  return {
    // Traveller actions
    submitRequest,
    checkExistingRequest,
    fetchMyRequests,

    // Host actions
    fetchHostRequests,
    updateRequestStatus,

    // State
    submitting,
    loading,
    error,
  }
}
