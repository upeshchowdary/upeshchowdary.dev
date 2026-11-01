import { useEffect, useRef } from 'react'
import { gsap, scrollState, prefersReducedMotion } from '../lib/motion'

/** Infinite marquee whose speed and skew react to scroll velocity. */
export default function Marquee({ items, reverse = false, className = '' }: { items: string[]; reverse?: boolean; className?: string }) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el || prefersReducedMotion()) return
    let x = 0
    let skew = 0
    const dir = reverse ? 1 : -1
    const tick = () => {
      const half = el.scrollWidth / 2
      const v = scrollState.velocity
      x += dir * (0.6 + Math.min(Math.abs(v) * 0.25, 14))
      if (x <= -half) x += half
      if (x >= 0) x -= half
      skew += (Math.max(-8, Math.min(8, v * -0.35)) - skew) * 0.1
      el.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`
    }
    let on = false
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { gsap.ticker.add(tick); on = true }
      else if (!e.isIntersecting && on) { gsap.ticker.remove(tick); on = false }
    })
    io.observe(el)
    return () => { io.disconnect(); gsap.ticker.remove(tick) }
  }, [reverse])

  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <div ref={track} className="inline-flex will-change-transform">
        {row.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-[0.35em]">{t}</span>
            <span className="text-ember">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
