/**
 * EventListItem — Individual rendering of an event in the timeline list.
 * Animated via Framer Motion layout to gracefully enter and slide up.
 */

import { motion } from 'framer-motion'
import type { WeddingEvent } from '../../../lib/types'

interface Props {
  event: WeddingEvent
  onEdit: (event: WeddingEvent) => void
  onDelete: (id: string) => void
  mutating: boolean
}

export function EventListItem({ event, onEdit, onDelete, mutating }: Props) {
  // Format Date + Time visually
  const dateObj = new Date(`${event.event_date}T00:00:00`)
  const dayStr = dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
  
  // Convert HH:MM:SS to HH:MM AM/PM
  // time format is likely local to India but displayed as typed, using string slice is simpler:
  const [hhStr, mmStr] = event.event_time.split(':')
  let h = parseInt(hhStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  const timeStr = `${h}:${mmStr} ${ampm}`

  return (
    <motion.li
      layout
      variants={{
        hidden:  { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        removed: { opacity: 0, x: 30, transition: { duration: 0.3 } }
      }}
      initial="hidden"
      animate="visible"
      exit="removed"
      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center relative overflow-hidden group hover:border-saffron/30 transition-colors"
    >
      {/* Date/Time Left Column */}
      <div className="flex flex-col items-start md:items-end md:w-32 flex-shrink-0">
        <span className="font-sans text-saffron text-sm font-semibold uppercase tracking-wider">
          {dayStr}
        </span>
        <span className="font-sans text-ivory/60 text-xs">
          {timeStr}
        </span>
      </div>

      {/* Decorative vertical divider (screens > md) */}
      <div className="hidden md:block w-px h-10 bg-white/10 mx-2" />

      {/* Content Center Column */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-display text-2xl text-ivory mb-1">
          {event.name}
        </h3>
        <p className="font-sans text-ivory/50 text-sm flex items-center gap-1.5 mb-2">
          <span className="text-xs">📍</span> {event.venue}
        </p>
        {event.description && (
          <p className="font-sans text-ivory/70 text-sm line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>

      {/* Actions Right Column */}
      <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto justify-end border-t border-white/5 md:border-t-0 pt-3 md:pt-0">
        <button
          onClick={() => onEdit(event)}
          disabled={mutating}
          className="btn-ghost text-ivory/40 hover:text-saffron disabled:opacity-30"
          aria-label="Edit event"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${event.name}?`)) {
              onDelete(event.id)
            }
          }}
          disabled={mutating}
          className="btn-ghost text-ivory/40 hover:text-rose-400 disabled:opacity-30"
          aria-label="Delete event"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Left indicator accent on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-saffron opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.li>
  )
}
