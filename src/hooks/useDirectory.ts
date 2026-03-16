import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { WeddingListing } from '../lib/types'

export function useDirectory() {
  const [listings, setListings] = useState<WeddingListing[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchListings() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error: fetchError } = await supabase
          .from('wedding_listings')
          .select('*')
          .eq('status', 'open')
          .order('wedding_date', { ascending: true })

        if (fetchError) throw fetchError

        if (mounted) {
          setListings(data || [])
          // Extract unique sorted cities
          const uniqueCities = Array.from(new Set((data || []).map(l => l.city).filter(Boolean)))
          setCities(uniqueCities.sort())
        }
      } catch (err: any) {
        console.error('Error fetching listings:', err)
        if (mounted) {
          setError(err.message || 'Failed to fetch directory')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchListings()

    return () => {
      mounted = false
    }
  }, [])

  return { listings, loading, error, cities }
}
