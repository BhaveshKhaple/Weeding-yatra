/**
 * Lenis smooth scroll singleton.
 *
 * Usage:
 *   import { createLenis, destroyLenis } from '@/lib/lenis'
 *
 *   // In an immersive page component:
 *   useEffect(() => {
 *     const lenis = createLenis()
 *     return () => destroyLenis()
 *   }, [])
 *
 * NOTE: Only initialise Lenis on public immersive pages (Homepage, Listing detail).
 * Never initialise inside the authenticated dashboard — it stays fast/native.
 */
import Lenis from 'lenis'
import { gsap } from './gsap'

let lenisInstance: Lenis | null = null

export function createLenis(): Lenis {
  // Return existing instance if already created (singleton)
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
  })

  // Sync Lenis RAF with GSAP ticker — critical for ScrollTrigger compatibility
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  return lenisInstance
}

export function destroyLenis(): void {
  if (!lenisInstance) return
  lenisInstance.destroy()
  lenisInstance = null
}

export function getLenis(): Lenis | null {
  return lenisInstance
}
