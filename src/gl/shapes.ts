// Point-cloud generators for the morphing particle field.
// Each returns Float32Array(count * 3). Scene units: camera at z≈10, visible height ≈ 6.3.

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const gauss = (r: () => number) => {
  const u = 1 - r()
  const v = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

type V3 = [number, number, number]

function rotX([x, y, z]: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a)
  return [x, y * c - z * s, y * s + z * c]
}
function rotZ([x, y, z]: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a)
  return [x * c - y * s, x * s + y * c, z]
}
function rotY([x, y, z]: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a)
  return [x * c + z * s, y, -x * s + z * c]
}

function fibSphere(i: number, n: number, r: number): V3 {
  const y = 1 - (i / (n - 1)) * 2
  const rad = Math.sqrt(1 - y * y)
  const th = Math.PI * (3 - Math.sqrt(5)) * i
  return [Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r]
}

/** 0 · Agent core — a dense sphere with three tilted orbital rings (agents in orbit). */
export function core(n: number) {
  const out = new Float32Array(n * 3)
  const r = rng(11)
  const sphereN = Math.floor(n * 0.56)
  for (let i = 0; i < n; i++) {
    let p: V3
    if (i < sphereN) {
      p = fibSphere(i, sphereN, 1.45 + gauss(r) * 0.035)
    } else {
      const ring = i % 3
      const radius = [2.15, 2.55, 2.95][ring]
      const a = r() * Math.PI * 2
      const thick = gauss(r) * 0.025
      p = [Math.cos(a) * (radius + thick), gauss(r) * 0.02, Math.sin(a) * (radius + thick)]
      // agents: little clusters on the rings
      if (r() < 0.18) {
        const node = Math.floor(r() * 5) / 5
        const na = node * Math.PI * 2 + ring
        p = [Math.cos(na) * radius + gauss(r) * 0.06, gauss(r) * 0.06, Math.sin(na) * radius + gauss(r) * 0.06]
      }
      p = rotX(p, [1.15, 1.45, 1.75][ring])
      p = rotZ(p, [0.35, -0.45, 0.1][ring])
    }
    out.set(p, i * 3)
  }
  return out
}

/** 1 · Orchestrated network — a hub (orchestrator), five agents in a chain, and their tools. */
export function network(n: number) {
  const out = new Float32Array(n * 3)
  const r = rng(23)
  const hub: V3 = [0, 0, 0]
  const agents: V3[] = []
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2
    agents.push([Math.cos(a) * 2.1, Math.sin(a) * 1.35, Math.sin(a * 2) * 0.45])
  }
  const tools: { at: V3; parent: number }[] = []
  agents.forEach((ag, i) => {
    for (let k = 0; k < 6; k++) {
      const dir: V3 = [ag[0] * 0.38 + gauss(r) * 0.42, ag[1] * 0.38 + gauss(r) * 0.42, gauss(r) * 0.42]
      tools.push({ at: [ag[0] + dir[0], ag[1] + dir[1], ag[2] + dir[2]], parent: i })
    }
  })
  const edges: [V3, V3, number][] = [] // [a, b, weight]
  agents.forEach((ag, i) => {
    edges.push([hub, ag, 3]) // orchestrator ↔ agent
    edges.push([ag, agents[(i + 1) % 5], i === 4 ? 0.6 : 2]) // the unit's journey
  })
  tools.forEach((t) => edges.push([agents[t.parent], t.at, 1]))
  const totalW = edges.reduce((s, e) => s + e[2], 0)
  const pickEdge = () => {
    let x = r() * totalW
    for (const e of edges) { x -= e[2]; if (x <= 0) return e }
    return edges[0]
  }
  for (let i = 0; i < n; i++) {
    const k = r()
    let p: V3
    if (k < 0.1) {
      const s = 0.16
      p = [gauss(r) * s, gauss(r) * s, gauss(r) * s] // dense orchestrator core
    } else if (k < 0.3) {
      const a = agents[Math.floor(r() * 5)]
      const s = 0.09
      p = [a[0] + gauss(r) * s, a[1] + gauss(r) * s, a[2] + gauss(r) * s]
    } else if (k < 0.38) {
      const t = tools[Math.floor(r() * tools.length)].at
      const s = 0.035
      p = [t[0] + gauss(r) * s, t[1] + gauss(r) * s, t[2] + gauss(r) * s]
    } else {
      const [a, b] = pickEdge()
      const t = r()
      const j = 0.012
      p = [a[0] + (b[0] - a[0]) * t + gauss(r) * j, a[1] + (b[1] - a[1]) * t + gauss(r) * j, a[2] + (b[2] - a[2]) * t + gauss(r) * j]
    }
    out.set(p, i * 3)
  }
  return out
}

