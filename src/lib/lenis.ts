import { useEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Create a singleton so it can be managed
let lenis: Lenis | null = null

export const useSmoothScroll = (isImmersivePage: boolean = false) => {
  useEffect(() => {
    // Only instantiate Lenis on immersive public pages
    if (!isImmersivePage) {
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
        touchMultiplier: 2,
        infinite: false,
      })

      const raf = (time: number) => {
        lenis?.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    return () => {
      // Clean up when unmounting immersive component
      if (lenis) {
        lenis.destroy()
        lenis = null
      }
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isImmersivePage])

  return lenis
}
