import { useRef, type ElementType, type ReactNode, type CSSProperties } from 'react'
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../lib/motion'

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
  /** if false, waits for the `play` event instead of scroll (used by the hero intro) */
  scroll?: boolean
  id?: string
}

/** Scroll-triggered masked text reveal built on GSAP SplitText. */
export default function Reveal({ as: Tag = 'div', children, className, style, delay = 0, stagger = 0.08, mode = 'lines', start = 'top 85%', scroll = true, id }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (prefersReducedMotion()) return

      if (mode === 'fade') {
        gsap.from(el, {
          y: 40, autoAlpha: 0, duration: 1.4, delay,
          scrollTrigger: scroll ? { trigger: el, start } : undefined,
        })
        return
      }

      const split = SplitText.create(el, {
        type: mode === 'lines' ? 'lines' : 'words,lines',
        mask: mode === 'lines' ? 'lines' : 'words',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          const targets = mode === 'lines' ? self.lines : self.words
          return gsap.from(targets, {
            yPercent: 115,
            rotate: mode === 'lines' ? 2.5 : 0,
            transformOrigin: '0% 100%',
            duration: 1.5,
            stagger,
            delay,
            ease: 'expo.out',
            scrollTrigger: scroll ? { trigger: el, start } : undefined,
          })
        },
      })
      return () => split.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className} style={style} id={id}>
      {children}
    </Tag>
  )
}
