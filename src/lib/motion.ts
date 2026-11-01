import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP)
gsap.defaults({ ease: 'expo.out', duration: 1.2 })

export { gsap, ScrollTrigger, SplitText, useGSAP }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

let lenis: Lenis | null = null

export function initLenis() {
  if (lenis) return lenis
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.95,
    smoothWheel: !prefersReducedMotion(),
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis?.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: 'smooth' })
}

// global scroll velocity (px/frame-ish), smoothed — used by marquees and the particle field
export const scrollState = { velocity: 0, progress: 0 }
