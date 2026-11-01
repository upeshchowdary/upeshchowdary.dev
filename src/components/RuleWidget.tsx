import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'

type Kind = 'decide' | 'uncertain' | 'evidence' | 'failopen'

const pill = 'rounded-lg border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em]'

/** Small live diagrams that prove each rule. Loops only while on screen. */
export default function RuleWidget({ kind }: { kind: Kind }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'power2.inOut' } })

      if (kind === 'decide') {
        tl.fromTo(q('[data-packet]'), { left: '0%', autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
          .to(q('[data-packet]'), { left: '48%', duration: 0.9 })
          .to(q('[data-n="rules"]'), { borderColor: '#FF4D1F', color: '#EDE8DF', duration: 0.2 }, '<0.7')
          .to(q('[data-packet]'), { left: '96%', duration: 0.9 })
          .to(q('[data-n="out"]'), { backgroundColor: '#FF4D1F', color: '#0B0B0A', borderColor: '#FF4D1F', duration: 0.25 }, '<0.7')
          .to(q('[data-packet]'), { autoAlpha: 0, duration: 0.2 })
          .to(q('[data-n]'), { clearProps: 'borderColor,color,backgroundColor', duration: 0.01 }, '+=0.8')
      }

      if (kind === 'uncertain') {
        const fill = q('[data-fill]')[0] as HTMLElement
        const val = q('[data-val]')[0] as HTMLElement
        const verdict = q('[data-verdict]')[0] as HTMLElement
        const o = { v: 40 }
        const paint = () => {
          fill.style.width = `${o.v}%`
          val.textContent = `${Math.round(o.v)}%`
          const ok = o.v >= 85
          fill.style.background = ok ? '#EDE8DF' : '#FF4D1F'
          verdict.textContent = ok ? 'auto-approve' : 'uncertain → human'
          verdict.style.color = ok ? '#EDE8DF' : '#FF7A4D'
        }
        tl.to(o, { v: 93, duration: 1.4, onUpdate: paint })
          .to(o, { v: 93, duration: 1.1 })
          .to(o, { v: 61, duration: 1.4, onUpdate: paint })
          .to(o, { v: 61, duration: 1.1 })
        paint()
      }

      if (kind === 'evidence') {
        const blocks = q('[data-block]')
        blocks.forEach((b, i) => {
          tl.to(b, { borderColor: '#FF4D1F', boxShadow: '0 0 18px -4px rgba(255,77,31,0.7)', duration: 0.35 }, i * 0.45)
            .to(b, { borderColor: 'rgba(42,41,37,1)', boxShadow: '0 0 0 0 rgba(0,0,0,0)', duration: 0.5 }, i * 0.45 + 0.45)
        })
        tl.to(q('[data-hash="last"]'), { duration: 0.9, scrambleText: { text: '{original}', chars: '0123456789abcdef', speed: 0.8 } }, 0.2)
        tl.to({}, { duration: 0.8 })
      }

      if (kind === 'failopen') {
        tl.set(q('[data-packet]'), { left: '4%', top: '28%', autoAlpha: 1 })
          .to(q('[data-packet]'), { left: '42%', duration: 0.8 })
          .to(q('[data-n="model"]'), { borderColor: '#FF4D1F', duration: 0.15 })
          .to(q('[data-x]'), { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(3)' }, '<')
          .to(q('[data-packet]'), { top: '76%', left: '50%', duration: 0.7 }, '+=0.25')
          .to(q('[data-packet]'), { left: '88%', duration: 0.7 })
          .to(q('[data-n="human"]'), { backgroundColor: '#EDE8DF', color: '#0B0B0A', duration: 0.25 }, '<0.5')
          .to(q('[data-packet]'), { autoAlpha: 0, duration: 0.2 })
          .to(q('[data-n], [data-x]'), { clearProps: 'all', duration: 0.01 }, '+=0.9')
        gsap.set(q('[data-x]'), { autoAlpha: 0, scale: 0.4 })
      }

      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'bottom 5%', onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) } })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative w-full max-w-[340px] select-none" aria-hidden>
      {kind === 'decide' && (
        <div className="relative flex items-center justify-between gap-2 py-3">
          <span className="absolute left-6 right-6 top-1/2 h-px bg-line" />
          <span className={`${pill} relative border-ember/60 bg-[#1c120e] text-bone`}>LLM · judges</span>
          <span data-n="rules" className={`${pill} relative border-line bg-ink text-muted`}>24 rules · decide</span>
          <span data-n="out" className={`${pill} relative border-line bg-ink text-muted`}>outcome</span>
          <span data-packet className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-ember opacity-0 shadow-[0_0_10px_2px_rgba(255,77,31,0.7)]" />
        </div>
      )}

      {kind === 'uncertain' && (
        <div className="pb-6 pt-2">
          <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            <span>confidence <span data-val className="ml-1 text-bone">61%</span></span>
            <span data-verdict className="text-ember-soft">uncertain → human</span>
          </div>
          <div className="relative mt-3 h-2 rounded-full bg-line">
            <div data-fill className="h-full w-[61%] rounded-full bg-ember" />
            <div className="absolute -top-1.5 bottom-[-6px] left-[85%] w-px bg-bone/70" />
            <span className="absolute -bottom-5 left-[85%] -translate-x-1/2 font-mono text-[9px] text-bone/70">85% gate</span>
          </div>
        </div>
      )}

      {kind === 'evidence' && (
        <div className="flex items-center gap-1.5 py-2">
          {['a3f9c1', '7be042', 'd51e8a', '09c7f3'].map((h, i, arr) => (
            <div key={h} className="flex items-center gap-1.5">
              <div data-block className="rounded-lg border border-line bg-ink px-2 py-1.5">
                <div className="font-mono text-[8.5px] uppercase tracking-widest text-dim">rec {i + 1}</div>
                <div data-hash={i === arr.length - 1 ? 'last' : undefined} className="font-mono text-[10px] text-bone/80">
                  {h}…
                </div>
              </div>
              {i < arr.length - 1 && <span className="text-[10px] text-ember">→</span>}
            </div>
          ))}
        </div>
      )}

      {kind === 'failopen' && (
        <div className="relative h-[86px]">
          <span className={`${pill} absolute left-0 top-[28%] -translate-y-1/2 border-line bg-ink text-muted`}>case</span>
          <span data-n="model" className={`${pill} absolute left-[42%] top-[28%] -translate-y-1/2 border-line bg-ink text-muted`}>
            model
            <span data-x className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-ember text-[9px] text-ink">✕</span>
          </span>
          <span className={`${pill} absolute right-0 top-[28%] -translate-y-1/2 border-dashed border-line bg-ink text-dim`}>guess</span>
          <span data-n="human" className={`${pill} absolute right-0 top-[76%] -translate-y-1/2 border-bone/40 bg-ink text-bone`}>human review ✓</span>
          <span className="absolute left-[8%] right-[30%] top-[28%] h-px bg-line" />
          <span className="absolute left-[50%] top-[28%] h-[48%] w-px bg-line" />
          <span className="absolute left-[50%] right-[18%] top-[76%] h-px bg-line" />
          <span data-packet className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember opacity-0 shadow-[0_0_10px_2px_rgba(255,77,31,0.7)]" />
        </div>
      )}
    </div>
  )
}
