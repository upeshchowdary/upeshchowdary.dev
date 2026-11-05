import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { useField } from '../lib/useField'
import { bio, facts, person, stats } from '../content/data'
import Reveal from '../components/Reveal'
import Counter from '../components/Counter'
import Scramble from '../components/Scramble'

export default function About() {
  const root = useRef<HTMLElement>(null)
  useField(root, { shape: 6, x: 0, y: 0, scale: 1, opacity: 0.6, spin: 0.15, ember: 0.08 })

  useGSAP(() => {
    if (prefersReducedMotion()) return
    // giant name drifts sideways
    gsap.fromTo('[data-giant]', { xPercent: 8 }, {
      xPercent: -14, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    // the portrait "develops": duotone → colour as you scroll
    gsap.fromTo('[data-develop]', { maskPosition: '0% 0%', webkitMaskPosition: '0% 0%' }, {
      maskPosition: '0% 100%', webkitMaskPosition: '0% 100%', ease: 'none',
      scrollTrigger: { trigger: '[data-portrait]', start: 'top 70%', end: 'bottom 45%', scrub: 0.6 },
    })
    gsap.from('[data-portrait]', {
      yPercent: 12, scale: 0.94, ease: 'none',
      scrollTrigger: { trigger: '[data-portrait]', start: 'top bottom', end: 'center center', scrub: true },
    })
  }, { scope: root })

  return (
    <section ref={root} id="about" className="relative overflow-hidden px-[var(--pad)] py-[clamp(6rem,14vh,10rem)]">
      {/* giant outlined name */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[12%] select-none whitespace-nowrap">
        <div data-giant className="display outline-text text-[clamp(9rem,30vw,32rem)] leading-none">
          {person.first} {person.last}
        </div>
      </div>

      <div className="relative grid gap-14 md:grid-cols-12 md:gap-8">
        {/* portrait */}
        <div className="md:col-span-5">
          <div data-portrait className="relative mx-auto aspect-[1524/1652] w-full max-w-[520px]">
            <div aria-hidden className="absolute inset-[8%_6%_10%] rounded-full bg-[radial-gradient(closest-side,rgba(255,77,31,0.38),rgba(255,77,31,0.08)_55%,transparent)] blur-2xl" />
            <img
              src="/images/portrait-duo.webp"
              srcSet="/images/portrait-duo-sm.webp 820w, /images/portrait-duo.webp 1524w"
              sizes="(min-width: 768px) 40vw, 90vw"
              alt={`${person.fullName} — portrait`}
              className="absolute inset-0 h-full w-full object-contain"
              width={1524}
              height={1652}
              loading="lazy"
              decoding="async"
            />
            <img
              data-develop
              src="/images/portrait.webp"
              srcSet="/images/portrait-sm.webp 820w, /images/portrait.webp 1524w"
              sizes="(min-width: 768px) 40vw, 90vw"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-contain [mask-image:linear-gradient(to_top,#000_42%,transparent_58%)] [mask-size:100%_300%] [mask-position:0%_100%] [-webkit-mask-image:linear-gradient(to_top,#000_42%,transparent_58%)] [-webkit-mask-size:100%_300%] [-webkit-mask-position:0%_100%]"
              width={1524}
              height={1652}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute bottom-[6%] left-0 right-0 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              <span>fig. 01 — the builder</span>
              <span className="hidden sm:inline">VJA · 16.5°N 80.6°E</span>
            </div>
          </div>
        </div>

        {/* copy */}
        <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
          <div className="mb-8 flex items-center gap-4">
            <span className="label text-ember">REC-02</span>
            <span className="h-px w-10 bg-line" />
            <span className="label">The builder</span>
          </div>
          <Reveal as="h2" className="text-[clamp(2.2rem,4.4vw,4.6rem)] font-bold leading-[0.98] tracking-[-0.035em]">
            Hi, I’m Upesh. I turn messy real-world data into <span className="serif-i font-normal text-ember">decisions you can audit.</span>
          </Reveal>
          <div className="mt-8 space-y-5 text-[clamp(1rem,1.15vw,1.12rem)] leading-relaxed text-muted">
            {bio.map((b, i) => (
              <Reveal key={i} as="p" delay={0.1 * i}>
                {b}
              </Reveal>
            ))}
          </div>
          <dl className="mt-10 border-t border-line">
            {facts.map((f) => (
              <div key={f.k} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3 sm:grid-cols-[8rem_1fr] sm:gap-4 border-b border-line py-3.5">
                <dt className="label">
                  <Scramble text={f.k} />
                </dt>
                <dd className="text-[15px] text-bone">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* stats */}
      <div className="relative mt-[clamp(4rem,10vh,8rem)] grid grid-cols-2 border-t border-line md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`py-8 pr-6 ${i > 0 ? 'md:border-l md:border-line md:pl-6' : ''} ${i % 2 === 1 ? 'border-l border-line pl-6 md:pl-6' : ''}`}>
            <div className="display text-[clamp(3rem,6vw,6.5rem)] text-bone">
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </div>
            <p className="mt-3 max-w-[16ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
