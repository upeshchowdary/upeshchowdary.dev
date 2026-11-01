import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, scrollToId, isFinePointer } from '../lib/motion'
import { useField } from '../lib/useField'
import { projects } from '../content/data'
import Reveal from '../components/Reveal'
import CaseStudy from './CaseStudy'

export function WorkIndex() {
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  useField(root, { shape: 2, x: 2.8, y: 0.2, scale: 0.8, opacity: 0.55, spin: 0.8, ember: 0.12 })

  useEffect(() => {
    const p = preview.current
    if (!p || !isFinePointer()) return
    const xTo = gsap.quickTo(p, 'x', { duration: 0.7, ease: 'power3' })
    const yTo = gsap.quickTo(p, 'y', { duration: 0.7, ease: 'power3' })
    const rTo = gsap.quickTo(p, 'rotation', { duration: 0.9, ease: 'power3' })
    let lastX = 0
    const move = (e: PointerEvent) => {
      xTo(e.clientX); yTo(e.clientY)
      rTo(Math.max(-8, Math.min(8, (e.clientX - lastX) * 0.4)))
      lastX = e.clientX
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useEffect(() => {
    const p = preview.current
    if (!p) return
    gsap.to(p.querySelector('[data-prev-wrap]'), {
      clipPath: active === null ? 'inset(50% 50% 50% 50% round 14px)' : 'inset(0% 0% 0% 0% round 14px)',
      duration: 0.7, ease: 'expo.out',
    })
    if (active !== null) {
      gsap.to(p.querySelectorAll('[data-prev-img]'), { yPercent: -100 * active, duration: 0.8, ease: 'expo.inOut' })
    }
  }, [active])

  useGSAP(() => {
    gsap.from('[data-row]', {
      y: 40, autoAlpha: 0, stagger: 0.08, duration: 1.2,
      scrollTrigger: { trigger: '[data-rows]', start: 'top 80%' },
    })
    gsap.from('[data-row-line]', {
      scaleX: 0, transformOrigin: '0 50%', stagger: 0.08, duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: '[data-rows]', start: 'top 80%' },
    })
  }, { scope: root })

  return (
    <section ref={root} id="work" className="relative px-[var(--pad)] pb-[clamp(4rem,10vh,8rem)] pt-[clamp(6rem,14vh,10rem)]">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-4">
            <span className="label text-ember">REC-04</span>
            <span className="h-px w-10 bg-line" />
            <span className="label">Selected systems · 2026</span>
          </div>
        </div>
        <div className="md:col-span-8">
          <Reveal as="h2" className="display text-[clamp(3rem,8vw,9rem)]">
            Systems, <span className="serif-i font-normal tracking-normal text-ember">shipped.</span>
          </Reveal>
          <Reveal as="p" mode="fade" className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Five live systems — agents that inspect, research, orchestrate and watch the world. Every one is deployed. Click through and break them.
          </Reveal>
        </div>
      </div>

      <ul data-rows className="group/list mt-[clamp(3rem,8vh,6rem)]" onPointerLeave={() => setActive(null)}>
        {projects.map((p, i) => (
          <li key={p.id} data-row className="relative">
            <span data-row-line className="absolute left-0 right-0 top-0 h-px bg-line" />
            <button
              onClick={() => scrollToId(p.id)}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              data-cursor="View"
              className="group/row grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 text-left transition-opacity duration-500 group-hover/list:opacity-35 hover:!opacity-100 md:grid-cols-[4rem_1.3fr_1fr_8rem_2rem] md:py-8"
            >
              <span className="font-mono text-xs text-muted">{p.index}</span>
              <span className="text-[clamp(1.8rem,4.2vw,4.4rem)] font-bold leading-none tracking-[-0.035em] text-bone transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/row:translate-x-4">
                {p.name}
              </span>
              <span className="hidden text-[15px] text-muted md:block">{p.kicker}</span>
              <span className="hidden font-mono text-xs uppercase tracking-widest text-muted md:block">{p.period}</span>
              <span className="text-right text-xl text-ember transition-transform duration-700 group-hover/row:-rotate-45">↘</span>
            </button>
          </li>
        ))}
        <li className="h-px bg-line" />
      </ul>

      {/* cursor-follow preview */}
      <div ref={preview} aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block">
        <div
          data-prev-wrap
          className="-ml-[200px] -mt-[125px] h-[250px] w-[400px] overflow-hidden rounded-[14px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
          style={{ clipPath: 'inset(50% 50% 50% 50% round 14px)' }}
        >
          {projects.map((p) => (
            <img key={p.id} data-prev-img src={p.shots[0].src.replace('.webp', '-sm.webp')} alt="" width={400} height={250} className="block h-[250px] w-[400px] object-cover object-top" loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Work() {
  return (
    <>
      <WorkIndex />
      {projects.map((p, i) => (
        <CaseStudy key={p.id} project={p} flip={i % 2 === 1} />
      ))}
    </>
  )
}
