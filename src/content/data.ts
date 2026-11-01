// Single source of truth for all site content.
// Every fact here comes from the résumé (v12) or the verified live links / repositories.

export const person = {
  fullName: 'Kasaraneni Upesh Chowdary',
  name: 'Upesh Chowdary',
  first: 'Upesh',
  last: 'Chowdary',
  email: 'upeshchowdary.k@gmail.com',
  phone: '+91 78935 82840',
  phoneHref: 'tel:+917893582840',
  location: 'Vijayawada, Andhra Pradesh',
  timezone: 'Asia/Kolkata',
  openTo: 'Hyderabad · On-site / Hybrid / Remote',
  resume: '/Upesh_Chowdary_Resume.pdf',
  links: {
    linkedin: 'https://www.linkedin.com/in/upeshchowdary/',
    github: 'https://github.com/upeshchowdary',
    leetcode: 'https://leetcode.com/u/upeshchowdary_k/',
  },
}

export const roles = ['Multi-agent systems', 'Agentic automation', 'Vision AI', 'Grounded LLM products']

export const bio = [
  'Computer Science Engineering student at KL University, focused on generative AI, agentic systems and applied machine learning.',
  'I build end-to-end AI products with Python, FastAPI, LLM APIs, multimodal AI and computer vision — multi-agent orchestration, tool calling, grounded generation, evaluation and human-in-the-loop decision support. I like AI systems that turn real-world data into workflows people can actually trust.',
]

export const facts = [
  { k: 'Based', v: 'Vijayawada, Andhra Pradesh' },
  { k: 'Study', v: 'B.Tech CSE · KL University · 2023–27' },
  { k: 'Semester', v: '7th · CGPA 8.56' },
  { k: 'Open to', v: 'Hyderabad · On-site / Hybrid / Remote' },
]

export const stats = [
  { value: 8.56, decimals: 2, suffix: '', label: 'CGPA at KL University' },
  { value: 558, decimals: 0, suffix: '', label: 'passing tests on CUBE-0045' },
  { value: 161, decimals: 0, suffix: '', label: 'LeetCode problems solved' },
  { value: 5, decimals: 0, suffix: '', label: 'systems shipped & live' },
]

export const principles = [
  {
    n: '01',
    title: 'Keep decisions out of the LLM.',
    body: 'The model judges; a deterministic engine decides. Gemini returns one batched, Pydantic-validated judgment per return — and a 24-rule disposition engine makes the call.',
    proof: 'CUBE-0045 · ≤2 LLM round trips per return',
  },
  {
    n: '02',
    title: 'UNCERTAIN is a verdict.',
    body: 'Identity is confirmed only by matched product features or a barcode read. When the evidence isn’t there, the system says so instead of guessing — with an 85% confidence gate for auto-approval.',
    proof: 'CUBE-0045 · ZXing + OpenCV · perceptual hashing',
  },
  {
    n: '03',
    title: 'Evidence, or it didn’t happen.',
    body: 'Every decision leaves a trail: SHA-256 hash-chained evidence records, decision logs and audit trails you can walk back to the exact input an agent examined.',
    proof: 'CUBE-0045 · CUBE Pod 05 · CommerceSense AI',
  },
  {
    n: '04',
    title: 'Fail open — to humans.',
    body: 'When a model or a quota fails, work routes to human review — never to a guessed answer. Sign-off gates guard dispose, high-value and escalated cases.',
    proof: 'Human-in-the-loop by design',
  },
]

export type Project = {
  id: string
  index: string
  name: string
  kicker: string
  period: string
  tagline: string
  summary: string
  points: string[]
  metrics: { value: string; label: string }[]
  stack: string[]
  live: string
  code: string
  shots: { src: string; alt: string }[]
  shape: number
  note?: string
}

