/**
 * useGallery — React hook for gallery photos CRUD operations.
 * Handles uploading directly to Supabase Storage and syncing with `gallery_photos` table.
 */

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { GalleryPhoto } from '../lib/types'

export function useGallery(listingId?: string) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [fetching, setFetching] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Fetch Photos ────────────────────────────────────────────────────────

  const fetchPhotos = useCallback(async () => {
    if (!listingId) return
    setFetching(true)
    setError(null)

    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[useGallery] fetch error:', error)
      setError(error.message)
    } else {
      setPhotos(data || [])
    }
    setFetching(false)
  }, [listingId])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  // ── Upload Photo ────────────────────────────────────────────────────────

  const uploadPhoto = async (file: File) => {
    if (!listingId) return false
    setUploading(true)
    setError(null)

    try {
      // 1. Generate unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const storagePath = `${listingId}/${fileName}`

      // 2. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(storagePath, file)

      if (uploadError) throw uploadError

      // 3. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(storagePath)

      const publicUrl = publicUrlData.publicUrl

      // 4. Insert into PostgreSQL table
      const { error: dbError } = await supabase
        .from('gallery_photos')
        .insert({
          listing_id: listingId,
          storage_path: storagePath,
          public_url: publicUrl
        })

      if (dbError) {
        // Rollback storage if DB fails
        await supabase.storage.from('wedding-photos').remove([storagePath])
        throw dbError
      }

      await fetchPhotos()
      setUploading(false)
      return true
    } catch (err: any) {
      console.error('[useGallery] upload error:', err)
      setError(err.message || 'Failed to upload photo')
      setUploading(false)
      return false
    }
  }

  // ── Delete Photo ────────────────────────────────────────────────────────

  const deletePhoto = async (photo: GalleryPhoto) => {
    if (!listingId) return false
    setError(null)

    try {
      // Optimistic UI update
      setPhotos(prev => prev.filter(p => p.id !== photo.id))

      // 1. Delete from PostgreSQL
      const { error: dbError } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', photo.id)

      if (dbError) throw dbError

      // 2. Delete from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('wedding-photos')
        .remove([photo.storage_path])

      if (storageError) {
        console.warn('[useGallery] warning: failed to delete from storage, but removed from DB', storageError)
      }

      return true
    } catch (err: any) {
      console.error('[useGallery] delete error:', err)
      setError(err.message || 'Failed to delete photo')
      // Revert optimistic update
      await fetchPhotos()
      return false
    }
  }

  return {
    photos,
    fetching,
    uploading,
    error,
    uploadPhoto,
    deletePhoto,
    refetch: fetchPhotos,
  }
}
