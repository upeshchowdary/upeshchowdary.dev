import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'

export default function Counter({ value, decimals = 0, suffix = '', className = '' }: { value: number; decimals?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const fmt = (v: number) => v.toFixed(decimals) + suffix

  useGSAP(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const o = { v: 0 }
    el.textContent = fmt(0)
    gsap.to(o, {
      v: value,
      duration: 2.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = fmt(o.v) },
    })
  }, { scope: ref })

  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  )
}