export const projects: Project[] = [
  {
    id: 'cube-0045',
    index: '01',
    name: 'CUBE-0045',
    kicker: 'Returns Manager agent · CUBE Buildathon 2026',
    period: 'Sep — Oct 2026',
    tagline: 'Turns every returned parcel into an evidence-backed decision.',
    summary:
      'A vision-LLM agent that inspects returned-parcel photos against the seller’s catalogue, order record and parts list — deciding identity, completeness, Amazon condition grade and disposition (restock, refurbish, liquidate or dispose) to recover margin lost when resellable returns get liquidated.',
    points: [
      'Gemini returns one batched, Pydantic-validated judgment per return; a deterministic 24-rule engine with human sign-off gates decides the outcome.',
      'UNCERTAIN is first-class: identity is confirmed only by matched features or a barcode read (ZXing + OpenCV); images are perceptual-hashed; failures fail open to human review.',
      'Postgres row-level-security multi-tenancy, JWT / API-key auth, a job queue with circuit breaker and quota guard, SHA-256 hash-chained evidence records and an MCP server.',
    ],
    metrics: [
      { value: '558', label: 'passing pytest tests' },
      { value: '24', label: 'deterministic disposition rules' },
      { value: '85%', label: 'confidence gate for auto-approval' },
      { value: '≤2', label: 'LLM round trips per return' },
    ],
    stack: ['Python', 'Gemini Vision', 'FastAPI', 'Pydantic', 'PostgreSQL · RLS', 'Supabase', 'OpenCV', 'ZXing', 'scikit-learn', 'MCP', 'React', 'TypeScript', 'Three.js', 'Docker', 'pytest'],
    live: 'https://cube26-rtn-0045-upeshchowdary-1.onrender.com/',
    code: 'https://github.com/upeshchowdary/cube26-rtn-0045-upeshchowdary/tree/upeshchowdary',
    shots: [
      { src: '/images/work/cube-0045__live_01_hero.webp', alt: 'CUBE-0045 landing — turn every return into a clear decision' },
      { src: '/images/work/cube-0045__live_02_sample_decision.webp', alt: 'CUBE-0045 inspection card with identity, parts, condition and recommended disposition' },
      { src: '/images/work/cube-0045__live_03_problem.webp', alt: 'CUBE-0045 — returns are decisions, not just refunds' },
    ],
    shape: 2,
  },
  {
    id: 'pod-05',
    index: '02',
    name: 'CUBE Pod 05',
    kicker: 'Five-agent commerce system · Team lead · Round 3',
    period: 'Oct 2026',
    tagline: 'Five agents. One unit. One traceable outcome.',
    summary:
      'Receiving, Prep, Pack, Returns and Recovery agents connected into one commerce system. A unit goes in at supplier delivery; a final outcome comes out that you can walk back to the exact bytes each agent examined.',
    points: [
      'Led the pod and built most of it: the complete UI design, the agent integrations, the backend logic and the testing.',
      'One contract: every agent takes an Agent Input and returns an Agent Output with an Evidence Record — PASS, FAIL or UNCERTAIN per check.',
      'One owner of state: the orchestrator owns routing, retries, overrides and the final outcome. Agents only judge.',
      'One evidence trail: outcome → contributing records → checks → evidence refs → the SHA-256 of the exact input.',
    ],
    metrics: [
      { value: '5', label: 'agents in one workflow' },
      { value: '1', label: 'orchestrator owning state' },
      { value: '3', label: 'verdicts: PASS · FAIL · UNCERTAIN' },
      { value: '119', label: 'of 147 commits authored by me' },
    ],
    stack: ['Python', 'Multi-agent orchestration', 'FastAPI', 'Evidence records', 'TypeScript', 'React', 'Docker', 'Render'],
    live: 'https://cube26-upeshchowdary-pod-5.onrender.com/',
    code: 'https://github.com/upeshchowdary/cube-round3-pod',
    shots: [
      { src: '/images/work/pod05__01_hero.webp', alt: 'CUBE Pod 05 — five agents, one unit, one traceable outcome' },
      { src: '/images/work/pod05__02_control_center.webp', alt: 'CUBE Pod 05 commerce control center' },
    ],
    shape: 2,
    note: 'Team build — I led the pod: complete UI design, agent integrations, backend logic and testing.',
  },
  {
    id: 'commercesense',
    index: '03',
    name: 'CommerceSense AI',
    kicker: 'AI-powered Amazon seller copilot',
    period: 'Sep 2026',
    tagline: 'Flags what needs attention this week — and tells you why.',
    summary:
      'A multi-agent commerce pipeline where an Orchestrator coordinates Research and Insight agents across Listing, Pricing, Review and Inventory Intelligence — deterministic-first, with every business number computed outside the LLM.',
    points: [
      'Deterministic analytics for inventory risk, PPC waste, rank / Buy Box signals, listing health, pricing, review themes and demand forecasting.',
      'RAG with LangChain over Sentence-Transformers embeddings of reviews and listings in FAISS / ChromaDB, grounding every insight in retrieved evidence.',
      'Pluggable Gemini / Ollama and Tavily / SearXNG providers, semantic review clustering, and deterministic fallback when optional LLM services are unavailable.',
    ],
    metrics: [
      { value: '9/9', label: 'planted signals detected' },
      { value: '0', label: 'false alarms in audit' },
      { value: '107', label: 'passing pytest tests' },
      { value: '14', label: 'products in the evaluation audit' },
    ],
    stack: ['Python', 'Gemini', 'Ollama', 'LangChain', 'FAISS', 'ChromaDB', 'Tavily', 'SearXNG', 'FastAPI', 'React', 'TypeScript', 'SQLite', 'Sentence-Transformers', 'Docker'],
    live: 'https://commercesense-frontend.vercel.app/',
    code: 'https://github.com/upeshchowdary/commercesense-ai',
    shots: [
      { src: '/images/work/commercesense__01_hero.webp', alt: 'CommerceSense AI seller copilot landing' },
      { src: '/images/work/commercesense__03_control_room.webp', alt: 'CommerceSense AI seller control room dashboard' },
      { src: '/images/work/commercesense__02_research_agent.webp', alt: 'CommerceSense AI product research agent' },
    ],
    shape: 3,
  },
  {
    id: 'roadwatch',
    index: '04',
    name: 'RoadWatch AP',
    kicker: 'Satellite new-road detection · KL capstone · SIH1564',
    period: '2026',
    tagline: 'Every new road. Seen first — with the proof.',
    summary:
      'Automatic road extraction and new-road change alerting from multi-date satellite imagery, built for Andhra Pradesh and designed to scale to India.',
    points: [
      'Tier 1: Sentinel-2 (10 m optical) and Sentinel-1 (radar) statewide screening, streamed tile by tile.',
      'Tier 2: high-resolution verification in three 20 × 20 km pilot zones across NTR and Krishna districts.',
      'Compares road graphs across dates with a persistence rule and an abstain mode to keep false alerts low — every alert ships with before / after evidence.',
    ],
    metrics: [
      { value: '2', label: 'satellite sensors fused · optical + radar' },
      { value: '10 m', label: 'statewide screening resolution' },
      { value: '3', label: 'high-res pilot zones · 20 × 20 km' },
      { value: 'Abstain', label: 'mode for cloudy, unreliable tiles' },
    ],
    stack: ['Python', 'Sentinel-2 / Sentinel-1', 'Rasterio', 'GeoPandas', 'NetworkX', 'scikit-image', 'ONNX Runtime', 'FastAPI', 'TypeScript', 'Docker'],
    live: 'https://roadwatch-ap.onrender.com',
    code: 'https://github.com/upeshchowdary/AI-Based-Road-Extraction-and-New-Road-Alert-System-using-Multi-Temporal-Satellite-Images',
    shots: [
      { src: '/images/work/roadwatch__01_hero.webp', alt: 'RoadWatch landing with a 3D globe' },
      { src: '/images/work/roadwatch__02_map.webp', alt: 'RoadWatch live satellite map of Vijayawada with new-road alerts' },
    ],
    shape: 4,
  },
  {
    id: 'stockwise',
    index: '05',
    name: 'StockWise AI',
    kicker: 'AI-powered stock prediction platform',
    period: 'Mar 2026 — Present',
    tagline: 'Market data in. Forecasts and signals out.',
    summary:
      'An end-to-end market analytics platform applying predictive machine-learning models to Yahoo Finance data for stock trend forecasting and regression-oriented analysis.',
    points: [
      'Data-processing workflows feeding predictive ML models for trend forecasting.',
      'Spring Boot REST APIs with JWT authentication, React dashboards and MySQL storage for portfolio and prediction insights.',
      'APIs validated with Postman; deployed on Render and Vercel.',
    ],
    metrics: [
      { value: 'ML', label: 'trend forecasting & regression' },
      { value: 'JWT', label: 'secured Spring Boot REST APIs' },
      { value: 'Live', label: 'Yahoo Finance market data' },
      { value: '3', label: 'tiers · React · Spring Boot · MySQL' },
    ],
    stack: ['Python', 'NumPy', 'Machine Learning', 'Spring Boot', 'React', 'MySQL', 'Yahoo Finance API', 'JWT'],
    live: 'https://upeshchowdary.github.io/stockwise-ai/',
    code: 'https://github.com/upeshchowdary/stockwise-ai',
    shots: [{ src: '/images/work/stockwise__01_hero.webp', alt: 'StockWise AI — real-time stock market intelligence' }],
    shape: 5,
  },
]

