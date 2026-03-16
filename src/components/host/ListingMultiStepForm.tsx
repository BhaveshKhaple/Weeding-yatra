/**
 * ListingMultiStepForm — the centrepiece of Plan 02-03.
 *
 * Architecture:
 *  - 3 steps: Couple → Venue/Date → Story
 *  - AnimatePresence (mode="popLayout") + custom variants produce a smooth
 *    directional slide between steps (forward = slide left, back = slide right)
 *  - Step sub-components handle their own stagger animations
 *  - Calls useWeddingListing.saveListing() on final submit
 *  - Animated success state congratulates the host after publish
 */

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useState } from 'react'
import { CoupleStep }   from './steps/CoupleStep'
import { VenueDateStep } from './steps/VenueDateStep'
import { StoryStep }    from './steps/StoryStep'
import { CoverPhotoStep } from './steps/CoverPhotoStep'
import type { ListingFormData } from '../../hooks/useWeddingListing'
import type { WeddingListing } from '../../lib/types'

// ─── Slide variants ───────────────────────────────────────────────────────────

const makeSlideVariants = (direction: 1 | -1): Variants => ({
  initial: { x: direction * 60, opacity: 0 },
  animate: { x: 0,              opacity: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit:    { x: direction * -60, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
})

// ─── Step config ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4

// ─── Validation per step ──────────────────────────────────────────────────────

function isStepValid(step: number, form: ListingFormData): boolean {
  switch (step) {
    case 1: return form.bride_name.trim().length > 0 && form.groom_name.trim().length > 0
    case 2: return form.wedding_date.length > 0 && form.city.trim().length > 0 && form.venue_name.trim().length > 0
    case 3: return true  // description is optional
    case 4: return true  // cover photo is optional
    default: return false
  }
}

// ─── Progress Dots ────────────────────────────────────────────────────────────

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map(step => (
        <motion.div
          key={step}
          animate={{
            width:           step === current ? 24 : 8,
            backgroundColor: step <= current ? '#FF6B00' : 'rgba(255,255,255,0.2)',
          }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  )
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessState({ listing, isEditing }: { listing: WeddingListing; isEditing: boolean }) {
  const confettiItems = ['🌸', '🎊', '✨', '💐', '🎉', '🪷', '💍', '🌺']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex flex-col items-center text-center gap-6 py-8"
    >
      {/* Floating confetti */}
      <div className="relative w-24 h-24 mb-2">
        {confettiItems.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl"
            style={{ left: '50%', top: '50%' }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x:       Math.cos((i / confettiItems.length) * Math.PI * 2) * 40,
              y:       Math.sin((i / confettiItems.length) * Math.PI * 2) * 40,
              opacity: [0, 1, 1, 0],
              scale:   [0, 1.3, 1],
            }}
            transition={{ duration: 1.2, delay: i * 0.08, ease: 'easeOut' }}
          >
            {emoji}
          </motion.span>
        ))}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-5xl"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          💍
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="font-display text-4xl text-ivory mb-2">
          {isEditing ? 'Changes Saved!' : 'You\'re Live! 🎉'}
        </h2>
        <p className="font-sans text-ivory/60 text-sm max-w-xs mx-auto">
          {isEditing
            ? 'Your listing has been updated and is live on the directory.'
            : `${listing.bride_name} & ${listing.groom_name}'s wedding is now visible to travellers around the world.`
          }
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="bg-saffron/10 border border-saffron/30 rounded-2xl px-6 py-4 flex items-center gap-3"
      >
        <span className="text-saffron text-2xl">🔗</span>
        <div className="text-left">
          <p className="font-sans text-ivory/50 text-xs uppercase tracking-wide">Your listing URL</p>
          <p className="font-sans text-saffron text-sm font-medium">/weddings/{listing.slug}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  existingListing?: WeddingListing | null
  onSave: (data: ListingFormData) => Promise<boolean>
  mutStatus: 'idle' | 'loading' | 'success' | 'error'
  mutError: string | null
}

const EMPTY_FORM: ListingFormData = {
  bride_name:   '',
  groom_name:   '',
  wedding_date: '',
  city:         '',
  venue_name:   '',
  description:  '',
  cover_photo_url: '',
}

export function ListingMultiStepForm({ existingListing, onSave, mutStatus, mutError }: Props) {
  const isEditing = !!existingListing

  const [form, setForm] = useState<ListingFormData>(() =>
    existingListing
      ? {
          bride_name:   existingListing.bride_name,
          groom_name:   existingListing.groom_name,
          wedding_date: existingListing.wedding_date,
          city:         existingListing.city,
          venue_name:   existingListing.venue_name,
          description:  existingListing.description ?? '',
          cover_photo_url: existingListing.cover_photo_url ?? '',
        }
      : EMPTY_FORM
  )

  const [step, setStep]           = useState(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [submitted, setSubmitted] = useState(false)

  function updateField(field: keyof ListingFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function goNext() {
    if (step < TOTAL_STEPS && isStepValid(step, form)) {
      setDirection(1)
      setStep(s => s + 1)
    }
  }

  function goBack() {
    if (step > 1) {
      setDirection(-1)
      setStep(s => s - 1)
    }
  }

  async function handleSubmit() {
    const ok = await onSave(form)
    if (ok) setSubmitted(true)
  }

  const slideVariants = makeSlideVariants(direction)
  const stepKey = `step-${step}`

  // ── Render success ─────────────────────────────────────────────────────────

  if (submitted && mutStatus === 'success' && existingListing) {
    return <SuccessState listing={existingListing} isEditing={isEditing} />
  }

  // Use a synthetic listing for the success state when we don't have updated listing yet
  // (the hook refetches after upsert and updates the parent's existingListing)

  return (
    <div className="flex flex-col">
      <ProgressDots current={step} total={TOTAL_STEPS} />

      {/* Step area */}
      <div className="relative overflow-hidden min-h-[420px]">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={stepKey}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {step === 1 && (
              <CoupleStep
                data={{ bride_name: form.bride_name, groom_name: form.groom_name }}
                onChange={updateField}
              />
            )}
            {step === 2 && (
              <VenueDateStep
                data={{ wedding_date: form.wedding_date, city: form.city, venue_name: form.venue_name }}
                onChange={updateField}
              />
            )}
            {step === 3 && (
              <StoryStep
                data={{ description: form.description }}
                onChange={updateField}
                isEditing={isEditing}
              />
            )}
            {step === 4 && (
              <CoverPhotoStep
                data={{ cover_photo_url: form.cover_photo_url }}
                onChange={updateField}
                isEditing={isEditing}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error message */}
      {mutError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-sans text-rose-400 text-sm text-center mt-2"
        >
          ⚠️ {mutError}
        </motion.p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <button
          onClick={goBack}
          disabled={step === 1}
          className="font-sans text-ivory/50 text-sm hover:text-ivory transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
        >
          ← Back
        </button>

        {step < TOTAL_STEPS ? (
          <motion.button
            onClick={goNext}
            disabled={!isStepValid(step, form)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary disabled:opacity-40 disabled:pointer-events-none"
          >
            Continue →
          </motion.button>
        ) : (
          <motion.button
            onClick={handleSubmit}
            disabled={mutStatus === 'loading'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary disabled:opacity-40 min-w-[140px] flex items-center justify-center gap-2"
          >
            {mutStatus === 'loading' ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Saving…
              </>
            ) : isEditing ? (
              '💾 Save Changes'
            ) : (
              '🚀 Publish Listing'
            )}
          </motion.button>
        )}
      </div>
    </div>
  )
}
