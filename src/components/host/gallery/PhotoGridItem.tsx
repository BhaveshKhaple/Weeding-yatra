/**
 * PhotoGridItem — Displays a single photo in the host's gallery grid.
 * Provides a hover state to delete the photo gracefully using Framer Motion.
 */

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { GalleryPhoto } from '../../../lib/types'

interface Props {
  photo: GalleryPhoto
  onDelete: (photo: GalleryPhoto) => Promise<boolean>
}

export function PhotoGridItem({ photo, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this photo permanently?')) {
      setDeleting(true)
      const success = await onDelete(photo)
      if (!success) {
        setDeleting(false) 
      }
    }
  }

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
        exit: { opacity: 0, scale: 0.5, transition: { duration: 0.3 } }
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`relative group aspect-[4/5] rounded-2xl overflow-hidden bg-charcoal-light border border-white/5 ${
        deleting ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <img
        src={photo.public_url}
        alt="Wedding Gallery Upload"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Overlay gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
        
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn-primary bg-rose/90 hover:bg-rose text-sm font-semibold px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center gap-2"
        >
          {deleting ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            '🗑️ Delete'
          )}
        </button>
        
      </div>
    </motion.div>
  )
}
