import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SHAPES } from './shapes'
import { vertexShader, fragmentShader } from './shaders'
import { fieldState } from './fieldState'
import { scrollState, prefersReducedMotion } from '../lib/motion'

const pointer = { x: 0, y: 0, active: 0 }

function Particles({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null)
  const group = useRef<THREE.Group>(null)
  const { size, viewport, camera } = useThree()

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const shapes = SHAPES.map((fn) => fn(count))
    g.setAttribute('position', new THREE.BufferAttribute(shapes[0].slice(), 3))
    shapes.forEach((arr, i) => g.setAttribute(`s${i}`, new THREE.BufferAttribute(arr, 3)))
    const rand = new Float32Array(count)
    for (let i = 0; i < count; i++) rand[i] = Math.random()
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50)
    return g
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uFrom: { value: 0 },
          uTo: { value: 0 },
          uT: { value: 1 },
          uSize: { value: 2.6 },
          uPixel: { value: Math.min(window.devicePixelRatio, 1.75) },
          uEmber: { value: 0.1 },
          uOpacity: { value: 0 },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
          uMouseStrength: { value: 0 },
        },
      }),
    [],
  )

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  const mouse = useRef(new THREE.Vector3(99, 99, 0))
  const rot = useRef({ y: 0, x: 0 })

  useFrame((_, dt) => {
    const u = material.uniforms
    const delta = Math.min(dt, 0.05)
    u.uTime.value += delta
    u.uFrom.value = fieldState.from
    u.uTo.value = fieldState.to
    u.uT.value = fieldState.t
    u.uOpacity.value = fieldState.opacity
    u.uEmber.value = fieldState.ember

    // pointer → world plane z=0
    const halfW = viewport.width / 2
    const halfH = viewport.height / 2
    mouse.current.lerp(new THREE.Vector3(pointer.x * halfW, pointer.y * halfH, 0), 0.12)
    u.uMouse.value.copy(mouse.current)
    u.uMouseStrength.value += (pointer.active - u.uMouseStrength.value) * 0.05

    const g = group.current
    if (g) {
      const v = Math.max(-40, Math.min(40, scrollState.velocity))
      if (fieldState.spin < 0.3) {
        // flat shapes (terrain, chart) settle face-forward instead of turning edge-on
        const front = Math.round(rot.current.y / (Math.PI * 2)) * Math.PI * 2
        rot.current.y += (front - rot.current.y) * 0.025 + Math.sin(u.uTime.value * 0.4) * 0.0008
      } else {
        rot.current.y += delta * (0.07 + Math.abs(v) * 0.004) * fieldState.spin
      }
      rot.current.x += (pointer.y * 0.18 * fieldState.spin - rot.current.x) * 0.04
      g.rotation.set(rot.current.x, rot.current.y + pointer.x * 0.25 * fieldState.spin, 0)
      // responsive x offset: shapes sit to the side on wide screens, centred on narrow ones
      const wide = size.width >= 900
      const tx = wide ? fieldState.x : 0
      const ty = wide ? fieldState.y : fieldState.y + (fieldState.x !== 0 ? 0.9 : 0)
      g.position.x += (tx - g.position.x) * 0.06
      g.position.y += (ty - g.position.y) * 0.06
      const s = fieldState.scale * (wide ? 1 : 0.62)
      g.scale.setScalar(g.scale.x + (s - g.scale.x) * 0.06)
    }
    camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.03
    camera.position.y += (pointer.y * 0.22 - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  )
}

export default function ParticleField() {
  const reduced = prefersReducedMotion()
  const count = useMemo(() => {
    const w = window.innerWidth
    const cores = navigator.hardwareConcurrency || 4
    if (w < 768) return 9000
    return cores >= 8 ? 26000 : 16000
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      pointer.active = e.pointerType === 'mouse' ? 1 : 0
    }
    const onLeave = () => (pointer.active = 0)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  if (reduced) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Particles count={count} />
      </Canvas>
    </div>
  )
}
