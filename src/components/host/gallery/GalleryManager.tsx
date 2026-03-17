/**
 * GalleryManager — Combines PhotoUploader and the PhotoGrid for the dashboard.
 * Host visualizes all uploaded pictures elegantly overlapping or cascading in CSS grid.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useGallery } from '../../../hooks/useGallery'
import { PhotoUploader } from './PhotoUploader'
import { PhotoGridItem } from './PhotoGridItem'

interface Props {
  listingId: string
}

export function GalleryManager({ listingId }: Props) {
  const { photos, fetching, uploading, error, uploadPhoto, deletePhoto } = useGallery(listingId)

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header section */}
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-3xl text-ivory">Photo Gallery</h2>
        <p className="font-sans text-ivory/50 text-sm">
          Upload up to 20 high-quality photos to showcase your venue, ceremonies, and celebrations.
        </p>
      </div>

      {error && (
        <p className="font-sans text-rose-400 text-sm bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">
          ⚠️ {error}
        </p>
      )}

      {/* Upload Zone */}
      <PhotoUploader onUpload={uploadPhoto} uploading={uploading} />

      {/* Grid Zone */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sans text-ivory/80 text-sm font-medium">Uploaded Images</h3>
          <span className="font-sans text-ivory/40 text-xs">
            {photos.length} photo{photos.length === 1 ? '' : 's'}
          </span>
        </div>

        {fetching ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse" aria-busy="true" aria-label="Loading gallery photos">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl w-full" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/5 rounded-3xl border-dashed">
            <span className="text-3xl opacity-30 mb-2">🖼️</span>
            <p className="font-sans text-ivory/40 text-sm text-center">
              Your gallery is empty.<br />Upload your first photo above.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {photos.map(photo => (
                <PhotoGridItem 
                  key={photo.id} 
                  photo={photo} 
                  onDelete={deletePhoto} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
