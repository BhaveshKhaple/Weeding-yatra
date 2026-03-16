/**
 * PhotoUploader — A drag-and-drop or click-to-select zone for uploading images.
 * Implements strict client-side limits: 5MB size, JPG/PNG/WebP only.
 */

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onUpload: (file: File) => Promise<boolean>
  uploading: boolean
}

const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function PhotoUploader({ onUpload, uploading }: Props) {
  const [dragActive, setDragActive] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0])
    }
    // reset input so the same file can be selected again if needed
    if (inputRef.current) inputRef.current.value = ''
  }

  const processFile = async (file: File) => {
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

    await onUpload(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-3xl transition-colors ${
          dragActive 
            ? 'border-saffron bg-saffron/10' 
            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
        } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
        
        <AnimatePresence mode="popLayout">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
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
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center p-4"
            >
              <span className="text-3xl mb-2 opacity-80">📸</span>
              <p className="font-sans text-ivory text-sm">
                <span className="text-saffron font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="font-sans text-ivory/40 text-xs mt-1">
                JPG, PNG, WebP up to {MAX_SIZE_MB}MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {localError && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          className="text-rose-400 text-xs font-sans mt-1 px-2"
        >
          {localError}
        </motion.p>
      )}
    </div>
  )
}
