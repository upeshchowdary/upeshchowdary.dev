import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'

/** Thin scroll progress rail on the right edge with an ember head. */
export default function ProgressRail() {
  const fill = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    gsap.to(fill.current, {
      height: '100%',
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    })
  })
  return (
    <div aria-hidden className="pointer-events-none fixed right-4 top-1/2 z-40 hidden h-[34vh] w-px -translate-y-1/2 bg-bone/10 md:block">
      <div ref={fill} className="relative h-0 w-full bg-bone/60">
        <span className="absolute -bottom-1 -left-[3px] h-[7px] w-[7px] rounded-full bg-ember shadow-[0_0_12px_2px_rgba(255,77,31,0.6)]" />
      </div>
    </div>
  )
}
