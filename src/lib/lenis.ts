import { useEffect } from 'react'
import Lenis from 'lenis'

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
        lerp: 0.1, // Controls the smoothing. Lower = smoother
        smoothWheel: true,
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
    }
  }, [isImmersivePage])

  return lenis
}
