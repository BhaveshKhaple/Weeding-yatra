/**
 * Step 2 — Date & Venue
 * Captures wedding date, city, and venue name.
 */

import { motion, Variants } from 'framer-motion'
import type { ListingFormData } from '../../../hooks/useWeddingListing'

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
  data:     Pick<ListingFormData, 'wedding_date' | 'city' | 'venue_name'>
  onChange: (field: keyof ListingFormData, value: string) => void
}

export function VenueDateStep({ data, onChange }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div variants={fieldVariants} className="text-center mb-2">
        <span className="text-4xl">🏛️</span>
        <p className="font-sans text-ivory/60 text-sm mt-2 tracking-wide uppercase">
          Step 2 of 3
        </p>
        <h2 className="font-display text-3xl text-ivory mt-1">Date & Venue</h2>
        <p className="font-sans text-ivory/60 text-sm mt-2 max-w-xs mx-auto">
          When and where will the celebration take place? Travellers will use this to plan their journey.
        </p>
      </motion.div>

      <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
        <label className="font-sans text-ivory/70 text-sm font-medium">
          Wedding Date <span className="text-saffron">*</span>
        </label>
        <input
          id="wedding_date"
          type="date"
          value={data.wedding_date}
          onChange={e => onChange('wedding_date', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="input-dark"
        />
      </motion.div>

      <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
        <label className="font-sans text-ivory/70 text-sm font-medium">
          City <span className="text-saffron">*</span>
        </label>
        <input
          id="city"
          type="text"
          value={data.city}
          onChange={e => onChange('city', e.target.value)}
          placeholder="e.g. Jaipur, Rajasthan"
          className="input-dark"
        />
      </motion.div>

      <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
        <label className="font-sans text-ivory/70 text-sm font-medium">
          Venue Name <span className="text-saffron">*</span>
        </label>
        <input
          id="venue_name"
          type="text"
          value={data.venue_name}
          onChange={e => onChange('venue_name', e.target.value)}
          placeholder="e.g. Rambagh Palace"
          className="input-dark"
        />
      </motion.div>
    </motion.div>
  )
}
