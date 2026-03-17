/**
 * EventsTimeline — The chronological events list for the public wedding detail page.
 * Each event item is revealed with a GSAP ScrollTrigger stagger as it enters the viewport.
 */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { WeddingEvent } from '../../lib/types'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  events: WeddingEvent[]
}

function formatEventTime(timeStr: string) {
  const [hhStr, mmStr] = timeStr.split(':')
  let h = parseInt(hhStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${mmStr} ${ampm}`
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function EventsTimeline({ events }: Props) {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const itemsRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      if (titleRef.current) { titleRef.current.style.opacity = '1' }
      const items = itemsRef.current?.querySelectorAll<HTMLElement>('.event-item')
      if (items) {
        items.forEach(item => { item.style.opacity = '1' })
      }
      return
    }

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      )

      // Stagger each event item
      const items = itemsRef.current?.querySelectorAll('.event-item')
      if (items && items.length > 0) {
        gsap.fromTo(items,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0,
            duration: 0.7, ease: 'power2.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: itemsRef.current,
              start: 'top 75%',
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [events])

  if (events.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 max-w-4xl mx-auto"
    >
      {/* Section heading */}
      <h2
        ref={titleRef}
        className="font-display text-4xl md:text-5xl text-ivory mb-16 text-center opacity-0"
      >
        Wedding <span className="text-saffron">Events</span>
      </h2>

      {/* Timeline */}
      <div ref={itemsRef} className="relative flex flex-col gap-0">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-16 top-4 bottom-4 w-px bg-white/10" />

        {events.map((event) => (
          <div
            key={event.id}
            className="event-item opacity-0 relative flex items-start gap-6 md:gap-12 mb-12 pl-16 md:pl-36"
          >
            {/* Dot */}
            <div className="absolute left-4 md:left-14 top-2 w-4 h-4 rounded-full bg-saffron border-2 border-charcoal shadow-lg shadow-saffron/30 z-10 -translate-x-1/2" />

            {/* Date/time aside */}
            <div className="absolute left-0 top-0 w-12 md:w-24 text-right pr-8 hidden md:flex flex-col items-end">
              <span className="font-sans text-saffron text-xs font-semibold uppercase tracking-wider leading-tight">
                {formatEventDate(event.event_date).split(',')[0]}
              </span>
              <span className="font-sans text-ivory/40 text-xs">
                {formatEventTime(event.event_time)}
              </span>
            </div>

            {/* Content card */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-saffron/30 transition-colors group">
              {/* Mobile date */}
              <div className="flex items-center justify-between mb-2 md:hidden">
                <span className="font-sans text-saffron text-xs font-semibold uppercase tracking-wider">
                  {formatEventDate(event.event_date)}
                </span>
                <span className="font-sans text-ivory/40 text-xs">
                  {formatEventTime(event.event_time)}
                </span>
              </div>

              <h3 className="font-display text-2xl text-ivory mb-1 group-hover:text-saffron transition-colors">
                {event.name}
              </h3>
              <p className="font-sans text-ivory/50 text-sm flex items-center gap-1.5 mb-2">
                <span>📍</span> {event.venue}
              </p>
              {event.description && (
                <p className="font-sans text-ivory/60 text-sm leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
