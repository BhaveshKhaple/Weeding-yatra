/**
 * EventList — The container for the host's chronologically stacked events.
 * Renders an empty state gracefully. Opens Add/Edit modals via hook actions.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useWeddingEvents } from '../../../hooks/useWeddingEvents'
import { EventListItem } from './EventListItem'
import { EventFormModal } from './EventFormModal'
import type { WeddingEvent } from '../../../lib/types'

interface Props {
  listingId: string
}

export function EventList({ listingId }: Props) {
  const {
    events,
    fetching,
    mutating,
    error,
    addEvent,
    updateEvent,
    deleteEvent
  } = useWeddingEvents(listingId)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | undefined>(undefined)

  // Handlers
  const handleAddNew = () => {
    setEditingEvent(undefined)
    setModalOpen(true)
  }

  const handleEdit = (event: WeddingEvent) => {
    setEditingEvent(event)
    setModalOpen(true)
  }

  const handleSave = async (formData: any) => {
    if (editingEvent) {
      return await updateEvent(editingEvent.id, formData)
    } else {
      return await addEvent(formData)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-ivory">Wedding Timeline</h2>
          <p className="font-sans text-ivory/50 text-sm mt-1">
            Build your chronological narrative by adding events.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          disabled={mutating}
          className="btn-outline border-white/20 text-ivory hover:bg-white/10 hover:border-white/40 disabled:opacity-50"
        >
          + Add Event
        </button>
      </div>

      {error && (
        <p className="font-sans text-rose-400 text-sm bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">
          ⚠️ {error}
        </p>
      )}

      {/* Main List Area */}
      {fetching ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-24 bg-white/5 rounded-2xl w-full" />
          <div className="h-24 bg-white/5 rounded-2xl w-full" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-10 flex flex-col items-center text-center gap-4">
          <span className="text-4xl opacity-60">⏳</span>
          <div>
            <p className="font-sans text-ivory text-base font-medium">No events added yet</p>
            <p className="font-sans text-ivory/50 text-sm max-w-sm mt-1">
              Add ceremonies, receptions, or casual meetups to help travellers plan their participation.
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="btn-ghost text-saffron hover:bg-saffron/10 font-semibold"
          >
            Create first event →
          </button>
        </div>
      ) : (
        <motion.ul
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="visible"
          className="flex flex-col relative"
        >
          <AnimatePresence mode="popLayout">
            {events.map((ev, index) => (
              <div key={ev.id} className="relative">
                <EventListItem
                  event={ev}
                  onEdit={handleEdit}
                  onDelete={deleteEvent}
                  mutating={mutating}
                />
                
                {/* Visual Timeline Connector */}
                {index !== events.length - 1 && (
                  <div className="absolute left-6 md:left-[140px] top-full h-6 w-px bg-white/10 -ml-px z-0" />
                )}
                <div className="h-6" /> {/* Spacer matched to connector */}
              </div>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <EventFormModal
            initialData={editingEvent}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            mutating={mutating}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
