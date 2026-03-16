import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { JoinRequest, JoinRequestInsert } from '../lib/types'
import { useAuth } from '../contexts/AuthContext'

export function useJoinRequests() {
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitRequest = async (data: JoinRequestInsert): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'You must be logged in to submit a request.' }
    }

    setSubmitting(true)
    setError(null)

    try {
      // Data sanity check
      const payload = {
        listing_id: data.listing_id,
        traveller_id: user.id, // Always enforce their own auth ID
        message: data.message,
        nationality: data.nationality,
        guest_count: data.guest_count,
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

  const checkExistingRequest = async (listingId: string, travellerId?: string): Promise<JoinRequest | null> => {
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

  const fetchMyRequests = async (travellerId?: string): Promise<JoinRequest[]> => {
    const uid = travellerId || user?.id
    if (!uid) return []

    try {
      const { data, error: dbError } = await supabase
        .from('join_requests')
        .select('*')
        .eq('traveller_id', uid)
        .order('submitted_at', { ascending: false })

      if (dbError) throw dbError
      return data as JoinRequest[]
    } catch (err) {
      console.error('Error fetching my requests:', err)
      return []
    }
  }

  return {
    submitRequest,
    checkExistingRequest,
    fetchMyRequests,
    submitting,
    error,
  }
}
