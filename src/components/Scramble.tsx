import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'

/** Mono label that decodes itself on first view and re-scrambles on hover. */
export default function Scramble({ text, className = '', as = 'span', onView = true }: { text: string; className?: string; as?: 'span' | 'p' | 'div'; onView?: boolean; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const Tag = as

  useGSAP(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const run = () => gsap.to(el, { duration: 1.1, scrambleText: { text, chars: '01·/#_<>+-', speed: 0.6, revealDelay: 0.15 }, ease: 'none' })
    if (onView) {
      gsap.set(el, { opacity: 0 })
      gsap.to(el, {
        opacity: 1, duration: 0.01,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true, onEnter: run },
      })
    }
    el.addEventListener('pointerenter', run)
    return () => el.removeEventListener('pointerenter', run)
  }, { scope: ref })

  return (
    <Tag ref={ref as never} className={className}>
      {text}
    </Tag>
  )
}
