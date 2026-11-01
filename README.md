# upeshchowdary.dev

Personal portfolio of **Kasaraneni Upesh Chowdary** — I build AI agents that decide, and show their work.
Multi-agent systems · agentic automation · vision AI.

## Concept — "Show your work"

The site is told like an evidence trail: every chapter is a numbered record (`REC-00 … REC-08`).
A single WebGL particle field lives behind the page and morphs per chapter as you scroll —
agent core → agent network → CUBE → data terrain → globe → market line.

## Stack

- **Vite + React 19 + TypeScript**, **Tailwind CSS v4**
- **GSAP** (ScrollTrigger, SplitText, ScrambleText) + **Lenis** smooth scroll
- **three.js** (lean, no React renderer) with custom GLSL — simplex-noise morphing, depth glow, signal packets, mouse repulsion
- Animated **system maps** (SVG + GSAP DrawSVG) and live charts — every case study shows its architecture
- Type: Cabinet Grotesk (Fontshare), Instrument Serif, JetBrains Mono

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview
```

All copy, links and metrics live in [`src/content/data.ts`](src/content/data.ts).

## Structure

```
src/
  content/data.ts      single source of truth for all content
  gl/                  particle field: shapes, shaders, scroll-driven state
  components/          cursor, magnetic buttons, reveals, preloader, nav…
  sections/            Hero, Manifesto, About, Principles, Work, CaseStudy,
                       Recognition, Toolkit, Journey, Contact
  lib/                 GSAP + Lenis setup, section→field hook
```

## Deploy

Configured for **Vercel** (`vercel.json`): framework Vite, build `npm run build`, output `dist`.
Respects `prefers-reduced-motion` (no WebGL, no smooth scroll). Sections mount progressively in idle time;
Lighthouse (local): desktop 93 / mobile ~76 performance, 96 accessibility, 100 best practices, 100 SEO.
