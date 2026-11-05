import { useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/motion'
import type { MapNode, NodeKind, SystemMapData } from '../content/maps'

const VB_W = 100
const VB_H = 56

const kindStyle: Record<NodeKind, string> = {
  input: 'border-line bg-ink/90 text-bone/85',
  ai: 'border-ember/70 bg-[#1c120e]/95 text-bone shadow-[0_0_24px_-6px_rgba(255,77,31,0.55)]',
  rule: 'border-bone/25 bg-ink/90 text-bone',
  gate: 'border-dashed border-ember-soft/80 bg-ink/90 text-bone',
  hub: 'border-bone bg-bone text-ink',
  store: 'border-line bg-surface/95 text-bone/90',
  output: 'border-ember bg-ember text-ink',
}
const kindTag: Record<NodeKind, string> = {
  input: 'in', ai: 'ai', rule: 'rule', gate: 'gate', hub: 'hub', store: 'store', output: 'out',
}

function edgePath(a: MapNode, b: MapNode) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dx) >= Math.abs(dy)) {
    const c = dx * 0.5
    return `M ${a.x} ${a.y} C ${a.x + c} ${a.y}, ${b.x - c} ${b.y}, ${b.x} ${b.y}`
  }
  const c = dy * 0.5
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + c}, ${b.x} ${b.y - c}, ${b.x} ${b.y}`
}

export default function SystemMap({ data, id }: { data: SystemMapData; id: string }) {
  const root = useRef<HTMLElement>(null)
  const [hover, setHover] = useState<string | null>(null)
  const byId = useMemo(() => Object.fromEntries(data.nodes.map((n) => [n.id, n])), [data])
  const steps = useMemo(() => {
    const m = new Map<number, MapNode[]>()
    data.nodes.forEach((n) => m.set(n.step, [...(m.get(n.step) ?? []), n]))
    return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v)
  }, [data])
  const edges = useMemo(
    () => data.edges.map((e, i) => ({ ...e, key: `${id}-e${i}`, d: edgePath(byId[e.from], byId[e.to]) })),
    [data, byId, id],
  )

  useGSAP(
    () => {
      const svg = root.current?.querySelector('svg') as SVGSVGElement | null
      svg?.pauseAnimations()
      if (prefersReducedMotion()) {
        gsap.set('[data-packets]', { autoAlpha: 1 })
        return
      }
      // SMIL runs on the main thread — only animate packets while the map is on screen
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (st) => (st.isActive ? svg?.unpauseAnimations() : svg?.pauseAnimations()),
      })
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      const STEP = 0.32
      data.nodes.forEach((n) => {
        tl.from(`[data-node="${n.id}"]`, { autoAlpha: 0, scale: 0.8, y: 10, duration: 0.7, ease: 'back.out(2)' }, n.step * STEP)
      })
      edges.forEach((e) => {
        const at = byId[e.from].step * STEP + 0.25
        if (e.dashed) tl.from(`[data-edge="${e.key}"]`, { autoAlpha: 0, duration: 0.6 }, at)
        else tl.from(`[data-edge="${e.key}"]`, { drawSVG: '0%', duration: 0.7, ease: 'power2.inOut' }, at)
      })
      tl.to('[data-packets]', { autoAlpha: 1, duration: 0.6 })
      gsap.from('[data-mstep]', { y: 24, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 80%' } })
      tl.from('[data-map-legend] > *', { autoAlpha: 0, y: 6, stagger: 0.05, duration: 0.5 }, '<')
    },
    { scope: root },
  )

  const touches = (key: string) => {
    if (!hover) return null
    const e = edges.find((x) => x.key === key)!
    return e.from === hover || e.to === hover
  }

  return (
    <figure ref={root} className="rounded-[18px] border border-line bg-ink-2/80 p-5 backdrop-blur-sm md:p-7">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="label text-ember">Fig. — System map</span>
        <span className="text-[15px] font-semibold tracking-tight text-bone">{data.title}</span>
      </figcaption>

      {/* phones: vertical step flow */}
      <ol className="relative mt-6 md:hidden" aria-label={data.title}>
        <span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-px bg-line" />
        <span aria-hidden className="absolute left-[8px] h-[7px] w-[7px] animate-[mapflow_3.4s_linear_infinite] rounded-full bg-ember shadow-[0_0_10px_2px_rgba(255,77,31,0.7)]" />
        {steps.map((group, gi) => (
          <li key={gi} data-mstep className="relative grid grid-cols-[24px_1fr] gap-3 pb-4 last:pb-0">
            <span aria-hidden className="relative z-10 mt-3 grid h-[23px] w-[23px] place-items-center rounded-full border border-line bg-ink font-mono text-[9px] text-muted">
              {gi + 1}
            </span>
            <div className="flex flex-wrap gap-2">
              {group.map((n) => (
                <div key={n.id} className={`min-w-[44%] flex-1 rounded-xl border px-3 py-2 ${kindStyle[n.kind]}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-semibold leading-tight tracking-tight">{n.label}</span>
                    <span className={`mt-px shrink-0 font-mono text-[8.5px] uppercase tracking-widest ${n.kind === 'hub' || n.kind === 'output' ? 'text-ink/60' : n.kind === 'ai' || n.kind === 'gate' ? 'text-ember' : 'text-muted'}`}>
                      {kindTag[n.kind]}
                    </span>
                  </div>
                  {n.sub && <div className={`mt-1 font-mono text-[10px] leading-snug ${n.kind === 'hub' || n.kind === 'output' ? 'text-ink/70' : 'text-muted'}`}>{n.sub}</div>}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>

      {/* tablets & desktop: full graph */}
      <div className="mt-6 hidden md:block">
        <div className="relative min-w-[680px]" style={{ aspectRatio: `${VB_W} / ${VB_H}` }} onPointerLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            {edges.map((e) => {
              const t = touches(e.key)
              return (
                <path
                  key={e.key}
                  id={e.key}
                  data-edge={e.key}
                  data-dashed={e.dashed ? '' : undefined}
                  d={e.d}
                  fill="none"
                  strokeWidth={t ? 0.26 : 0.15}
                  strokeLinecap="round"
                  strokeDasharray={e.dashed ? '0.7 0.6' : undefined}
                  className="transition-[stroke,opacity,stroke-width] duration-300"
                  style={{
                    stroke: t ? '#FF4D1F' : e.dashed ? 'rgba(237,232,223,0.3)' : 'rgba(237,232,223,0.45)',
                    opacity: hover && !t ? 0.25 : 1,
                  }}
                />
              )
            })}
            <g data-packets style={{ opacity: 0, visibility: 'hidden' }}>
              {edges
                .filter((e) => !e.dashed)
                .map((e, i) => (
                  <circle key={e.key} r={0.5} fill="#FF4D1F" style={{ filter: 'drop-shadow(0 0 0.8px #FF4D1F)' }}>
                    <animateMotion dur={`${1.8 + (i % 4) * 0.35}s`} begin={`${(i * 0.37) % 2}s`} repeatCount="indefinite" rotate="auto">
                      <mpath href={`#${e.key}`} />
                    </animateMotion>
                  </circle>
                ))}
            </g>
          </svg>

          {data.nodes.map((n) => (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${(n.y / VB_H) * 100}%`, width: `${data.nodeW ?? 17.5}%` }}
            >
              <div
                data-node={n.id}
                onPointerEnter={() => setHover(n.id)}
                className={`rounded-xl border px-2.5 py-2 transition-[box-shadow,border-color] duration-300 ${kindStyle[n.kind]} ${hover === n.id ? 'ring-1 ring-ember/70' : ''}`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[12px] font-semibold leading-[1.15] tracking-tight">{n.label}</span>
                  <span className={`mt-px shrink-0 font-mono text-[8.5px] uppercase tracking-widest ${n.kind === 'hub' || n.kind === 'output' ? 'text-ink/60' : n.kind === 'ai' || n.kind === 'gate' ? 'text-ember' : 'text-muted'}`}>
                    {kindTag[n.kind]}
                  </span>
                </div>
                {n.sub && (
                  <div className={`mt-1 font-mono text-[9.5px] leading-snug ${n.kind === 'hub' || n.kind === 'output' ? 'text-ink/70' : 'text-muted'}`}>{n.sub}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-line pt-4 md:flex-row md:items-start md:justify-between">
        <p className="max-w-md text-[13px] leading-relaxed text-muted">{data.caption}</p>
        <ul data-map-legend className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-widest text-muted">
          <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ember shadow-[0_0_8px_rgba(255,77,31,0.8)]" />AI judgment</li>
          <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm border border-bone/50" />Deterministic</li>
          <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm border border-dashed border-ember-soft" />Gate</li>
          <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-ember" />Outcome</li>
        </ul>
      </div>
    </figure>
  )
}
