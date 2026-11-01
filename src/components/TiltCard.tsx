import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, isFinePointer } from '../lib/motion'

/** 3D perspective tilt with a moving specular sheen. */
export default function TiltCard({ children, className = '', max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const sheen = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer()) return
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3' })
    gsap.set(el, { transformPerspective: 1100 })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      ry((px - 0.5) * max * 2)
      rx(-(py - 0.5) * max * 2)
      if (sheen.current) {
        sheen.current.style.background = `radial-gradient(600px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.16), transparent 45%)`
        sheen.current.style.opacity = '1'
      }
    }
    const leave = () => {
      rx(0); ry(0)
      if (sheen.current) sheen.current.style.opacity = '0'
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [max])

  return (
    <div ref={ref} className={`relative will-change-transform [transform-style:preserve-3d] ${className}`}>
      {children}
      <div ref={sheen} aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-500" />
    </div>
  )
}
