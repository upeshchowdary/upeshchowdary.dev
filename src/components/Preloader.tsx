import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'

const LOG = [
  'boot  · loading evidence store',
  'agent · receiving ........ ready',
  'agent · prep ............. ready',
  'agent · pack ............. ready',
  'agent · returns .......... ready',
  'agent · recovery ......... ready',
  'orch  · state owner ...... online',
]

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)
  const [gone, setGone] = useState(false)

  useGSAP(() => {
    const reduced = prefersReducedMotion()
    const seen = sessionStorage.getItem('uc-seen') === '1'
    sessionStorage.setItem('uc-seen', '1')
    const dur = reduced ? 0.3 : seen ? 1.2 : 2.6
    const counter = { v: 0 }

    const tl = gsap.timeline({
      onComplete: () => { setGone(true); },
    })
    tl.from('[data-pre-fade]', { autoAlpha: 0, y: 12, stagger: 0.06, duration: 0.8, ease: 'power3.out' }, 0)
      .to(counter, {
        v: 100,
        duration: dur,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
        },
      }, 0)
      .to('[data-pre-bar]', { scaleX: 1, duration: dur, ease: 'power2.inOut' }, 0)
      .from('[data-pre-log]', { autoAlpha: 0, x: -8, stagger: dur / (LOG.length + 1), duration: 0.3, ease: 'none' }, 0.15)
      // exit
      .to('[data-pre-out]', { yPercent: -110, duration: 0.9, ease: 'expo.in', stagger: 0.03 }, '+=0.15')
      .to('[data-pre-bar]', { scaleY: 400, duration: 0.01 }, '<0.6')
      .add(() => onDone(), '>-0.05')
      .to('[data-pre-panel="top"]', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '<')
      .to('[data-pre-panel="bottom"]', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, '<')
      .to('[data-pre-bar]', { autoAlpha: 0, duration: 0.4 }, '<0.2')
  }, { scope: root })

  if (gone) return null

  return (
    <div ref={root} className="fixed inset-0 z-[90] text-bone" aria-label="Loading" role="status">
      <div data-pre-panel="top" className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div data-pre-panel="bottom" className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />
      <div data-pre-bar className="absolute left-0 right-0 top-1/2 h-px origin-left scale-x-0 bg-ember" />

      <div className="relative flex h-full flex-col justify-between p-[var(--pad)]">
        <div className="flex items-start justify-between">
          <div className="overflow-hidden">
            <div data-pre-out className="label" data-pre-fade>REC-00 · SYSTEM BOOT</div>
          </div>
          <div className="overflow-hidden text-right">
            <div data-pre-out className="label" data-pre-fade>Upesh Chowdary — Portfolio 2026</div>
          </div>
        </div>

        <div className="overflow-hidden">
          <ul data-pre-out className="space-y-1 font-mono text-[11px] leading-relaxed text-muted">
            {LOG.map((l) => (
              <li key={l} data-pre-log>
                <span className="text-ember">›</span> {l}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-end justify-between">
          <div className="overflow-hidden">
            <p data-pre-out data-pre-fade className="max-w-[18rem] text-sm leading-snug text-muted">
              AI agents that decide —<br />
              <span className="serif-i text-bone">and show their work.</span>
            </p>
          </div>
          <div className="overflow-hidden">
            <span data-pre-out className="display block text-[clamp(5rem,16vw,15rem)] leading-[0.8] tabular-nums">
              <span ref={num}>000</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
