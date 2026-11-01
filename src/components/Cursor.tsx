import { useEffect, useRef, useState } from 'react'
import { gsap, isFinePointer } from '../lib/motion'

/**
 * Two-part cursor: a precise dot + a lagging ring that grows into a labelled disc
 * over elements with [data-cursor="Label"].
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(() => isFinePointer())

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })
    let shown = false

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.4 })
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button')
      if (!t) {
        setLabel('')
        gsap.to(ring.current, { scale: 0.42, backgroundColor: 'rgba(255,77,31,0)', borderColor: 'rgba(237,232,223,0.35)', duration: 0.5 })
        gsap.to(dot.current, { scale: 1, duration: 0.3 })
        return
      }
      const l = t.dataset.cursor ?? ''
      setLabel(l)
      if (l) {
        gsap.to(ring.current, { scale: 1, backgroundColor: 'rgba(255,77,31,1)', borderColor: 'rgba(255,77,31,1)', duration: 0.5 })
        gsap.to(dot.current, { scale: 0, duration: 0.3 })
      } else {
        gsap.to(ring.current, { scale: 0.7, backgroundColor: 'rgba(237,232,223,0.06)', borderColor: 'rgba(237,232,223,0.6)', duration: 0.5 })
        gsap.to(dot.current, { scale: 0.5, duration: 0.3 })
      }
    }
    const down = () => gsap.to(ring.current, { scale: '-=0.1', duration: 0.2 })
    const up = () => gsap.to(ring.current, { scale: '+=0.1', duration: 0.3 })
    const leave = () => { shown = false; gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 }) }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-12 -mt-12 flex h-24 w-24 items-center justify-center rounded-full border-[2.4px] opacity-0"
        style={{ borderColor: 'rgba(237,232,223,0.35)', transform: 'scale(0.42)' }}
      >
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">{label}</span>
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-ember opacity-0"
      />
    </>
  )
}
