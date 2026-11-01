import { useRef, type ElementType, type ReactNode, type CSSProperties } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from '../lib/motion'

type Props = {
  as?: ElementType
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
  stagger?: number
  /** 'lines' = masked line rise, 'words' = word rise, 'fade' = soft fade-up for blocks */
  mode?: 'lines' | 'words' | 'fade'
  start?: string
  id?: string
}

/**
 * Scroll-triggered masked text reveal (GSAP SplitText).
 * Splitting is deferred until the element approaches the viewport, so page boot stays cheap.
 */
export default function Reveal({ as: Tag = 'div', children, className, style, delay = 0, stagger = 0.08, mode = 'lines', start = 'top 85%', id }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return

      if (mode === 'fade') {
        gsap.from(el, { y: 40, opacity: 0, duration: 1.4, delay, scrollTrigger: { trigger: el, start } })
        return
      }

      // keep it invisible (but laid out and still in the accessibility tree) until split
      gsap.set(el, { opacity: 0 })
      let split: SplitText | null = null
      const arm = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom+=35%',
        once: true,
        onEnter: () => {
          split = SplitText.create(el, {
            type: mode === 'lines' ? 'lines' : 'words,lines',
            mask: mode === 'lines' ? 'lines' : 'words',
            linesClass: 'split-line',
            aria: 'none',
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { opacity: 1 })
              const targets = mode === 'lines' ? self.lines : self.words
              return gsap.from(targets, {
                yPercent: 115,
                rotate: mode === 'lines' ? 2.5 : 0,
                transformOrigin: '0% 100%',
                duration: 1.5,
                stagger,
                delay,
                ease: 'expo.out',
                scrollTrigger: { trigger: el, start },
              })
            },
          })
        },
      })
      return () => {
        arm.kill()
        split?.revert()
      }
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className} style={style} id={id}>
      {children}
    </Tag>
  )
}
