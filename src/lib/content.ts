// All the words on the site live here. Edit freely.

export const site = {
  nick: "Sid",
  fullName: "Siddhant Bhasin",
  nickNote: "(Siddhant, but nobody has time for that)",
  role: "Software Engineer · AI/ML · LLM systems",
  tagline: "Came for the Master's. Stayed for the Spoons.",
  email: "siddhantbhasin7482@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://linkedin.com/in/sb7482" },
    { label: "GitHub", href: "https://github.com/siddhant7482" },
    { label: "Email", href: "mailto:siddhantbhasin7482@gmail.com" },
  ],
  sticker: { top: "MSc ACS · Distinction", bottom: "Newcastle University" },
  ladder: [
    { k: "Started as", v: "Web Developer" },
    { k: "Then", v: "Full-stack Developer" },
    { k: "Now", v: "Software Engineer, AI/ML" },
  ],
};

// Line shown in the top bar while each section is on screen.
export const ticker: Record<string, string> = {
  home: "Built this myself. The bugs are also mine.",
  origin: "Yes, C++ at 16. No, I don't want to talk about pointers.",
  journey: "Delhi to Newcastle: about 6,800 km. Still shorter than my backlog.",
  arrival: "Ask me for a Spoons recommendation. I have several.",
  work: "Please keep your hands inside the projects at all times.",
  depot: "Tear off a tab. Everyone else did.",
  contact: "Last stop. All change.",
};

