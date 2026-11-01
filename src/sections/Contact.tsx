import { useRef, useState } from 'react'
import { gsap, useGSAP, scrollToId, prefersReducedMotion } from '../lib/motion'
import { useField } from '../lib/useField'
import { person } from '../content/data'
import Magnetic from '../components/Magnetic'
import Clock from '../components/Clock'
import Wordmark from '../components/Wordmark'

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  useField(root, { shape: 0, x: 0, y: 0.4, scale: 1.25, opacity: 0.55, spin: 1, ember: 0.22 })

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('[data-cta-line]', {
      yPercent: 110, stagger: 0.1, duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-cta]', start: 'top 80%' },
    })
    gsap.from('[data-contact-fade]', {
      y: 30, autoAlpha: 0, stagger: 0.08, duration: 1.2,
      scrollTrigger: { trigger: '[data-contact-grid]', start: 'top 90%' },
    })
  }, { scope: root })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${person.email}`
    }
  }

  const socials = [
    { label: 'LinkedIn', href: person.links.linkedin },
    { label: 'GitHub', href: person.links.github },
    { label: 'LeetCode', href: person.links.leetcode },
    { label: 'Résumé', href: person.resume },
  ]

  return (
    <section ref={root} id="contact" className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-[var(--pad)] pb-0 pt-[clamp(6rem,14vh,10rem)]">
      <div>
        <div className="flex items-center gap-4">
          <span className="label text-ember">REC-08</span>
          <span className="h-px w-10 bg-line" />
          <span className="label">Contact · Open to work</span>
        </div>

        <a href={`mailto:${person.email}`} data-cta data-cursor="Write" className="group mt-10 block">
          <span className="display block text-[clamp(3.4rem,10.5vw,13rem)] text-bone">
            <span className="block overflow-hidden"><span data-cta-line className="block">Let’s build</span></span>
            <span className="block overflow-hidden">
              <span data-cta-line className="block">
                something that <span className="serif-i font-normal tracking-normal text-ember transition-[letter-spacing] duration-700 group-hover:tracking-[0.02em]">thinks.</span>
              </span>
            </span>
          </span>
        </a>
      </div>

      <div data-contact-grid className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-12">
        <div className="md:col-span-5" data-contact-fade>
          <span className="label">Email</span>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <a href={`mailto:${person.email}`} className="ulink text-[clamp(1.3rem,2.2vw,2rem)] font-semibold tracking-tight text-bone">
              {person.email}
            </a>
            <button onClick={copy} className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-ember hover:text-bone" aria-live="polite">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
          <span className="label mt-8 block">Phone</span>
          <a href={person.phoneHref} className="ulink mt-3 inline-block text-[clamp(1.1rem,1.6vw,1.5rem)] text-bone">
            {person.phone}
          </a>
        </div>

        <div className="md:col-span-3" data-contact-fade>
          <span className="label">Elsewhere</span>
          <ul className="mt-3 space-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-lg text-bone">
                  <span className="ulink">{s.label}</span>
                  <span className="text-ember transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-8 md:col-span-4" data-contact-fade>
          <div>
            <span className="label">Status</span>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Open to roles building AI agents, multi-agent systems and agentic automation — {person.openTo}.
            </p>
          </div>
          <Magnetic className="self-start">
            <a href={person.resume} target="_blank" rel="noreferrer" className="btn btn-primary">
              <span data-magnetic-inner className="flex items-center gap-3">
                Download résumé <span className="btn-arrow">↓</span>
              </span>
            </a>
          </Magnetic>
        </div>
      </div>

      <footer className="mt-16 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted md:flex-row md:items-center md:justify-between">
        <span>© 2026 {person.fullName}</span>
        <span>
          {person.location} · <Clock />
        </span>
        <button onClick={() => scrollToId('top')} className="ulink self-start text-bone md:self-auto">
          Back to top ↑
        </button>
      </footer>
      <div className="-mx-[calc(var(--pad)*0.5)] mt-10">
        <Wordmark text="UPESH CHOWDARY" />
      </div>
    </section>
  )
}
