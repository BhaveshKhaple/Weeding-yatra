/**
 * EventFormModal — Modal for Adding or Editing an event.
 * Collects name, date, time, venue, and description.
 */

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { WeddingEvent } from '../../../lib/types'
import type { EventFormData } from '../../../hooks/useWeddingEvents'

interface Props {
  initialData?: WeddingEvent
  onClose: () => void
  onSave: (data: EventFormData) => Promise<boolean>
  mutating: boolean
}

export function EventFormModal({ initialData, onClose, onSave, mutating }: Props) {
  const isEditing = !!initialData

  const [form, setForm] = useState<EventFormData>({
    name:        initialData?.name        || '',
    event_date:  initialData?.event_date  || '',
    event_time:  initialData?.event_time  || '', // Expected format HH:MM
    venue:       initialData?.venue       || '',
    description: initialData?.description || ''
  })

  // Format incoming time from backend (HH:MM:SS) to match input type="time" (HH:MM)
  useEffect(() => {
    if (initialData?.event_time) {
      const [hh, mm] = initialData.event_time.split(':')
      setForm(f => ({ ...f, event_time: `${hh}:${mm}` }))
    }
  }, [initialData])

  const isValid = form.name.trim() && form.event_date && form.event_time && form.venue.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || mutating) return

    // Ensure seconds are appended for Supabase TIME column compatibility if needed.
    // However Supabase usually accepts HH:MM. Just let it be.
    const payload: EventFormData = { ...form }

    const success = await onSave(payload)
    if (success) {
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{ opacity: 0, scale: 0.95,    y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-charcoal border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide"
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="font-display text-3xl text-ivory">
              {isEditing ? 'Edit Event' : 'Add New Event'}
            </h2>
            <button
              onClick={onClose}
              disabled={mutating}
              className="font-sans text-ivory/40 hover:text-ivory text-xl transition-colors disabled:opacity-30"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-ivory/70 text-sm font-medium">Event Name *</label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Haldi Ceremony"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-dark"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-ivory/70 text-sm font-medium">Date *</label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
                  className="input-dark"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-ivory/70 text-sm font-medium">Time *</label>
                <input
                  type="time"
                  value={form.event_time}
                  onChange={e => setForm(f => ({ ...f, event_time: e.target.value }))}
                  className="input-dark"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-ivory/70 text-sm font-medium">Venue / Location *</label>
              <input
                type="text"
                placeholder="e.g. Rambagh Palace Gardens"
                value={form.venue}
                onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                className="input-dark"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-ivory/70 text-sm font-medium">
                Description <span className="text-ivory/40 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe what travellers should expect, dress code, etc."
                value={form.description || ''}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="input-dark resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={mutating}
                className="btn-ghost text-ivory/60 hover:text-ivory disabled:opacity-30"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || mutating}
                className="btn-primary min-w-[120px] disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {mutating ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Saving…
                  </>
                ) : (
                  isEditing ? 'Save Changes' : 'Add Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}
