import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, scrollToId } from '../lib/motion'
import { chapters, person } from '../content/data'
import Magnetic from './Magnetic'

const links = [
  { id: 'work', label: 'Work' },
  { id: 'principles', label: 'Approach' },
  { id: 'about', label: 'About' },
  { id: 'recognition', label: 'Proof' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav({ ready }: { ready: boolean }) {
  const bar = useRef<HTMLElement>(null)
  const [chapter, setChapter] = useState(chapters[0])
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)

  // chapter tracker
  useGSAP(() => {
    const triggers = chapters.map((c) => {
      const el = document.getElementById(c.id)
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (s) => s.isActive && setChapter(c),
      })
    })
    // hide on scroll down, reveal on scroll up
    const hide = ScrollTrigger.create({
      start: 'top -120',
      onUpdate: (s) => {
        if (!bar.current || open) return
        gsap.to(bar.current, { yPercent: s.direction === 1 ? -120 : 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
      },
    })
    return () => { triggers.forEach((t) => t?.kill()); hide.kill() }
  }, { dependencies: [ready, open] })

  useGSAP(() => {
    if (!ready || !bar.current) return
    gsap.from(bar.current.querySelectorAll('[data-nav-in]'), { yPercent: 120, autoAlpha: 0, stagger: 0.06, duration: 1.2, delay: 0.5 })
  }, { dependencies: [ready] })

  useEffect(() => {
    const m = menu.current
    if (!m) return
    if (open) {
      gsap.set(m, { display: 'flex' })
      gsap.fromTo(m, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
      gsap.from(m.querySelectorAll('[data-menu-item]'), { yPercent: 110, stagger: 0.06, duration: 1, delay: 0.3 })
    } else {
      gsap.to(m, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'expo.inOut', onComplete: () => { gsap.set(m, { display: 'none' }) } })
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-[var(--pad)] py-5">
          <button onClick={() => go('top')} className="group flex items-center gap-3 overflow-hidden text-bone" aria-label="Back to top" data-nav-in>
            <span className="relative grid h-8 w-8 place-items-center">
              <span className="absolute inset-0 rounded-full border border-bone/40 transition-transform duration-700 group-hover:rotate-180 [border-style:dashed]" />
              <span className="h-2 w-2 rounded-full bg-ember" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">{person.name}</span>
          </button>

          <div className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bone/60 md:flex" data-nav-in>
            <span className="text-ember">●</span>
            <span key={chapter.code} className="inline-block animate-[fadein_0.6s_ease]">
              {chapter.code} · {chapter.label}
            </span>
          </div>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {links.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className="ulink text-[14px] text-bone/80 transition-colors hover:text-bone" data-nav-in>
                {l.label}
              </button>
            ))}
            <span data-nav-in>
              <Magnetic strength={0.3}>
                <a href={`mailto:${person.email}`} className="btn btn-ghost !h-10 !px-5 !text-[10px]">
                  <span data-magnetic-inner>Let’s talk</span>
                </a>
              </Magnetic>
            </span>
          </nav>

          <button
            className="flex h-10 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bone lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            data-nav-in
          >
            {open ? 'Close' : 'Menu'}
            <span className="relative block h-2.5 w-5">
              <span className={`absolute left-0 h-px w-full bg-bone transition-transform duration-500 ${open ? 'top-1/2 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-full bg-bone transition-transform duration-500 ${open ? 'top-1/2 -rotate-45' : 'bottom-0'}`} />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        className="fixed inset-0 z-40 hidden flex-col justify-end bg-ink px-[var(--pad)] pb-12 pt-28"
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      >
        <ul className="space-y-1">
          {links.map((l, i) => (
            <li key={l.id} className="overflow-hidden">
              <button data-menu-item onClick={() => go(l.id)} className="display flex items-baseline gap-4 text-[clamp(3rem,13vw,6rem)] text-bone">
                <span className="font-mono text-xs tracking-widest text-ember">0{i + 1}</span>
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest text-muted">
          <a href={`mailto:${person.email}`}>Email</a>
          <a href={person.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={person.links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={person.resume} target="_blank" rel="noreferrer">Résumé</a>
        </div>
      </div>
    </>
  )
}
