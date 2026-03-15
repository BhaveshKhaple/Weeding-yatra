/**
 * GSAP + ScrollTrigger singleton.
 * Import from this file everywhere — ensures ScrollTrigger is registered exactly once.
 *
 * Usage:
 *   import { gsap, ScrollTrigger } from '@/lib/gsap'
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
