import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { useField } from '../lib/useField'
import { marqueeA, marqueeB, toolkit } from '../content/data'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'

export default function Toolkit() {
  const root = useRef<HTMLElement>(null)
  useField(root, { shape: 3, x: 0, y: -1.2, scale: 1.15, opacity: 0.45, spin: 0.05, ember: 0.14 })

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('[data-group]', {
      y: 40, autoAlpha: 0, stagger: 0.1, duration: 1.2,
      scrollTrigger: { trigger: '[data-groups]', start: 'top 80%' },
    })
  }, { scope: root })

  return (
    <section ref={root} id="toolkit" className="relative py-[clamp(6rem,14vh,10rem)]">
      <div className="px-[var(--pad)]">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-4">
              <span className="label text-ember">REC-06</span>
              <span className="h-px w-10 bg-line" />
              <span className="label">Toolkit</span>
            </div>
          </div>
          <div className="md:col-span-8">
            <Reveal as="h2" className="display text-[clamp(3rem,7vw,8rem)]">
              The <span className="serif-i font-normal tracking-normal text-ember">instruments.</span>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="my-[clamp(3rem,8vh,6rem)] space-y-2 border-y border-line py-6">
        <Marquee items={marqueeA} className="display text-[clamp(2.6rem,6vw,6.5rem)] text-bone" />
        <Marquee items={marqueeB} reverse className="display outline-text text-[clamp(2.6rem,6vw,6.5rem)]" />
      </div>

      <div data-groups className="grid gap-x-8 gap-y-12 px-[var(--pad)] sm:grid-cols-2 lg:grid-cols-3">
        {toolkit.map((g, i) => (
          <div data-group key={g.group}>
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <h3 className="text-lg font-bold tracking-tight text-bone">{g.group}</h3>
              <span className="font-mono text-[11px] text-ember">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {g.items.map((t) => (
                <li key={t} className="group flex items-center gap-2 text-[15px] text-muted transition-colors duration-300 hover:text-bone">
                  <span className="h-1 w-1 rounded-full bg-dim transition-colors duration-300 group-hover:bg-ember" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
