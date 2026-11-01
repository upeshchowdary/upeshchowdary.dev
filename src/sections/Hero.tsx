import { useRef } from 'react'
import { gsap, SplitText, useGSAP, scrollToId, prefersReducedMotion } from '../lib/motion'
import { useField } from '../lib/useField'
import { person, roles } from '../content/data'
import Magnetic from '../components/Magnetic'
import Clock from '../components/Clock'

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const roleTrack = useRef<HTMLSpanElement>(null)

  useField(root, { shape: 0, x: 3.7, y: 0.1, scale: 0.92, opacity: 1, spin: 1, ember: 0.1 })

  // intro choreography — runs once the preloader hands over
  useGSAP(() => {
    if (!ready || !title.current) return
    const reduced = prefersReducedMotion()
    const split = SplitText.create(title.current, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    if (!reduced) {
      tl.from(split.lines, { yPercent: 120, rotate: 3, transformOrigin: '0 100%', duration: 1.8, stagger: 0.11 }, 0.1)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1.4, stagger: 0.08 }, 0.6)
        .from('[data-hero-line]', { scaleX: 0, transformOrigin: '0 50%', duration: 1.6, ease: 'expo.inOut' }, 0.3)
    }
    tl.add(() => {
      document.dispatchEvent(new Event('hero:ready'))
    }, 0)

    // cycling role line
    const items = roleTrack.current?.children
    if (items && items.length && !reduced) {
      const loop = gsap.timeline({ repeat: -1, delay: 2.2 })
      for (let i = 1; i <= roles.length; i++) {
        loop.to(roleTrack.current, { yPercent: -(100 / (roles.length + 1)) * i, duration: 0.9, ease: 'expo.inOut' }, `+=1.8`)
      }
      loop.set(roleTrack.current, { yPercent: 0 })
    }

    // scroll-away: headline drifts up and fades as you leave the hero
    if (!reduced) {
      gsap.to('[data-hero-parallax]', {
        yPercent: -18, autoAlpha: 0.15, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }
    return () => split.revert()
  }, { scope: root, dependencies: [ready] })

  return (
    <section ref={root} id="top" className="relative flex h-[100svh] min-h-[560px] flex-col px-[var(--pad)] pb-6 pt-24 md:pb-8">
      {/* meta row */}
      <div className="grid grid-cols-2 gap-y-2 border-b border-line/0 pb-4 md:grid-cols-4" data-hero-fade>
        <span className="label">Portfolio — ’26</span>
        <span className="label hidden md:block">Agents · Automation · Vision</span>
        <span className="label hidden md:block">
          Vijayawada, IN · <Clock />
        </span>
        <span className="label flex items-center justify-end gap-2 text-bone md:justify-start">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
          </span>
          Open to work
        </span>
      </div>
      <div data-hero-line className="h-px w-full bg-line" />

      <div className="flex flex-1 flex-col justify-end" data-hero-parallax>
        <h1
          ref={title}
          className="display max-w-[14ch] pb-2 text-[clamp(3rem,min(8.4vw,15.5svh),10.5rem)] text-bone"
          aria-label="I build AI agents that decide — and show their work."
        >
          I build AI agents
          <br />
          that decide —
          <br />
          and <span className="serif-i text-ember">show their work.</span>
        </h1>
      </div>

      <div className="mt-8 grid items-end gap-6 md:mt-[min(3.5rem,5svh)] md:grid-cols-12">
        <div className="md:col-span-5" data-hero-fade>
          <p className="max-w-[34rem] text-[clamp(1rem,1.2vw,1.15rem)] leading-relaxed text-muted">
            I’m <span className="text-bone">{person.name}</span> — a CSE ’27 student at KL University building multi-agent systems, agentic automation and
            vision AI that stay grounded, measurable and accountable.
          </p>
          <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
            <span className="text-dim">Now building</span>
            <span className="h-px w-8 bg-line" />
            <span className="relative inline-block h-[1.4em] overflow-hidden text-bone">
              <span ref={roleTrack} className="flex flex-col">
                {[...roles, roles[0]].map((r, i) => (
                  <span key={i} className="block h-[1.4em] leading-[1.4em]">
                    {r}
                  </span>
                ))}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:col-span-4 md:col-start-7" data-hero-fade>
          <Magnetic>
            <button onClick={() => scrollToId('work')} className="btn btn-primary" data-cursor="View">
              <span data-magnetic-inner className="flex items-center gap-3">
                See the work <span className="btn-arrow">→</span>
              </span>
            </button>
          </Magnetic>
          <Magnetic>
            <a href={person.resume} target="_blank" rel="noreferrer" className="btn btn-ghost">
              <span data-magnetic-inner className="flex items-center gap-3">
                Résumé <span className="btn-arrow">↗</span>
              </span>
            </a>
          </Magnetic>
        </div>

        <div className="hidden justify-end md:col-span-2 md:col-start-11 md:flex" data-hero-fade>
          <button onClick={() => scrollToId('manifesto')} className="group flex items-center gap-3" aria-label="Scroll to the next section">
            <span className="label">Scroll</span>
            <span className="relative h-12 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(.76,0,.24,1)_infinite] bg-ember" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
