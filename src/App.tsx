import { lazy, Suspense, useEffect, useState } from 'react'
import { initLenis, scrollState, ScrollTrigger } from './lib/motion'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import ProgressRail from './components/ProgressRail'
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import About from './sections/About'
import Principles from './sections/Principles'
import { WorkIndex } from './sections/Work'
import CaseStudy from './sections/CaseStudy'
import { projects } from './content/data'
import type { ComponentType } from 'react'
import Recognition from './sections/Recognition'
import Toolkit from './sections/Toolkit'
import Journey from './sections/Journey'
import Contact from './sections/Contact'

const ParticleField = lazy(() => import('./gl/ParticleField'))

// below-the-fold chapters mount progressively in idle time (keeps the main thread free on load)
const caseStudies: ComponentType[] = projects.map((p, i) => {
  const C = () => <CaseStudy project={p} flip={i % 2 === 1} />
  C.displayName = `CaseStudy(${p.id})`
  return C
})
const CHAPTERS: ComponentType[] = [Manifesto, About, Principles, WorkIndex, ...caseStudies, Recognition, Toolkit, Journey, Contact]

const hasIdle = typeof window.requestIdleCallback === 'function'
const whenIdle = (fn: () => void): number => (hasIdle ? window.requestIdleCallback(fn, { timeout: 250 }) : setTimeout(fn, 32))
const cancelIdle = (id: number) => (hasIdle ? window.cancelIdleCallback(id) : clearTimeout(id))

export default function App() {
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(0)
  const allMounted = mounted >= CHAPTERS.length

  useEffect(() => {
    if (allMounted) {
      const id = whenIdle(() => {
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      })
      return () => cancelIdle(id)
    }
    const id = whenIdle(() => setMounted((m) => m + 1))
    return () => cancelIdle(id)
  }, [mounted, allMounted])

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const lenis = initLenis()
    lenis.stop()
    lenis.on('scroll', (l: { velocity: number }) => {
      scrollState.velocity = l.velocity
    })
  }, [])

  useEffect(() => {
    if (ready) initLenis().start()
  }, [ready])

  return (
    <>
      {allMounted && (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      )}
      <div className="vignette" aria-hidden />

      <Nav ready={ready} sectionsReady={allMounted} />
      <main className="relative z-10">
        <Hero ready={ready} />
        {CHAPTERS.slice(0, mounted).map((Chapter, i) => (
          <Chapter key={i} />
        ))}
      </main>

      {allMounted && <ProgressRail />}
      <Cursor />
      <div className="grain" aria-hidden />
      <Preloader onDone={() => setReady(true)} />
    </>
  )
}
