import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { useField } from '../lib/useField'
import { principles } from '../content/data'
import Reveal from '../components/Reveal'
import RuleWidget from '../components/RuleWidget'

export default function Principles() {
  const root = useRef<HTMLElement>(null)
  useField(root, { shape: 1, x: 2.4, y: 0, scale: 0.9, opacity: 0.5, spin: 0.5, ember: 0.18 })

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const cards = gsap.utils.toArray<HTMLElement>('[data-rule]')
    cards.forEach((card, i) => {
      const next = cards[i + 1]
      if (!next) return
      gsap.to(card.querySelector('[data-rule-inner]'), {
        scale: 0.92, filter: 'brightness(0.45)', ease: 'none',
        scrollTrigger: { trigger: next, start: 'top 72%', end: 'top 22%', scrub: true },
      })
    })
  }, { scope: root })

  return (
    <section ref={root} id="principles" className="relative px-[var(--pad)] py-[clamp(6rem,14vh,10rem)]">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="mb-8 flex items-center gap-4">
            <span className="label text-ember">REC-03</span>
            <span className="h-px w-10 bg-line" />
            <span className="label">How I build</span>
          </div>
        </div>
        <div className="md:col-span-8">
          <Reveal as="h2" className="display text-[clamp(2.8rem,7vw,8rem)]">
            Four rules <span className="serif-i font-normal tracking-normal text-ember">I build by.</span>
          </Reveal>
          <Reveal as="p" mode="fade" className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Reliability isn’t a feature you add at the end. It’s a set of decisions about who gets to decide — the model, the rules, or a person.
          </Reveal>
        </div>
      </div>

      <div className="relative mt-[clamp(3rem,8vh,6rem)]">
        {principles.map((p, i) => (
          <article
            key={p.n}
            data-rule
            className="sticky mb-[8vh] last:mb-0"
            style={{ top: `calc(14vh + ${i * 26}px)` }}
          >
            <div
              data-rule-inner
              className="relative grid min-h-[58vh] origin-top overflow-hidden rounded-[28px] border border-line bg-[linear-gradient(160deg,#181816,#0f0f0e_60%)] p-[clamp(1.5rem,4vw,3.5rem)] md:grid-cols-12 md:gap-8"
            >
              <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ember/10 blur-3xl" />
              <div className="flex flex-col justify-between gap-8 md:col-span-5">
                <div className="flex items-start justify-between">
                  <span className="display text-[clamp(5rem,11vw,11rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_var(--color-ember)]">
                    {p.n}
                  </span>
                  <span className="label md:hidden">Rule {p.n} / 04</span>
                </div>
                <div className="rounded-2xl border border-line bg-ink/60 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="label !text-[10px]">Live · rule {p.n}</span>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
                  </div>
                  <RuleWidget kind={p.widget} />
                </div>
              </div>
              <div className="flex flex-col justify-end md:col-span-7">
                <h3 className="text-[clamp(2rem,4.2vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.035em] text-bone">{p.title}</h3>
                <p className="mt-6 max-w-2xl text-[clamp(1rem,1.2vw,1.2rem)] leading-relaxed text-muted">{p.body}</p>
                <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-bone/80">
                  <span className="text-ember">Seen in</span>
                  <span className="h-3 w-px bg-line" />
                  {p.proof}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
