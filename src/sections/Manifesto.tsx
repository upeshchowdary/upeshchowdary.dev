import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { useField } from '../lib/useField'

type W = { t: string; kind?: 'strike' | 'serif' }
const WORDS: W[] = [
  { t: 'Most' }, { t: 'AI' }, { t: 'guesses.', kind: 'strike' },
  { t: 'I' }, { t: 'build' }, { t: 'systems' }, { t: 'that' }, { t: 'know' }, { t: 'when' }, { t: 'they’re' }, { t: 'uncertain', kind: 'serif' }, { t: '—' },
  { t: 'deterministic' }, { t: 'where' }, { t: 'it' }, { t: 'matters,' },
  { t: 'agentic' }, { t: 'where' }, { t: 'it' }, { t: 'helps,' },
  { t: 'and' }, { t: 'human' }, { t: 'where' }, { t: 'it' }, { t: 'counts.' },
]

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  useField(root, { shape: 1, x: 0, y: 0, scale: 1.05, opacity: 0.55, spin: 0.35, ember: 0.12 })

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const words = gsap.utils.toArray<HTMLElement>('[data-w]')
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: pin.current, start: 'top top', end: '+=170%', scrub: 0.6, pin: true },
      })
      tl.to(words, { opacity: 1, stagger: 0.12, ease: 'none', duration: 0.6 })
        .to('[data-strike]', { scaleX: 1, ease: 'power2.inOut', duration: 0.8 }, 0.45)
        .to('[data-belief-meta]', { autoAlpha: 1, y: 0, duration: 0.6 }, '>-0.4')
    })
    mm.add('(max-width: 767px)', () => {
      gsap.to(words, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: pin.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.5 } })
      gsap.to('[data-strike]', { scaleX: 1, scrollTrigger: { trigger: pin.current, start: 'top 60%' } })
      gsap.to('[data-belief-meta]', { autoAlpha: 1, y: 0, scrollTrigger: { trigger: pin.current, start: 'top 40%' } })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section ref={root} id="manifesto" className="relative">
      <div ref={pin} className="flex min-h-[100svh] flex-col justify-center px-[var(--pad)] py-24">
        <div className="mb-10 flex items-center gap-4">
          <span className="label text-ember">REC-01</span>
          <span className="h-px w-10 bg-line" />
          <span className="label">Belief</span>
        </div>
        <p className="max-w-[22ch] text-[clamp(2.1rem,5.2vw,6rem)] font-bold leading-[1.02] tracking-[-0.035em] text-bone">
          {WORDS.map((w, i) => (
            <span key={i}>
              <span data-w className={`relative inline-block opacity-[0.13] ${w.kind === 'serif' ? 'serif-i font-normal text-ember' : ''}`}>
                {w.t}
                {w.kind === 'strike' && (
                  <span data-strike className="absolute left-0 right-0 top-[55%] h-[0.07em] origin-left scale-x-0 bg-ember" />
                )}
              </span>{' '}
            </span>
          ))}
        </p>
        <div data-belief-meta className="mt-12 grid max-w-3xl translate-y-4 gap-6 opacity-0 sm:grid-cols-3">
          {[
            ['Deterministic', 'Rules engines own the numbers and the final call.'],
            ['Agentic', 'LLM agents research, judge and explain — with tools.'],
            ['Human', 'Sign-off gates where stakes or uncertainty are high.'],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-line pt-4">
              <div className="label text-bone">{k}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
