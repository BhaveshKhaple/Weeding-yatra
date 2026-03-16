/**
 * Step 4 — Cover Photo
 * Allows the host to upload a hero image for their listing directory card.
 */

import { motion, Variants } from 'framer-motion'
import { useState } from 'react'
import type { ListingFormData } from '../../../hooks/useWeddingListing'
import { supabase } from '../../../lib/supabase'

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const fieldVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  data: Pick<ListingFormData, 'cover_photo_url'>
  onChange: (field: keyof ListingFormData, value: string) => void
  isEditing: boolean
}

const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function CoverPhotoStep({ data, onChange, isEditing }: Props) {
  const [uploading, setUploading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    setLocalError(null)

    // Validation
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError('Only JPG, PNG, and WebP images are allowed.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setLocalError(`File is too large. Max size is ${MAX_SIZE_MB}MB.`)
      return
    }

    setUploading(true)

    try {
      // 1. Generate generic file name for cover since we might not have a full listing slug yet
      const fileExt = file.name.split('.').pop()
      const fileName = `cover-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const storagePath = `covers/${fileName}` // Place it in a covers subfolder

      // 2. Upload to Supabase Storage bucket 'wedding-photos'
      const { error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(storagePath, file)

      if (uploadError) throw uploadError

      // 3. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(storagePath)

      // 4. Update parent state
      onChange('cover_photo_url', publicUrlData.publicUrl)
      
    } catch (err: any) {
      console.error('[CoverPhotoStep] upload error:', err)
      setLocalError(err.message || 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    // Optionally delete from storage here, but we can just clear the URL for simplicity
    onChange('cover_photo_url', '')
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div variants={fieldVariants} className="text-center mb-2">
        <span className="text-4xl">🌄</span>
        <p className="font-sans text-ivory/60 text-sm mt-2 tracking-wide uppercase">
          Step 4 of 4
        </p>
        <h2 className="font-display text-3xl text-ivory mt-1">Cover Photo</h2>
        <p className="font-sans text-ivory/60 text-sm mt-2 max-w-sm mx-auto">
          Upload a high-quality, beautiful hero image that represents your wedding. This appears on the public directory.
        </p>
      </motion.div>

      <motion.div variants={fieldVariants} className="flex flex-col gap-1.5 items-center justify-center">
        {data.cover_photo_url ? (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden group border border-white/10 shadow-lg">
            <img 
              src={data.cover_photo_url} 
              alt="Listing Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="btn-primary bg-rose/90 hover:bg-rose px-4 py-2 text-sm shadow-xl"
              >
                🗑️ Remove Cover
              </button>
            </div>
          </div>
        ) : (
          <label className={`w-full aspect-[21/9] border-2 border-dashed border-white/20 hover:border-saffron rounded-2xl flex flex-col items-center justify-center bg-white/5 hover:bg-saffron/5 transition-colors group ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
            <input 
              type="file" 
              accept={ACCEPTED_TYPES.join(',')} 
              onChange={handleFileChange} 
              className="hidden" 
              disabled={uploading}
            />
            
            {uploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3"
              >
                 <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-8 h-8 border-4 border-saffron/30 border-t-saffron rounded-full"
                />
                <span className="font-sans text-saffron text-sm font-semibold">Uploading...</span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center text-center p-6 grayscale group-hover:grayscale-0 transition-opacity">
                <span className="text-4xl mb-4 opacity-70">📸</span>
                <span className="font-sans text-ivory font-medium">Click to select cover image</span>
                <span className="font-sans text-ivory/40 text-xs mt-1">Recommended: 21:9 ratio · Max {MAX_SIZE_MB}MB</span>
              </div>
            )}
          </label>
        )}

        {localError && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-xs font-sans mt-2">
            {localError}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={fieldVariants}>
        <div className="bg-saffron/10 border border-saffron/20 rounded-xl p-4 mt-2">
          <p className="font-sans text-saffron/80 text-xs leading-relaxed">
            🎉 You're all set! Clicking{' '}
            <strong>{isEditing ? 'Save Changes' : 'Publish Listing'}</strong> will make
            your updated cover photo and details visible to the public. You can upload regular gallery photos from the dashboard!
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
