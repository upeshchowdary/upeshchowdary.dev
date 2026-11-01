import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/motion'
import { useField } from '../lib/useField'
import { credentials, finalist, leetcode, linguaskill } from '../content/data'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import Counter from '../components/Counter'

function LeetCodeChart() {
  const max = Math.max(...leetcode.split.map((s) => s.v))
  return (
    <div data-chart className="flex h-full flex-col rounded-[22px] border border-ink/10 bg-white/45 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <span className="label !text-ink/65">LeetCode · problems solved</span>
        <a href="https://leetcode.com/u/upeshchowdary_k/" target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-widest text-ember-ink" data-cursor="Open">
          Profile ↗
        </a>
      </div>
      <div className="mt-6 flex items-end gap-6">
        <span className="display text-[clamp(4rem,7vw,6.5rem)] text-ink">
          <Counter value={leetcode.solved} />
        </span>
        <span className="mb-3 font-mono text-[11px] uppercase leading-relaxed tracking-widest text-ink/65">
          contest rating
          <br />
          <span className="text-[15px] text-ink">{leetcode.rating.toLocaleString('en-IN')}</span>
        </span>
      </div>
      {/* proportional strip */}
      <div className="mt-6 flex h-2.5 overflow-hidden rounded-full bg-ink/10">
        {leetcode.split.map((s, i) => (
          <div
            key={s.k}
            data-strip
            className={i === 0 ? 'bg-ink' : i === 1 ? 'bg-ember' : 'bg-ink/40'}
            style={{ width: `${(s.v / leetcode.solved) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-6 space-y-3">
        {leetcode.split.map((s, i) => (
          <li key={s.k} className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink/65">{s.k}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-ink/8">
              <span data-bar className={`block h-full rounded-full ${i === 1 ? 'bg-ember' : 'bg-ink'}`} style={{ width: `${(s.v / max) * 100}%` }} />
            </span>
            <span className="text-right font-mono text-[13px] tabular-nums text-ink">{s.v}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function LinguaskillChart() {
  const { min, max } = linguaskill.scale
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div data-chart className="flex h-full flex-col rounded-[22px] border border-ink/10 bg-white/45 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <span className="label !text-ink/65">Cambridge Linguaskill · English</span>
        <a href="/docs/linguaskill-report.pdf" target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-widest text-ember-ink" data-cursor="Open">
          Report ↗
        </a>
      </div>
      <div className="mt-6 flex items-end gap-6">
        <span className="display text-[clamp(4rem,7vw,6.5rem)] text-ink">{linguaskill.level}</span>
        <span className="mb-3 font-mono text-[11px] uppercase leading-relaxed tracking-widest text-ink/65">
          average score
          <br />
          <span className="text-[15px] text-ink">
            <Counter value={linguaskill.average} />
          </span>
        </span>
      </div>
      <div className="relative mt-8 h-48 shrink-0">
        {/* CEFR band lines */}
        {linguaskill.bands.map((b) => (
          <div key={b.k} className="absolute inset-x-0 border-t border-dashed border-ink/15" style={{ bottom: `${pct(b.v)}%` }}>
            <span className="absolute -top-2.5 right-0 bg-[#ede8df] pl-1 font-mono text-[9px] tracking-widest text-ink/65">{b.k}</span>
          </div>
        ))}
        <div className="absolute inset-0 right-8 flex items-end justify-around gap-3">
          {linguaskill.skills.map((s) => (
            <div key={s.k} className="relative h-full w-full max-w-[56px]">
              <span
                data-col
                className={`absolute inset-x-0 bottom-0 block origin-bottom rounded-t-md ${s.level.startsWith('C1') ? 'bg-ember' : 'bg-ink'}`}
                style={{ height: `${pct(s.v)}%` }}
              />
              <span className="absolute inset-x-0 text-center font-mono text-[11px] tabular-nums text-ink" style={{ bottom: `calc(${pct(s.v)}% + 6px)` }}>
                {s.v === max ? '180+' : s.v}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mr-8 mt-3 flex shrink-0 justify-around gap-3">
        {linguaskill.skills.map((s) => (
          <div key={s.k} className="w-full max-w-[56px] text-center">
            <div className="truncate text-[12px] font-semibold text-ink">{s.k}</div>
            <div className="font-mono text-[9.5px] uppercase tracking-widest text-ink/65">{s.level}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Recognition() {
  const root = useRef<HTMLElement>(null)
  useField(root, { shape: 6, x: 0, y: 0, scale: 1, opacity: 0, spin: 0.2, ember: 0.3 })

  useGSAP(() => {
    // tell the cursor it's on a light surface
    const light = ScrollTrigger.create({
      trigger: '[data-sheet]',
      start: 'top 50%',
      end: 'bottom 50%',
      toggleClass: { targets: document.documentElement, className: 'on-light' },
    })
    if (prefersReducedMotion()) return () => light.kill()

    // the sheet rises over the dark page
    gsap.fromTo('[data-sheet]', { scale: 0.92, borderRadius: '72px', y: 60 }, {
      scale: 1, borderRadius: '40px', y: 0, ease: 'none',
      scrollTrigger: { trigger: '[data-sheet]', start: 'top bottom', end: 'top 25%', scrub: true },
    })
    gsap.fromTo('[data-cert]', { rotateX: 28, y: 120, autoAlpha: 0, transformPerspective: 1200 }, {
      rotateX: 0, y: 0, autoAlpha: 1, duration: 1.8, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-cert]', start: 'top 85%' },
    })
    gsap.fromTo('[data-sweep]', { xPercent: -120 }, {
      xPercent: 220, duration: 1.6, ease: 'power2.inOut', delay: 0.6,
      scrollTrigger: { trigger: '[data-cert]', start: 'top 70%' },
    })
    gsap.from('[data-strip]', { scaleX: 0, transformOrigin: '0 50%', stagger: 0.15, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '[data-charts]', start: 'top 80%' } })
    gsap.from('[data-bar]', { scaleX: 0, transformOrigin: '0 50%', stagger: 0.12, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '[data-charts]', start: 'top 80%' } })
    gsap.from('[data-col]', { scaleY: 0, stagger: 0.1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '[data-charts]', start: 'top 75%' } })
    gsap.from('[data-cred]', {
      y: 50, autoAlpha: 0, stagger: 0.1, duration: 1.3,
      scrollTrigger: { trigger: '[data-creds]', start: 'top 85%' },
    })
    return () => light.kill()
  }, { scope: root })

  return (
    <section ref={root} id="recognition" className="relative py-[clamp(2rem,6vh,4rem)]">
      <div
        data-sheet
        className="relative mx-[clamp(0.4rem,1vw,1rem)] origin-top overflow-hidden rounded-[40px] bg-bone px-[var(--pad)] py-[clamp(5rem,12vh,9rem)] text-ink"
      >
        <div className="flex items-center gap-4">
          <span className="label !text-ember-ink">REC-05</span>
          <span className="h-px w-10 bg-ink/15" />
          <span className="label !text-ink/65">Proof</span>
        </div>

        <div className="mt-10 grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink/65">{finalist.title}</p>
            <Reveal as="h2" className="display mt-4 text-[clamp(4.5rem,11vw,12rem)] text-ink">
              Finalist<span className="text-ember">.</span>
            </Reveal>
            <Reveal as="p" className="serif-i mt-6 text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.1] text-ink">
              {finalist.line}
            </Reveal>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/65">{finalist.detail}.</p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/65">
              Built the CUBE-0045 Returns agent in Round 2, led a five-agent pod in Round 3 — and made the national final.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div data-cert>
              <TiltCard className="rounded-[20px]" max={6}>
                <div className="relative overflow-hidden rounded-[20px] border border-ink/10 bg-white shadow-[0_50px_120px_-40px_rgba(11,11,10,0.55)]">
                  <img
                    src={finalist.image}
                    srcSet={`${finalist.image.replace('.webp', '-sm.webp')} 900w, ${finalist.image} 1800w`}
                    sizes="(min-width: 1024px) 55vw, 92vw"
                    width={1800}
                    height={1273}
                    alt="CUBE Buildathon 2026 Certificate of Excellence — Finalist, awarded to Kasaraneni Upesh Chowdary"
                    className="block h-auto w-full"
                    loading="lazy"
                  />
                  <div data-sweep aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-soft-light" />
                </div>
              </TiltCard>
            </div>
          </div>
        </div>

        <div className="mt-[clamp(4rem,10vh,7rem)] flex items-baseline justify-between border-t border-ink/15 pt-6">
          <span className="label !text-ink/65">In numbers</span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/65">verified · linked</span>
        </div>
        <div data-charts className="mt-6 grid gap-4 lg:grid-cols-2">
          <LeetCodeChart />
          <LinguaskillChart />
        </div>

        <div data-creds className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((c) => {
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <span className="label !text-ink/65">{c.org}</span>
                  {c.href && <span className="font-mono text-[11px] uppercase tracking-widest text-ember-ink transition-transform duration-500 group-hover:translate-x-1">{c.cta} ↗</span>}
                </div>
                <h3 className="mt-10 text-[clamp(1.25rem,1.6vw,1.6rem)] font-bold leading-tight tracking-[-0.02em] text-ink">{c.title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/65">{c.meta}</p>
              </>
            )
            const cls = 'group flex h-full flex-col rounded-[20px] border border-ink/10 bg-white/45 p-6 transition-colors duration-500 hover:border-ember'
            return c.href ? (
              <a key={c.title} data-cred href={c.href} target="_blank" rel="noreferrer" className={cls} data-cursor={c.cta}>
                {inner}
              </a>
            ) : (
              <div key={c.title} data-cred className={cls}>
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