export const finalist = {
  title: 'CUBE Buildathon 2026',
  award: 'Finalist',
  line: 'Recognised among the top finalists nationwide.',
  detail: 'Final Round · Hyderabad · 10 Oct 2026 · organised by Sydon.ai × CodeQuesters',
  image: '/images/certs/cube-finalist.webp',
}

export const credentials = [
  {
    org: 'Microsoft',
    title: 'Azure Fundamentals (AZ-900)',
    meta: 'Earned 24 Aug 2026 · Credential DBED50FBBF987340',
    href: 'https://learn.microsoft.com/en-gb/users/upeshchowdary-3076/credentials/certification/azure-fundamentals',
    cta: 'Verify',
  },
  {
    org: 'Oracle',
    title: 'Redwood Application 2025 Certified Developer Associate',
    meta: 'Oracle certification',
  },
  {
    org: 'Cambridge English',
    title: 'Linguaskill General · B2',
    meta: 'Average 166 · Reading C1 or above',
    href: '/docs/linguaskill-report.pdf',
    cta: 'Report',
  },
  {
    org: 'LeetCode',
    title: '161 problems solved',
    meta: 'Contest rating 1,457 · 50 Days Badge 2026',
    href: 'https://leetcode.com/u/upeshchowdary_k/',
    cta: 'Profile',
  },
]

