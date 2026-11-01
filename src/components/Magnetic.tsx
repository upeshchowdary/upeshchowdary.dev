import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, isFinePointer } from '../lib/motion'

/** Pulls its child toward the pointer; inner content travels further for depth. */
export default function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el || !isFinePointer()) return
    const target = el.firstElementChild as HTMLElement | null
    if (!target) return
    const inner = target.querySelector<HTMLElement>('[data-magnetic-inner]')
    const xTo = gsap.quickTo(target, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(target, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.4)' })
    const ixTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.4)' }) : null
    const iyTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.4)' }) : null

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2)
      const y = e.clientY - (r.top + r.height / 2)
      xTo(x * strength); yTo(y * strength)
      ixTo?.(x * strength * 0.5); iyTo?.(y * strength * 0.5)
    }
    const leave = () => { xTo(0); yTo(0); ixTo?.(0); iyTo?.(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])

  return (
    <div ref={wrap} className={`inline-block p-3 -m-3 ${className}`}>
      {children}
    </div>
  )
}
