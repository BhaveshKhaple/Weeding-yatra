/**
 * StorySection — The host's welcome message / description section.
 * Uses GSAP ScrollTrigger to reveal the block word-by-word style on scroll entry.
 */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  brideName:   string
  groomName:   string
  description: string | null
}

export function StorySection({ brideName, groomName, description }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const textRef    = useRef<HTMLParagraphElement>(null)
  const iconRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Icon floats in
      gsap.fromTo(iconRef.current,
        { opacity: 0, scale: 0.5, rotate: -20 },
        {
          opacity: 1, scale: 1, rotate: 0,
          duration: 0.8, ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      )

      // Title slides up
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      )

      // Text fades in slightly after
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'power2.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 max-w-3xl mx-auto text-center"
    >
      <div ref={iconRef} className="text-5xl mb-6 opacity-0">🕌</div>

      <h2
        ref={titleRef}
        className="font-display text-4xl md:text-5xl text-ivory mb-8 opacity-0 leading-tight"
      >
        A message from <span className="text-saffron">{brideName}</span> &{' '}
        <span className="text-saffron">{groomName}</span>
      </h2>

      <p
        ref={textRef}
        className="font-sans text-ivory/70 text-lg leading-relaxed opacity-0"
      >
        {description || (
          <em className="text-ivory/40">
            The couple hasn't written a welcome message yet. Check back soon!
          </em>
        )}
      </p>
    </section>
  )
}