export const toolkit = [
  { group: 'Agents & GenAI', items: ['LLMs', 'AI agents', 'Multi-agent systems', 'Agentic workflows', 'RAG', 'LangChain', 'Tool calling', 'Structured outputs', 'Agent memory', 'MCP', 'Multimodal AI', 'Vision-language models', 'NLP'] },
  { group: 'Reliability & Eval', items: ['Grounding', 'Hallucination mitigation', 'LLM evaluation', 'Precision · Recall · F1', 'Cohen’s Kappa', 'Uncertainty handling', 'Deterministic rules engines', 'Guardrails', 'Fail-open design', 'Human-in-the-loop', 'Audit trails', 'Observability'] },
  { group: 'ML & Vision', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'Transformers', 'Embeddings', 'FAISS', 'ChromaDB', 'Sentence-Transformers', 'YOLOv8', 'OpenCV', 'OCR', 'Barcode recognition', 'Perceptual hashing'] },
  { group: 'LLM APIs & Data', items: ['Gemini', 'Claude', 'OpenAI', 'Groq', 'Ollama', 'Whisper', 'Tavily', 'SearXNG', 'FastAPI', 'Pydantic', 'PostgreSQL · RLS', 'Supabase', 'MySQL', 'MongoDB', 'SQLite'] },
  { group: 'Frontend & DevOps', items: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'Recharts', 'Radix UI', 'Docker', 'pytest', 'Git', 'Render', 'Vercel'] },
  { group: 'Languages & Automation', items: ['Python', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'n8n', 'Claude Code', 'Cursor', 'Antigravity', 'E-commerce workflows', 'Reverse logistics'] },
]

export const marqueeA = ['Multi-agent systems', 'Agentic workflows', 'RAG', 'MCP', 'Tool calling', 'Vision AI', 'Evaluation', 'Human-in-the-loop']
export const marqueeB = ['Python', 'FastAPI', 'Gemini', 'Claude', 'LangChain', 'PyTorch', 'OpenCV', 'YOLOv8', 'FAISS', 'PostgreSQL', 'React', 'Three.js']

export const journey = [
  { when: '2020 — 21', title: 'Nalanda High School', where: 'Edupugallu, Andhra Pradesh', detail: '10th Grade · CGPA 7.52' },
  { when: '2021 — 23', title: 'Srichaithanya Jr College', where: 'Vijayawada, Andhra Pradesh', detail: 'Intermediate (MPC) · CGPA 7.50' },
  { when: '2023 — 27', title: 'KL University (KLEF)', where: 'Vijayawada, Andhra Pradesh', detail: 'B.Tech, Computer Science & Engineering · CGPA 8.56 · 7th semester' },
  { when: 'May 2024', title: 'Cambridge Linguaskill', where: 'KLEF, Vaddeswaram', detail: 'B2 overall · Reading C1 or above' },
  { when: 'Aug 2026', title: 'Microsoft Certified', where: 'Azure Fundamentals', detail: 'AZ-900' },
  { when: 'Sep — Oct 2026', title: 'CUBE Buildathon 2026', where: 'Sydon.ai × CodeQuesters', detail: 'Round 2: CUBE-0045 → Round 3: led Pod 05 → Finalist, Hyderabad' },
]

export const chapters = [
  { id: 'top', code: 'REC-00', label: 'Index' },
  { id: 'manifesto', code: 'REC-01', label: 'Belief' },
  { id: 'about', code: 'REC-02', label: 'Builder' },
  { id: 'principles', code: 'REC-03', label: 'Rules' },
  { id: 'work', code: 'REC-04', label: 'Work' },
  { id: 'recognition', code: 'REC-05', label: 'Proof' },
  { id: 'toolkit', code: 'REC-06', label: 'Toolkit' },
  { id: 'journey', code: 'REC-07', label: 'Journey' },
  { id: 'contact', code: 'REC-08', label: 'Contact' },
]
