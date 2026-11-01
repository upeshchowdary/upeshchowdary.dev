import { useEffect, useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'

/** Full-bleed name set to exactly the container width; letters rise as the page ends. */
export default function Wordmark({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLDivElement>(null)

  // fit-to-width
  useEffect(() => {
    const w = wrap.current
    const l = line.current
    if (!w || !l) return
    const fit = () => {
      l.style.fontSize = '100px'
      const ratio = w.clientWidth / l.scrollWidth
      l.style.fontSize = `${100 * ratio * 0.995}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(w)
    return () => ro.disconnect()
  }, [])

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo('[data-wm-char]', { yPercent: 105 }, {
      yPercent: 0, ease: 'none', stagger: 0.04,
      scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    })
  }, { scope: wrap })

  return (
    <div ref={wrap} className="relative w-full overflow-hidden" aria-hidden>
      <div ref={line} className="display flex w-max whitespace-pre leading-[0.78] tracking-[-0.05em]">
        {text.split('').map((c, i) => (
          <span
            key={i}
            data-wm-char
            className="inline-block bg-gradient-to-b from-bone via-bone/80 to-bone/10 bg-clip-text pb-[0.06em] text-transparent transition-[color] duration-500 hover:text-ember"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}
