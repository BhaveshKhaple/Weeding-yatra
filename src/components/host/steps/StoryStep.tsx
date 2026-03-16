/**
 * Step 3 — Your Wedding Story
 * Captures the host's welcome message / description. This is the final step before submission.
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
  data:     Pick<ListingFormData, 'description'>
  onChange: (field: keyof ListingFormData, value: string) => void
  isEditing: boolean
}

export function StoryStep({ data, onChange, isEditing }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div variants={fieldVariants} className="text-center mb-2">
        <span className="text-4xl">✍️</span>
        <p className="font-sans text-ivory/60 text-sm mt-2 tracking-wide uppercase">
          Step 3 of 3
        </p>
        <h2 className="font-display text-3xl text-ivory mt-1">Your Welcome Message</h2>
        <p className="font-sans text-ivory/60 text-sm mt-2 max-w-sm mx-auto">
          Share your story. Tell travellers what makes your celebration unique and what they can expect.
        </p>
      </motion.div>

      <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
        <label className="font-sans text-ivory/70 text-sm font-medium">
          Description
          <span className="text-ivory/40 font-normal ml-2">(optional but recommended)</span>
        </label>
        <textarea
          id="description"
          rows={6}
          value={data.description}
          onChange={e => onChange('description', e.target.value)}
          placeholder="We are thrilled to invite fellow travellers to witness our union of two families, two cultures, and two hearts coming together in the heart of Rajasthan..."
          className="input-dark resize-none"
        />
        <p className="font-sans text-ivory/30 text-xs text-right">
          {data.description.length} / 1000 characters
        </p>
      </motion.div>

      <motion.div variants={fieldVariants}>
        <div className="bg-saffron/10 border border-saffron/20 rounded-xl p-4">
          <p className="font-sans text-saffron/80 text-xs">
            🎉 You're almost there! Clicking{' '}
            <strong>{isEditing ? 'Save Changes' : 'Publish Listing'}</strong> will make
            your wedding instantly visible to travellers in the public directory.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
