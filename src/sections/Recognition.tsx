import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { useField } from '../lib/useField'
import { credentials, finalist } from '../content/data'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'

export default function Recognition() {
  const root = useRef<HTMLElement>(null)
  useField(root, { shape: 6, x: 0, y: 0, scale: 1, opacity: 0.75, spin: 0.2, ember: 0.3 })

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo('[data-cert]', { rotateX: 28, y: 120, autoAlpha: 0, transformPerspective: 1200 }, {
      rotateX: 0, y: 0, autoAlpha: 1, duration: 1.8, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-cert]', start: 'top 85%' },
    })
    gsap.fromTo('[data-sweep]', { xPercent: -120 }, {
      xPercent: 220, duration: 1.6, ease: 'power2.inOut', delay: 0.6,
      scrollTrigger: { trigger: '[data-cert]', start: 'top 70%' },
    })
    gsap.from('[data-cred]', {
      y: 50, autoAlpha: 0, stagger: 0.1, duration: 1.3,
      scrollTrigger: { trigger: '[data-creds]', start: 'top 85%' },
    })
  }, { scope: root })

  return (
    <section ref={root} id="recognition" className="relative px-[var(--pad)] py-[clamp(6rem,14vh,10rem)]">
      <div className="flex items-center gap-4">
        <span className="label text-ember">REC-05</span>
        <span className="h-px w-10 bg-line" />
        <span className="label">Proof</span>
      </div>

      <div className="mt-10 grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-bone/70">{finalist.title}</p>
          <Reveal as="h2" className="display mt-4 text-[clamp(4.5rem,11vw,12rem)] text-bone">
            Finalist<span className="text-ember">.</span>
          </Reveal>
          <Reveal as="p" className="serif-i mt-6 text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.1]">
            {finalist.line}
          </Reveal>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">{finalist.detail}.</p>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            Built the CUBE-0045 Returns agent in Round 2, led a five-agent pod in Round 3 — and made the national final.
          </p>
        </div>
        <div className="lg:col-span-7">
          <div data-cert>
            <TiltCard className="rounded-[20px]" max={6}>
              <div className="relative overflow-hidden rounded-[20px] border border-line bg-white p-0 shadow-[0_60px_140px_-40px_rgba(255,77,31,0.35)]">
                <img src={finalist.image} alt="CUBE Buildathon 2026 Certificate of Excellence — Finalist, awarded to Kasaraneni Upesh Chowdary" className="block w-full" loading="lazy" />
                <div data-sweep aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent mix-blend-soft-light" />
              </div>
            </TiltCard>
          </div>
        </div>
      </div>

      <div data-creds className="mt-[clamp(4rem,10vh,7rem)] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {credentials.map((c) => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span className="label">{c.org}</span>
                {c.href && <span className="font-mono text-[11px] uppercase tracking-widest text-ember transition-transform duration-500 group-hover:translate-x-1">{c.cta} ↗</span>}
              </div>
              <h3 className="mt-10 text-[clamp(1.25rem,1.6vw,1.6rem)] font-bold leading-tight tracking-[-0.02em] text-bone">{c.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">{c.meta}</p>
            </>
          )
          const cls = 'group flex h-full flex-col rounded-[20px] border border-line bg-surface/60 p-6 backdrop-blur-sm transition-colors duration-500 hover:border-ember/70'
          return c.href ? (
            <a key={c.title} data-cred href={c.href} target="_blank" rel="noreferrer" className={cls} data-cursor="Verify">
              {inner}
            </a>
          ) : (
            <div key={c.title} data-cred className={cls}>
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
