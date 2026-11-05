import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { useField } from '../lib/useField'
import type { Project } from '../content/data'
import Reveal from '../components/Reveal'
import Magnetic from '../components/Magnetic'
import SystemMap from '../components/SystemMap'
import { maps } from '../content/maps'

const host = (u: string) => u.replace(/^https?:\/\//, '').replace(/\/$/, '')

const small = (src: string) => src.replace('.webp', '-sm.webp')

function BrowserShot({ src, alt, url, w, h }: { src: string; alt: string; url: string; w: number; h: number }) {
  return (
    <figure data-shot className="overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
        </span>
        <span className="mx-auto max-w-[70%] truncate rounded-full bg-ink px-4 py-1 font-mono text-[10px] text-muted">{url}</span>
      </div>
      <div className="relative overflow-hidden">
        <img
          data-shot-img
          src={src}
          srcSet={`${small(src)} 900w, ${src} 1568w`}
          sizes="(min-width: 1024px) 55vw, 92vw"
          width={w}
          height={h}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full origin-center"
        />
      </div>
    </figure>
  )
}

export default function CaseStudy({ project: p, flip }: { project: Project; flip: boolean }) {
  const root = useRef<HTMLElement>(null)
  useField(root, { shape: p.shape, x: flip ? -3.4 : 3.4, y: 0, scale: 0.95, opacity: 0.42, spin: p.shape === 3 || p.shape === 5 ? 0.12 : 0.7, ember: 0.16 })

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.utils.toArray<HTMLElement>('[data-shot]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(18% 10% 18% 10% round 18px)', y: 80 }, {
        clipPath: 'inset(0% 0% 0% 0% round 18px)', y: 0, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: 0.8 },
      })
      gsap.fromTo(el.querySelector('[data-shot-img]'), { scale: 1.18 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
    gsap.from('[data-metric]', {
      y: 30, autoAlpha: 0, stagger: 0.08, duration: 1.2,
      scrollTrigger: { trigger: '[data-metrics]', start: 'top 85%' },
    })
    gsap.from('[data-chip]', {
      y: 12, autoAlpha: 0, stagger: 0.025, duration: 0.8,
      scrollTrigger: { trigger: '[data-chips]', start: 'top 90%' },
    })
  }, { scope: root })

  return (
    <section ref={root} id={p.id} className="relative px-[var(--pad)] py-[clamp(4rem,10vh,8rem)]">
      <div className="h-px w-full bg-line" />
      <div className={`mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10`}>
        {/* info */}
        <div className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : ''}`}>
          <div className="lg:sticky lg:top-[12vh]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-ember">{p.index} / 05</span>
              <span className="label">{p.period}</span>
            </div>
            <Reveal as="h3" className={`display mt-6 text-bone ${p.name.length > 12 ? 'text-[clamp(2.8rem,4.9vw,5.6rem)]' : 'text-[clamp(3rem,6.4vw,7rem)]'}`}>
              {p.name}
            </Reveal>
            <p className="label mt-4 !text-bone/70">{p.kicker}</p>
            <Reveal as="p" className="serif-i mt-8 text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1.1] text-bone">
              {p.tagline}
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-2 border-t border-line pt-6 sm:grid-cols-[6.5rem_1fr] sm:gap-y-5">
              <span className="label pt-1 !text-ember">Problem</span>
              <Reveal as="p" mode="fade" className="text-[clamp(1rem,1.1vw,1.08rem)] leading-relaxed text-bone/85">
                {p.problem}
              </Reveal>
              <span className="label mt-4 pt-1 sm:mt-0">Built</span>
              <Reveal as="p" mode="fade" className="text-[clamp(1rem,1.1vw,1.08rem)] leading-relaxed text-muted">
                {p.summary}
              </Reveal>
            </div>
            {p.note && <p className="mt-5 border-l-2 border-ember/60 pl-4 text-sm italic text-muted">{p.note}</p>}

            <span className="label mt-10 block">Proof</span>
            <div data-metrics className="mt-3 grid grid-cols-2 border-t border-line">
              {p.metrics.map((m, i) => (
                <div data-metric key={m.label} className={`border-b border-line py-5 ${i % 2 === 1 ? 'border-l pl-5' : 'pr-5'}`}>
                  <div className="display text-[clamp(2rem,3.2vw,3.2rem)] text-bone">{m.value}</div>
                  <div className="mt-2 text-[13px] leading-snug text-muted">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-primary" data-cursor="Open">
                  <span data-magnetic-inner className="flex items-center gap-3">
                    Live system <span className="btn-arrow">↗</span>
                  </span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href={p.code} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  <span data-magnetic-inner className="flex items-center gap-3">
                    Source <span className="btn-arrow">↗</span>
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* evidence column */}
        <div className={`min-w-0 space-y-10 lg:col-span-7 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-6 lg:pl-6'}`}>
          {p.shots.map((s, i) => (
            <div key={s.src}>
              <BrowserShot src={s.src} alt={s.alt} url={host(p.live)} w={s.w} h={s.h} />
              {i === 0 && maps[p.id] && (
                <div className="mt-10">
                  <SystemMap data={maps[p.id]} id={p.id} />
                </div>
              )}
              {i === 0 && (
                <ol className="mt-10 space-y-5">
                  <li className="label">Approach</li>
                  {p.points.map((pt, j) => (
                    <li key={j} className="grid grid-cols-[3rem_1fr] gap-2 border-t border-line pt-5">
                      <span className="font-mono text-xs text-ember">{String(j + 1).padStart(2, '0')}</span>
                      <Reveal as="p" mode="fade" className="text-[15px] leading-relaxed text-bone/85">
                        {pt}
                      </Reveal>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
          <div data-chips className="flex flex-wrap gap-2 pt-2">
            {p.stack.map((t) => (
              <span data-chip key={t} className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] text-bone/75 transition-colors duration-300 hover:border-ember hover:text-bone">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