export const nav = [
  { id: "home", label: "Home" },
  { id: "origin", label: "Origin" },
  { id: "journey", label: "Journey" },
  { id: "arrival", label: "Newcastle" },
  { id: "work", label: "Best Work" },
  { id: "depot", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const origin = {
  notes: [
    "I was 16. School computer lab. C++.",
    "First time something did exactly what I told it to.",
    "For the first time, it was my world, and I was in control.",
  ],
  code: `// age 16. school computer lab.
#include <iostream>

int main() {
    std::cout << "my world.";
    std::cout << "my control.";
    return 0; // spoiler: never logged off
}`,
  stamp: "Still haven't logged off",
  output: "my world.my control.",
  outputNote: "forgot the endl. some things never change.",
  sticky: "Turbo C++. Blue screen. Peak.",
  floppy: "SID'S STUFF|DO NOT DELETE",
  rules: ["No games.", "No food.", "Don't unplug anything.", "Seriously. No games."],
  // Easter egg: press PC-07's power button.
  power: [
    { note: "Who switched off PC-07?", boot: ["Starting MS-DOS...", "Please don't tell Sir."] },
    { note: "Again?! 8 lines of genius, unsaved. Gone.", boot: ["Starting MS-DOS...", "CHKDSK: found 1 file of regret."] },
    { note: "Right. Name in the register. Detention.", boot: [] },
  ],
  confiscated: ["PC-07 has been confiscated.", "Press power to apologise."],
  forgiven: "Apology accepted. Don't do it again.",
};

export type Line = "delhi" | "flight" | "metro";
export type Station = {
  place: string;
  when: string;
  title: string;
  role?: string;
  body: string;
  line: Line;
  highlight?: boolean;
};

export const journey: Station[] = [
  { place: "School lab", when: "Age 16", title: "Hello, world", line: "delhi", body: "First C++ program. Fell for it immediately." },
  { place: "Pune", when: "2020 to 2023", title: "Symbiosis International University", role: "Bachelor of Computer Applications", line: "delhi", body: "MERN, Next.js, IoT, ML. Google Developers Club. Showed an IoT agri-tech project at an IEEE exhibition." },
  { place: "Remote", when: "Jan to Jun 2023", title: "KMF Infotech", role: "Python Developer (Intern)", line: "delhi", body: "Python scraping pipelines across 5 platforms. 10,000+ profiles collected and queried." },
  { place: "Noida", when: "Sep 2023 to Mar 2024", title: "Smartways", role: "Web Developer", line: "delhi", body: "15+ e-commerce sites on WordPress & Shopify. Kept 20+ live sites alive." },
  { place: "Delhi", when: "Apr 2024 to Jan 2025", title: "Cybernexus", role: "Software Developer", line: "delhi", body: "12+ full-stack apps for 8+ clients. Multi-vendor stores with 5,000+ listings. ERPs that cut data entry 60%." },
  { place: "DEL → NCL", when: "2025", title: "One-way ticket", line: "flight", body: "" },
  { place: "Gateshead", when: "2025", title: "Appsatile", role: "Startup in The Elastic Group", line: "metro", body: "Started 5 or 6 months before my Master's even began. Hit the ground running." },
  { place: "Haymarket", when: "2025 to 2026", title: "Newcastle University", role: "MSc Advanced Computer Science, Distinction", line: "metro", highlight: true, body: "Did it while working. Deep Learning, ML, Secure Software. Accenture hackathon: commended for architecture." },
  { place: "Gateshead", when: "Since Jan 2026", title: "The Elastic Group", role: "Software Engineer", line: "metro", body: "LLMs, RAG, MCP servers, Kubernetes, 55 VMs and the on-call rotation." },
];

export const boardingPass = {
  from: "DEL",
  fromCity: "Delhi",
  to: "NCL",
  toCity: "Newcastle",
  seat: "Window, obviously",
  baggage: "2 suitcases, 1 laptop, 0 winter clothes that actually work",
};

export const arrival = {
  intro: "Dropped my bags at student accommodation and walked into the first place I saw.",
  receipt: {
    venue: "FIVE SWANS",
    city: "Newcastle upon Tyne",
    lines: ["1x Chicken wings", "1x Bowl of cheesy chips", "1x Pint of Kopparberg"],
    total: "fell in love",
    footer: ["* didn't know it was a Spoons *", "* it is now my local *"],
  },
  love: ["The people. Kindest anywhere.", "The parties.", "The pubs. Some of the best in the country."],
  miss: ["The food.", "That's it. That's the list."],
  // Polaroids. Add `src: "/photos/your-photo.jpg"` (file in site/public/photos) to swap the drawing for a real photo.
  photos: {
    millennium: { caption: "Millennium Bridge. It tilts. Seriously.", src: "" },
    monument: { caption: "Grey's Monument: 'meet you at the Monument'", src: "" },
    angel: { caption: "Angel of the North, in its natural habitat (drizzle)", src: "" },
  },
  postcard: "Greetings from",
  weather: { title: "Forecast", body: "9°C and drizzle.", punch: "Locals: t-shirts." },
  ticket: { kind: "Single", from: "Haymarket", to: "Gateshead", note: "Valid: one Master's + one job" },
  uni: {
    // Put the official logo file at site/public/newcastle-university-logo.png (or change this path).
    logo: "/newcastle-university-logo.png",
    name: "Newcastle University",
    course: "MSc Advanced Computer Science",
    result: "Distinction",
    years: "2025 to 2026",
  },
};


export type Stop = {
  station: string;
  stats: { value: string; label: string; late?: boolean }[];
  nearby: string;
  joke: string;
  title: string;
  summary: string;
  points: string[];
  tags: string[];
  links?: { label: string; href: string }[];
};

export const bestWork: Stop[] = [
  {
    station: "Haymarket",
    stats: [{ value: "Distinction", label: "MSc dissertation" }],
    nearby: "Newcastle University",
    joke: "Where my MSc lived. Also where most of my sleep went.",
    title: "Edge IDPS: MSc Dissertation",
    summary: "An intrusion detection & prevention system that stops attacks at the edge and thinks about them in the middle.",
    points: [
      "eBPF/XDP agents inspect and block packets right at the network edge",
      "Central LLM reasoning engine (in Go) for root-cause analysis and policy generation",
      "Kafka + Strimzi telemetry, Tailscale mesh, KEDA autoscaling",
      "Tested against flooding, Slowloris, brute-force and protocol anomalies",
    ],
    tags: ["eBPF", "Go", "Kafka", "LLMs", "Kubernetes"],
    links: [{ label: "Code", href: "https://github.com/siddhant7482/comprehensive-smart-idps-system" }],
  },
  {
    station: "Monument",
    stats: [{ value: "~50ms", label: "API response" }, { value: "17", label: "data models" }],
    nearby: "Grey's Monument",
    joke: "Like Earl Grey up there, this one stands on its own. Built solo.",
    title: "LearnixSai",
    summary: "An AI learning platform that curates real videos, docs and Q&A into structured courses instead of making stuff up.",
    points: [
      "Multi-stage pipeline: classify → structure → discover → dedupe → LLM rerank & summarise",
      "API answers in ~50 ms; pg-boss workers do the heavy lifting",
      "Routes across YouTube, Stack Exchange, GitHub, arXiv, Wikipedia + self-hosted SearXNG",
    ],
    tags: ["Next.js", "Prisma", "PostgreSQL", "LLMs", "Docker"],
    links: [
      { label: "Live", href: "https://www.learnixsai.tech/" },
      { label: "Docs", href: "https://leranixops.vercel.app/docs" },
    ],
  },
  {
    station: "Central",
    stats: [{ value: "10,000+", label: "docs my LLMs read so humans didn't" }, { value: "70%", label: "less manual filing" }],
    nearby: "Central Station",
    joke: "Everything passes through Central. So did 10,000 documents.",
    title: "LLM Document System",
    summary: "An on-prem, LLM-powered document system that reads, classifies, summarises and files for 6+ departments.",
    points: [
      "RAG pipelines + custom MCP servers over organisational data",
      "Quality checked with structured test sets and LLM-as-judge",
      "Auto-filing via Google Drive: 70% less manual work, ~8 hours saved a week",
    ],
    tags: ["Python", "RAG", "MCP", "MinIO", "Redis"],
  },
  {
    station: "Gateshead",
    stats: [{ value: "55", label: "VMs kept alive" }, { value: "20%", label: "cheaper API gateway" }, { value: "50%", label: "faster deploys" }],
    nearby: "Tesco Extra",
    joke: "Like Tesco Extra: a bit of everything, open late.",
    title: "The Elastic Group platform",
    summary: "The everything-aisle: infra, gateways, messaging and analytics.",
    points: [
      "Led Traefik → Kong migration with GitOps config, 20% cheaper",
      "Built a WhatsApp → Matrix bridge so everyone talks in one place",
      "Marketing analytics backend (Google, Meta, TikTok), 50% less reporting",
      "Kubernetes, Terraform, 55 VMs across 4 Proxmox hosts, on-call",
    ],
    tags: ["FastAPI", "Kong", "Kubernetes", "Terraform", "Matrix"],
  },
  {
    station: "Gateshead Stadium",
    stats: [{ value: "02:00", label: "usual bedtime", late: true }],
    nearby: "Aldi",
    joke: "Like Aldi: does what the big brands do, for a fraction of the price.",
    title: "CommandHQ: the homelab",
    summary: "A Lenovo ThinkCentre M900 Tiny behind Tailscale, running my own apps. Because paying for cloud is for people who sleep.",
    points: [
      "Warden: a job tracker that reads my inbox and gets crueller until I apply",
      "Nori: reads my bank feed, tells me what I can spend per day until payday",
      "Vault: my own file store, with a map of every byte and what's gone cold",
    ],
    tags: ["Self-hosted", "TypeScript", "Postgres", "Tailscale"],
    links: [
      { label: "Warden", href: "https://github.com/siddhant7482/Warden-doomsday-program-for-jop-applications-" },
      { label: "Nori", href: "https://github.com/siddhant7482/Nori" },
      { label: "Vault", href: "https://github.com/siddhant7482/Vault---File-storage-system-for-server-" },
    ],
  },
];

export const contact = {
  kicker: "Next stop:",
  big: "you.",
  body: "Hiring, building something, or need a Spoons recommendation? My inbox is open, usually after midnight.",
  footer: "Built in Newcastle, mostly after midnight.",
};


export type DepotProject = {
  name: string;
  oneLiner: string;
  detail: string;
  tags: string[];
  links: { label: string; href: string }[];
  serviced?: string; // last push on GitHub
  livery: string; // accent colour
  hook: string; // the flyer headline
  flyer: "learn" | "warning" | "warden" | "nori" | "missing";
  homelab?: boolean;
};

export const depot = {
  sign: "The Noticeboard",
  place: "Students' Union · Newcastle University",
  gate: "Please do not remove flyers (tabs are fine)",
  // Easter egg: try to drag a flyer off the board.
  warnings: [
    { title: "Warning 1 of 3", text: "Oi. It literally says don't remove flyers. Tabs are fine." },
    { title: "Warning 2 of 3", text: "Again? Were you raised by seagulls? That flyer cost me 10p to print." },
    { title: "Final warning", text: "Right, that's it. You're barred from the Union bar. Hire me and we'll call it even." },
  ],
  barred: "Nope. Barred, remember?",
  intro: "Side projects, posted where every good idea at uni ends up: the Union noticeboard. Tear off a tab to see the code.",
  society: { name: "Sid's Society of Side Projects", meets: "Meets nightly, 2am. Snacks not provided.", cta: "Everything else on GitHub" },
  github: "https://github.com/siddhant7482",
  tracks: [
    {
      name: "Main line arches",
      note: "the big ones",
      projects: [
        {
          name: "LearnixSai",
          hook: "LEARN ANYTHING (properly)",
          flyer: "learn",
          oneLiner: "An AI learning platform that turns any topic into a structured course.",
          detail: "Curates real videos, docs and Q&A instead of making lessons up. Multi-stage LLM pipeline with reranking. Built solo.",
          tags: ["Next.js", "Prisma", "PostgreSQL", "LLMs"],
          links: [
            { label: "Live", href: "https://www.learnixsai.tech/" },
            { label: "Docs", href: "https://leranixops.vercel.app/docs" },
          ],
          livery: "#2050d0",
        },
        {
          name: "Smart IDPS",
          hook: "ATTACKERS BEWARE",
          flyer: "warning",
          oneLiner: "Intrusion detection & prevention that blocks at the edge and thinks in the middle.",
          detail: "eBPF/XDP agents on edge devices, a central LLM reasoning engine in Go, Kafka telemetry. My MSc dissertation (Distinction).",
          tags: ["Go", "eBPF", "Kafka", "LLMs"],
          links: [{ label: "Code", href: "https://github.com/siddhant7482/comprehensive-smart-idps-system" }],
          serviced: "Aug 2026",
          livery: "#e5432f",
        },
      ],
    },
    {
      name: "CommandHQ arches",
      note: "running on my homelab",
      projects: [
        {
          name: "Warden",
          hook: "STILL HAVEN'T APPLIED?",
          flyer: "warden",
          homelab: true,
          oneLiner: "A job-application tracker that gets progressively crueller until I apply for something.",
          detail: "Never typed into: it reads my inbox, parses 93% of emails with plain code and hands the weird 7% to an LLM. No nagging, just arithmetic.",
          tags: ["TypeScript", "Gmail API", "LLMs"],
          links: [{ label: "Code", href: "https://github.com/siddhant7482/Warden-doomsday-program-for-jop-applications-" }],
          serviced: "Sep 2026",
          livery: "#141414",
        },
        {
          name: "Nori",
          hook: "SKINT BY THE 20TH?",
          flyer: "nori",
          homelab: true,
          oneLiner: "Turns my bank account into one number: what I can spend each day until payday.",
          detail: "Reads Monzo (read-only, structurally), finds payday on its own, and lets an overspent budget borrow, visibly.",
          tags: ["TypeScript", "Monzo API", "Postgres"],
          links: [{ label: "Code", href: "https://github.com/siddhant7482/Nori" }],
          serviced: "Sep 2026",
          livery: "#1f8a5b",
        },
        {
          name: "Vault",
          hook: "MISSING: ONE FILE",
          flyer: "missing",
          homelab: true,
          oneLiner: "My server's file store, with a map of every byte and what's gone cold.",
          detail: "A treemap where area really is bytes, a COLD mode for dead weight, and an inbox where an LLM suggests filenames (it only ever sees the name).",
          tags: ["TypeScript", "Next.js", "Garage S3", "Postgres"],
          links: [{ label: "Code", href: "https://github.com/siddhant7482/Vault---File-storage-system-for-server-" }],
          serviced: "Sep 2026",
          livery: "#6b7280",
        },
      ],
    },
  ] as { name: string; note: string; projects: DepotProject[] }[],
};
