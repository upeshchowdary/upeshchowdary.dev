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
import Work from './sections/Work'
import Recognition from './sections/Recognition'
import Toolkit from './sections/Toolkit'
import Journey from './sections/Journey'
import Contact from './sections/Contact'

const ParticleField = lazy(() => import('./gl/ParticleField'))

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const lenis = initLenis()
    lenis.stop()
    lenis.on('scroll', (l: { velocity: number }) => {
      scrollState.velocity = l.velocity
    })
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (!ready) return
    initLenis().start()
    ScrollTrigger.refresh()
  }, [ready])

  return (
    <>
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>
      <div className="vignette" aria-hidden />

      <Nav ready={ready} />
      <main className="relative z-10">
        <Hero ready={ready} />
        <Manifesto />
        <About />
        <Principles />
        <Work />
        <Recognition />
        <Toolkit />
        <Journey />
        <Contact />
      </main>

      <ProgressRail />
      <Cursor />
      <div className="grain" aria-hidden />
      <Preloader onDone={() => setReady(true)} />
    </>
  )
}
