import { gsap } from '../lib/motion'

/** Mutable state read every frame by the particle field; tweened by sections on scroll. */
export const fieldState = {
  from: 0, // shape index morphing from
  to: 0, // shape index morphing to
  t: 1, // 0..1 morph progress
  x: 0,
  y: 0,
  scale: 1,
  opacity: 0, // fades in after the preloader
  spin: 1,
  ember: 0.1, // share of ember-coloured particles
}

export type FieldConfig = {
  shape: number
  x?: number
  y?: number
  scale?: number
  opacity?: number
  spin?: number
  ember?: number
}

let morphTween: gsap.core.Tween | null = null

export function applyField(cfg: FieldConfig) {
  const { shape, ...rest } = cfg
  if (shape !== fieldState.to) {
    morphTween?.kill()
    // continue from whichever shape is currently dominant
    fieldState.from = fieldState.t < 0.5 ? fieldState.from : fieldState.to
    fieldState.to = shape
    fieldState.t = 0
    morphTween = gsap.to(fieldState, { t: 1, duration: 2.4, ease: 'power3.inOut' })
  }
  gsap.to(fieldState, { ...rest, duration: 1.9, ease: 'power3.inOut', overwrite: 'auto' })
}
