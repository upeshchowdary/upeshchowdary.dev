import { type RefObject } from 'react'
import { ScrollTrigger, useGSAP } from './motion'
import { applyField, type FieldConfig } from '../gl/fieldState'

/** When the section owns the viewport centre, morph the particle field to its config. */
export function useField(ref: RefObject<HTMLElement | null>, cfg: FieldConfig) {
  useGSAP(() => {
    if (!ref.current) return
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: (self) => self.isActive && applyField(cfg),
    })
    return () => st.kill()
  }, { dependencies: [] })
}
