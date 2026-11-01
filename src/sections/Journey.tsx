import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { useField } from '../lib/useField'
import { journey } from '../content/data'
import Reveal from '../components/Reveal'

export default function Journey() {
  const root = useRef<HTMLElement>(null)
  useField(root, { shape: 5, x: 2.6, y: 0, scale: 0.7, opacity: 0.4, spin: 0.08, ember: 0.18 })

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo('[data-spine]', { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 60%', scrub: 0.5 },
    })
    gsap.utils.toArray<HTMLElement>('[data-step]').forEach((el) => {
      gsap.from(el, { x: -30, autoAlpha: 0, duration: 1.2, scrollTrigger: { trigger: el, start: 'top 82%' } })
      gsap.fromTo(el.querySelector('[data-node]'), { scale: 0, backgroundColor: '#2A2925' }, {
        scale: 1, backgroundColor: '#FF4D1F', duration: 0.6, ease: 'back.out(3)',
        scrollTrigger: { trigger: el, start: 'top 65%' },
      })
    })
  }, { scope: root })

  return (
    <section ref={root} id="journey" className="relative px-[var(--pad)] py-[clamp(6rem,14vh,10rem)]">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-[14vh]">
            <div className="flex items-center gap-4">
              <span className="label text-ember">REC-07</span>
              <span className="h-px w-10 bg-line" />
              <span className="label">Journey</span>
            </div>
            <Reveal as="h2" className="display mt-8 text-[clamp(3rem,6vw,6.5rem)]">
              The <span className="serif-i font-normal tracking-normal text-ember">log.</span>
            </Reveal>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-muted">From Edupugallu to a national final — every entry, timestamped.</p>
          </div>
        </div>

        <ol data-timeline className="relative md:col-span-7 md:col-start-6">
          <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line" />
          <span data-spine aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-ember" />
          {journey.map((j) => (
            <li key={j.title + j.when} data-step className="relative grid grid-cols-[2.5rem_1fr] pb-14 last:pb-0">
              <span data-node className="relative z-10 mt-[0.55rem] h-[15px] w-[15px] rounded-full border-4 border-ink bg-line" />
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-ember">{j.when}</span>
                <h3 className="mt-2 text-[clamp(1.6rem,2.6vw,2.6rem)] font-bold leading-tight tracking-[-0.03em] text-bone">{j.title}</h3>
                <p className="mt-1 text-[15px] text-bone/70">{j.where}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{j.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