/** 2 · CUBE — wireframe cube with sparse faces and a unit inside. */
export function cube(n: number) {
  const out = new Float32Array(n * 3)
  const r = rng(37)
  const edgesOf = (h: number) => {
    const e: [V3, V3][] = []
    const c = [-h, h]
    for (const a of c) for (const b of c) {
      e.push([[-h, a, b], [h, a, b]])
      e.push([[a, -h, b], [a, h, b]])
      e.push([[a, b, -h], [a, b, h]])
    }
    return e
  }
  const outer = edgesOf(1.45)
  const inner = edgesOf(0.5)
  for (let i = 0; i < n; i++) {
    const k = r()
    let p: V3
    if (k < 0.5) {
      const [a, b] = outer[Math.floor(r() * 12)]
      const t = r()
      p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
      p = [p[0] + gauss(r) * 0.012, p[1] + gauss(r) * 0.012, p[2] + gauss(r) * 0.012]
    } else if (k < 0.66) {
      const [a, b] = inner[Math.floor(r() * 12)]
      const t = r()
      p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
    } else {
      // faces — sparse dust
      const axis = Math.floor(r() * 3)
      const side = r() < 0.5 ? -1.45 : 1.45
      const u = (r() * 2 - 1) * 1.45, v = (r() * 2 - 1) * 1.45
      p = axis === 0 ? [side, u, v] : axis === 1 ? [u, side, v] : [u, v, side]
    }
    p = rotY(rotX(p, 0.55), 0.7)
    out.set(p, i * 3)
  }
  return out
}

/** 3 · Data terrain — a tilted signal landscape (commerce analytics). */
export function terrain(n: number) {
  const out = new Float32Array(n * 3)
  const r = rng(53)
  const rows = 46
  for (let i = 0; i < n; i++) {
    const row = Math.floor(r() * rows)
    const z = (row / (rows - 1)) * 4.2 - 2.1
    const x = (r() * 2 - 1) * 3.6
    const h =
      0.38 * Math.sin(x * 1.1 + z * 0.7) +
      0.22 * Math.sin(x * 2.3 - z * 1.9) +
      0.5 * Math.exp(-((x - 1.1) ** 2 + (z + 0.4) ** 2) * 1.2) -
      0.3 * Math.exp(-((x + 1.6) ** 2 + (z - 0.6) ** 2) * 1.5)
    let p: V3 = [x, h, z]
    p = rotX(p, 0.62)
    out.set([p[0], p[1] - 0.2, p[2]], i * 3)
  }
  return out
}

/** 4 · Globe — dotted planet with road-like great-circle arcs. */
export function globe(n: number) {
  const out = new Float32Array(n * 3)
  const r = rng(71)
  const R = 1.85
  const arcs: { axis: V3; phase: number; len: number }[] = []
  for (let i = 0; i < 26; i++) {
    const ax: V3 = [gauss(r), gauss(r), gauss(r)]
    const l = Math.hypot(...ax)
    arcs.push({ axis: [ax[0] / l, ax[1] / l, ax[2] / l], phase: r() * Math.PI * 2, len: 0.4 + r() * 1.2 })
  }
  const surfN = Math.floor(n * 0.66)
  for (let i = 0; i < n; i++) {
    let p: V3
    if (i < surfN) {
      p = fibSphere(i, surfN, R)
    } else {
      const a = arcs[Math.floor(r() * arcs.length)]
      // orthonormal basis around axis
      const [ax, ay, az] = a.axis
      const t1: V3 = Math.abs(ax) < 0.9 ? [0, -az, ay] : [-az, 0, ax]
      const l1 = Math.hypot(...t1)
      const u: V3 = [t1[0] / l1, t1[1] / l1, t1[2] / l1]
      const v: V3 = [ay * u[2] - az * u[1], az * u[0] - ax * u[2], ax * u[1] - ay * u[0]]
      const th = a.phase + r() * a.len
      const rr = R * 1.012
      p = [
        (u[0] * Math.cos(th) + v[0] * Math.sin(th)) * rr,
        (u[1] * Math.cos(th) + v[1] * Math.sin(th)) * rr,
        (u[2] * Math.cos(th) + v[2] * Math.sin(th)) * rr,
      ]
    }
    out.set(rotX(p, 0.35), i * 3)
  }
  return out
}

/** 5 · Market line — rising price line with volume bars. */
export function chart(n: number) {
  const out = new Float32Array(n * 3)
  const r = rng(89)
  const steps = 160
  const pts: number[] = []
  let y = -0.9
  const rw = rng(5)
  for (let i = 0; i < steps; i++) {
    y += (rw() - 0.44) * 0.11 + Math.sin(i * 0.09) * 0.012
    pts.push(y)
  }
  const min = Math.min(...pts), max = Math.max(...pts)
  const norm = (v: number) => ((v - min) / (max - min)) * 2.6 - 1.0
  for (let i = 0; i < n; i++) {
    const k = r()
    let p: V3
    const s = r() * (steps - 1)
    const i0 = Math.floor(s), f = s - i0
    const x = (s / (steps - 1)) * 6.6 - 3.3
    const yy = norm(pts[i0] * (1 - f) + pts[Math.min(i0 + 1, steps - 1)] * f)
    if (k < 0.55) {
      p = [x, yy + gauss(r) * 0.018, gauss(r) * 0.05]
    } else if (k < 0.75) {
      // soft area fill under the line
      p = [x, yy - r() * r() * 1.6, gauss(r) * 0.08]
    } else {
      const bar = Math.floor(r() * 54)
      const bx = (bar / 53) * 6.6 - 3.3
      const h = 0.15 + rng(bar + 3)() * 0.55
      p = [bx + gauss(r) * 0.012, -2.0 + r() * h, 0]
    }
    out.set(p, i * 3)
  }
  return out
}

/** 6 · Field — calm, wide constellation for reading sections. */
export function field(n: number) {
  const out = new Float32Array(n * 3)
  const r = rng(97)
  for (let i = 0; i < n; i++) {
    out.set([(r() * 2 - 1) * 8.5, (r() * 2 - 1) * 4.8, -1 - r() * 7], i * 3)
  }
  return out
}

export const SHAPES = [core, network, cube, terrain, globe, chart, field]
