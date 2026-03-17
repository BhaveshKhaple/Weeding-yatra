import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Create a singleton so it can be managed
let lenis: Lenis | null = null

export const useSmoothScroll = (isImmersivePage: boolean = false) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Only instantiate Lenis on immersive public pages + if reduced motion isn't true
    if (!isImmersivePage || prefersReducedMotion) {
      if (lenis) {
        lenis.destroy()
        lenis = null
      }
      return
    }

    if (!lenis) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })

      // Sync Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)

      // Ensure fresh calculation of ScrollTrigger positions
      setTimeout(() => ScrollTrigger.refresh(), 100)
    }

    return () => {
      // Clean up when unmounting immersive component
      if (lenis) {
        lenis.destroy()
        lenis = null
      }
      gsap.ticker.remove((time) => lenis?.raf(time * 1000))
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isImmersivePage])

  return lenis
}
