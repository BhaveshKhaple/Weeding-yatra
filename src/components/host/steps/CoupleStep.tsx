/**
 * Step 1 — Couple Details
 * Captures bride & groom names with staggered Framer Motion field entries.
 */

import { motion, Variants } from 'framer-motion'
import type { ListingFormData } from '../../../hooks/useWeddingListing'

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const fieldVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  data:     Pick<ListingFormData, 'bride_name' | 'groom_name'>
  onChange: (field: keyof ListingFormData, value: string) => void
}

export function CoupleStep({ data, onChange }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div variants={fieldVariants} className="text-center mb-2">
        <span className="text-4xl">🌸</span>
        <p className="font-sans text-ivory/60 text-sm mt-2 tracking-wide uppercase">
          Step 1 of 3
        </p>
        <h2 className="font-display text-3xl text-ivory mt-1">The Happy Couple</h2>
        <p className="font-sans text-ivory/60 text-sm mt-2 max-w-xs mx-auto">
          Tell us who is tying the knot. These names will appear on your public wedding listing.
        </p>
      </motion.div>

      <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
        <label className="font-sans text-ivory/70 text-sm font-medium">
          Bride's Name <span className="text-saffron">*</span>
        </label>
        <input
          id="bride_name"
          type="text"
          value={data.bride_name}
          onChange={e => onChange('bride_name', e.target.value)}
          placeholder="e.g. Priya Sharma"
          className="input-dark"
          autoFocus
        />
      </motion.div>

      <motion.div variants={fieldVariants}>
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-saffron/20" />
          <span className="font-display text-saffron text-xl italic">&amp;</span>
          <div className="flex-1 h-px bg-saffron/20" />
        </div>
      </motion.div>

      <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
        <label className="font-sans text-ivory/70 text-sm font-medium">
          Groom's Name <span className="text-saffron">*</span>
        </label>
        <input
          id="groom_name"
          type="text"
          value={data.groom_name}
          onChange={e => onChange('groom_name', e.target.value)}
          placeholder="e.g. Arjun Mehta"
          className="input-dark"
        />
      </motion.div>
    </motion.div>
  )
}
