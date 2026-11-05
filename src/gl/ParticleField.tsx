import { useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Sphere,
  Vector3,
  WebGLRenderer,
} from 'three'
import { SHAPES } from './shapes'
import { vertexShader, fragmentShader } from './shaders'
import { fieldState } from './fieldState'
import { gsap, scrollState, prefersReducedMotion } from '../lib/motion'

const idle = () =>
  new Promise<void>((r) => {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => r(), { timeout: 120 })
    else setTimeout(r, 16)
  })

/**
 * Persistent WebGL particle field (vanilla three.js — no React renderer overhead).
 * Shapes are generated progressively in idle time so the first paint stays light.
 */
export default function ParticleField() {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !host.current) return
    const el = host.current
    let disposed = false
    let cleanup = () => {}

    const start = async () => {
      const w = window.innerWidth
      const cores = navigator.hardwareConcurrency || 4
      const count = w < 768 ? 7000 : cores >= 8 ? 24000 : 15000

      // progressive generation — one shape per idle slice
      const shapes: Float32Array[] = []
      for (const fn of SHAPES) {
        await idle()
        if (disposed) return
        shapes.push(fn(count))
      }
      await idle()
      if (disposed) return

      const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
      let dpr = Math.min(window.devicePixelRatio, 1.75)
      renderer.setPixelRatio(dpr)
      renderer.setSize(window.innerWidth, window.innerHeight)
      el.appendChild(renderer.domElement)
      renderer.domElement.style.opacity = '0'
      renderer.domElement.style.transition = 'opacity 1.2s ease'
      requestAnimationFrame(() => (renderer.domElement.style.opacity = '1'))

      const scene = new Scene()
      const camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 60)
      camera.position.set(0, 0, 10)

      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(shapes[0].slice(), 3))
      shapes.forEach((arr, i) => geometry.setAttribute(`s${i}`, new BufferAttribute(arr, 3)))
      const rand = new Float32Array(count)
      for (let i = 0; i < count; i++) rand[i] = Math.random()
      geometry.setAttribute('aRand', new BufferAttribute(rand, 1))
      geometry.boundingSphere = new Sphere(new Vector3(), 50)

      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uFrom: { value: 0 },
          uTo: { value: 0 },
          uT: { value: 1 },
          uSize: { value: w < 768 ? 3.0 : 2.6 },
          uPixel: { value: dpr },
          uEmber: { value: 0.1 },
          uOpacity: { value: 0 },
          uMouse: { value: new Vector3(99, 99, 0) },
          uMouseStrength: { value: 0 },
        },
      })

      const points = new Points(geometry, material)
      points.frustumCulled = false
      const group = new Group()
      group.add(points)
      scene.add(group)

      // pointer
      const pointer = { x: 0, y: 0, active: 0 }
      const onMove = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1
        pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
        pointer.active = e.pointerType === 'mouse' ? 1 : 0
      }
      const onLeave = () => (pointer.active = 0)
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)

      const mouse = new Vector3(99, 99, 0)
      const target = new Vector3()
      const rot = { x: 0, y: 0 }
      let frames = 0
      let fpsStart = performance.now()
      let downgraded = false

      const tick = (_t: number, deltaMs: number) => {
        if (document.hidden) return
        const delta = Math.min(deltaMs / 1000, 0.05)
        const u = material.uniforms
        u.uTime.value += delta
        u.uFrom.value = fieldState.from
        u.uTo.value = fieldState.to
        u.uT.value = fieldState.t
        const narrow = window.innerWidth < 900
        // on phones text sits over the field — keep it a quiet backdrop except in the hero
        u.uOpacity.value = narrow ? fieldState.opacity * (fieldState.opacity < 0.99 ? 0.42 : 0.78) : fieldState.opacity
        u.uEmber.value = fieldState.ember

        // visible plane size at z=0
        const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
        const halfW = halfH * camera.aspect
        mouse.lerp(target.set(pointer.x * halfW, pointer.y * halfH, 0), 0.12)
        u.uMouse.value.copy(mouse)
        u.uMouseStrength.value += (pointer.active - u.uMouseStrength.value) * 0.05

        const v = Math.max(-40, Math.min(40, scrollState.velocity))
        if (fieldState.spin < 0.3) {
          const front = Math.round(rot.y / (Math.PI * 2)) * Math.PI * 2
          rot.y += (front - rot.y) * 0.025
        } else {
          rot.y += delta * (0.07 + Math.abs(v) * 0.004) * fieldState.spin
        }
        rot.x += (pointer.y * 0.18 * fieldState.spin - rot.x) * 0.04
        group.rotation.set(rot.x, rot.y + pointer.x * 0.25 * fieldState.spin, 0)

        const wide = window.innerWidth >= 900
        const tx = wide ? fieldState.x : 0
        const ty = wide ? fieldState.y : fieldState.y + (fieldState.x !== 0 ? 1.55 : 0)
        group.position.x += (tx - group.position.x) * 0.06
        group.position.y += (ty - group.position.y) * 0.06
        const s = fieldState.scale * (wide ? 1 : 0.62)
        group.scale.setScalar(group.scale.x + (s - group.scale.x) * 0.06)

        camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.03
        camera.position.y += (pointer.y * 0.22 - camera.position.y) * 0.03
        camera.lookAt(0, 0, 0)

        if (fieldState.opacity > 0.01) renderer.render(scene, camera)

        // adaptive quality: drop pixel ratio once if the device struggles
        if (!downgraded) {
          frames++
          const elapsed = performance.now() - fpsStart
          if (elapsed > 2500) {
            const fps = (frames * 1000) / elapsed
            if (fps < 42 && dpr > 1) {
              dpr = 1
              renderer.setPixelRatio(1)
              u.uPixel.value = 1
              downgraded = true
            }
            frames = 0
            fpsStart = performance.now()
            if (elapsed > 8000) downgraded = true
          }
        }
      }
      gsap.ticker.add(tick)

      cleanup = () => {
        gsap.ticker.remove(tick)
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerleave', onLeave)
        window.removeEventListener('resize', onResize)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    // start after first paint so the page becomes interactive sooner
    const t = window.setTimeout(start, 60)
    return () => {
      disposed = true
      clearTimeout(t)
      cleanup()
    }
  }, [])

  return <div ref={host} aria-hidden className="pointer-events-none fixed inset-0 z-0 [&>canvas]:block" />
}
