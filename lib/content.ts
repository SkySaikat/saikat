// Single source of truth for every word and asset on the site.
// To add a project, screenshot, service or FAQ, edit this file only.
// House rule: no em dashes anywhere in copy.

export const SITE = {
  url: "https://saikatchowdhury.com",
  name: "Saikat Chowdhury",
  firstName: "Saikat",
  lastName: "Chowdhury",
  role: "Full-Stack Web Developer & AI Solutions Architect",
  roleLong: "Full-Stack Web Developer, Web Team Lead & AI Solutions Architect",
  // Used for <title>, meta description and social cards.
  seoTitle: "Saikat Chowdhury | Full-Stack Web Developer in Chattogram, Bangladesh",
  seoDescription:
    "Full-stack web developer and AI solutions architect in Chattogram (Chittagong), Bangladesh. Next.js development, custom WordPress plugins, AI automation, MCP servers and technical SEO for clients worldwide.",
  keywords: [
    "full stack web developer",
    "web developer Bangladesh",
    "web developer Chattogram",
    "web developer Chittagong",
    "Next.js developer",
    "React developer",
    "WordPress plugin developer",
    "custom WordPress plugin development",
    "WooCommerce developer",
    "AI automation developer",
    "MCP server developer",
    "technical SEO",
    "Laravel developer",
    "hire web developer",
  ],
  status: "Available for new projects",
  intro:
    "I'm Saikat, a full-stack web developer, web team lead and AI solutions architect based in Chattogram (Chittagong), Bangladesh. For six years I have built Next.js platforms, custom WordPress plugins, MCP servers and automation for clients across Europe, North America and Asia.",
  bio: "With over six years of experience building high-performance web applications and intelligent automation systems, I bridge the gap between scalable full-stack engineering and practical AI architecture. From custom Next.js platforms and WordPress plugin ecosystems to custom MCP servers and RAG pipelines on Google Cloud, I engineer fast, cost-optimized digital products that drive measurable business growth.",
  email: "hi@saikatchowdhury.com",
  city: "Chattogram",
  region: "Chattogram Division",
  country: "Bangladesh",
  countryCode: "BD",
  location: "Chattogram, Bangladesh",
  timezone: "Asia/Dhaka",
  // Working day in Chattogram local time (24h). Drives the local time status.
  workHours: [10, 22] as [number, number],
  portrait: "/img/saikat.png",
  cv: "/saikat-chowdhury-cv.pdf",
  studio: { name: "Wonder Web Studio", url: "" }, // TODO: add the Wonder Web Studio URL
  university: "Premier University, Chattogram",
  degree: "B.Sc. in Computer Science & Engineering",
  socials: {
    linkedin: "https://www.linkedin.com/in/saikat-chowdhury-2a38201b6/",
    github: "https://github.com/SkySaikat",
    facebook: "https://www.facebook.com/saikatsky/",
    instagram: "https://www.instagram.com/exhaustedskt/",
  },
};

export const STATS = [
  { value: "6+", label: "Years building for the web" },
  { value: "9", label: "Case studies on this site" },
  { value: "646", label: "Static routes in one Next.js migration" },
  { value: "3", label: "Continents of clients" },
];

export const MARQUEE = [
  "Next.js Development",
  "Custom WordPress Plugins",
  "AI Automation",
  "MCP Servers",
  "Technical SEO",
  "WooCommerce",
  "Laravel",
  "React",
  "Programmatic SEO",
  "Google Cloud",
];

export const SERVICES = [
  {
    id: "full-stack",
    title: "Full-Stack Web Development",
    body: "Fast, static-first websites and web applications in Next.js, React, Node.js and Laravel. Clean architecture from the database schema to deployment on Vercel, Netlify or your own servers.",
    tags: ["Next.js", "React", "TypeScript", "Node.js", "Laravel", "PostgreSQL"],
  },
  {
    id: "wordpress",
    title: "Custom WordPress Plugin Development",
    body: "Bespoke WordPress plugins, WooCommerce extensions and Elementor builds: custom post types, review workflows, REST APIs and admin tools your team will actually enjoy using.",
    tags: ["WordPress", "PHP", "WooCommerce", "Elementor Pro", "Gutenberg"],
  },
  {
    id: "ai",
    title: "AI Automation & MCP Servers",
    body: "Custom Model Context Protocol servers that connect Claude, ChatGPT and Gemini to Google Ads, GA4, CallRail and your CRM. Plus n8n and Zapier workflows, RAG pipelines and LLM cost controls on Google Cloud.",
    tags: ["MCP", "Gemini API", "RAG", "n8n", "Zapier", "GCP"],
  },
  {
    id: "seo",
    title: "Technical SEO & Performance",
    body: "Core Web Vitals, structured data, programmatic SEO and WordPress to Next.js migrations that keep every ranking URL intact, so a faster site does not cost you traffic.",
    tags: ["Core Web Vitals", "Schema.org", "Programmatic SEO", "Caching"],
  },
  {
    id: "ecommerce",
    title: "E-Commerce Development",
    body: "WooCommerce and Shopify stores and marketplaces with custom payment, courier and inventory integrations, built to convert visitors into repeat customers.",
    tags: ["WooCommerce", "Shopify", "Payments", "Inventory"],
  },
  {
    id: "lead",
    title: "Technical Leadership",
    body: "Web team lead for agencies and product teams: code review, staging and production server infrastructure, incident remediation and dependable end-to-end delivery.",
    tags: ["Team Lead", "Code Review", "DevOps", "cPanel", "Cloudflare"],
  },
];

export const STACK = [
  {
    label: "AI & Cloud",
    items: ["Google Cloud Platform", "Custom MCP Servers", "RAG Architecture", "Vector Databases", "LLM Routing", "API Cost Management", "Google Gemini API"],
  },
  {
    label: "Frontend, Backend & Mobile",
    items: ["JavaScript", "TypeScript", "PHP", "Next.js", "React", "Node.js", "Laravel", "Python", "Java", "Kotlin (Jetpack Compose)", "Tailwind CSS", "Bootstrap"],
  },
  {
    label: "Databases, Hosting & DevOps",
    items: ["MySQL", "PostgreSQL", "Supabase", "Firebase", "Vercel", "Netlify", "Cloudflare", "cPanel", "SiteGround", "Advanced Caching", "Page Speed Optimization"],
  },
  {
    label: "CMS & E-Commerce",
    items: ["WordPress", "Custom WordPress Plugins", "WooCommerce", "Elementor Pro", "Gutenberg", "Shopify", "Wix", "OpenCart", "Joomla"],
  },
  {
    label: "Automation, CRM & MarTech",
    items: ["Zapier", "Make.com", "n8n", "Zoho CRM", "Zoho Desk", "GoHighLevel", "ServiceTitan", "JobNimbus", "ProLine", "MarketSharp", "CallRail API", "Mailchimp", "Technical & On-Page SEO"],
  },
  {
    label: "UI/UX & Hardware",
    items: ["Figma", "UI/UX Design", "ESP32", "ESP8266 NodeMCU", "Sensors & Relay Automation"],
  },
];

export const ABOUT = [
  {
    title: "Agency & leadership",
    body: "Founder of Wonder Web Studio and a web team lead. I lead development teams, manage staging and production servers, remediate complex server issues and deliver platforms end to end.",
  },
  {
    title: "AI & FinOps",
    body: "Custom AI solutions, MCP server creation, RAG architecture, vector databases, LLM routing and strict API cost management on Google Cloud Platform.",
  },
  {
    title: "Engineering foundation",
    body: "B.Sc. in Computer Science & Engineering from Premier University, Chattogram. Algorithms in C, C++, Java, Kotlin, 8086 Assembly and SQL, applied to modern cloud-native web work.",
  },
  {
    title: "Global, from Chattogram",
    body: "Based in Chattogram (Chittagong), Bangladesh, GMT+6, working with clients and teams across Europe, North America and Asia.",
  },
];

export type Shot = { src: string; alt: string };
export type Link = { label: string; href: string };

export type Project = {
  slug: string;
  index: string;
  title: string;
  category: string;
  // One or two sentences, used on cards and as the meta description.
  summary: string;
  visual: "terminal" | "shots" | "pipeline" | "rubric" | "code" | "device";
  shots: Shot[];
  links: Link[];
  tech: string[];
  architecture: { heading: string; points: string[] }[];
  // True when the case study still needs screenshots or links from Saikat.
  needsAssets?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "marketing-mcp-servers",
    index: "01",
    title: "Marketing Intelligence MCP Servers",
    category: "AI Engineering · Model Context Protocol",
    summary:
      "Custom MCP servers on Vercel that let Claude, ChatGPT, Gemini and Perplexity read and operate a marketing stack in plain English, across Google Ads, GA4, Search Console, Windsor.ai and CallRail.",
    visual: "terminal",
    shots: [],
    links: [],
    tech: ["TypeScript", "Node.js", "MCP SDK", "Next.js", "Express", "Vercel", "Google Ads API", "Google Sheets API", "GA4", "OAuth 2.1", "Zod"],
    architecture: [
      {
        heading: "Google Ads + master worksheet MCP",
        points: [
          "Next.js on Vercel with mcp-handler: 8 read tools and 11 write tools covering budgets, statuses, keywords, bids, negatives, RSA copy and new campaigns.",
          "Every write is two calls. Google validates the operations with validateOnly, the server returns a preview plus a signed confirm token, and the second call applies the plan stored in the token, not in the arguments.",
          "Guardrails that fail closed: separate read and write account allowlists, daily budget caps, maximum percentage change, and new campaigns always created PAUSED.",
          "No database. Users live in an environment variable, the audit trail lives in the master Google Sheet, and confirmations are signed tokens.",
        ],
      },
      {
        heading: "CallRail MCP",
        points: [
          "Express and the MCP SDK in TypeScript, deployed as a stateless SSE endpoint on Vercel.",
          "A standards-compliant OAuth 2.1 authorization server with Dynamic Client Registration (RFC 7591), PKCE S256 and signed JWTs, so ChatGPT connectors, Claude and Perplexity all connect natively.",
          "Windsor.ai-style get_marketing_data: calls and form submissions broken down by source, medium, campaign, UTM, company and date across every client in the account.",
          "Operational tools for the team: read call details, add notes and tags, update lead status and send SMS from a tracking number.",
        ],
      },
    ],
  },
  {
    slug: "programmatic-seo-lead-generation",
    index: "02",
    title: "Programmatic SEO & Lead Generation Platform",
    category: "Next.js · Technical SEO · Home Services",
    summary:
      "Legacy WordPress and Elementor sites migrated to static Next.js on Vercel and Netlify, with programmatic location pages, call tracking and automated Zapier to CRM pipelines.",
    visual: "shots",
    shots: [
      { src: "/img/cases/itz-digital.jpg", alt: "ITZ Digital homepage rebuilt in Next.js" },
      { src: "/img/cases/allsafe-electric.jpg", alt: "Allsafe Electric electrician website homepage" },
      { src: "/img/cases/clear-day-baths.jpg", alt: "Clear Day Baths bathroom remodeling website homepage" },
    ],
    links: [
      { label: "itzdigital.co", href: "https://itzdigital.co" },
      { label: "allsafehomeservice.com", href: "https://allsafehomeservice.com" },
      { label: "cleardaybaths.com", href: "https://cleardaybaths.com" },
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Zapier", "CallRail", "Programmatic SEO"],
    architecture: [
      {
        heading: "ITZ Digital rebuild",
        points: [
          "WordPress and Elementor site rebuilt on the Next.js App Router with TypeScript and Tailwind.",
          "646 routes, fully static except the contact endpoint, with 595 blog posts migrated intact.",
          "Brand palette extracted from the Elementor global kit and mapped to design tokens. Zero npm audit vulnerabilities.",
        ],
      },
      {
        heading: "Home services lead engines",
        points: [
          "Allsafe Electric (Parker, Colorado) and Clear Day Baths (Northern Virginia & Maryland) shipped as static-first Next.js builds.",
          "The legacy URL map treated as a contract so years of rankings carry over on launch day.",
          "Call tracking, quote forms and CRM handoff automated end to end, so every lead lands in the pipeline without manual entry.",
        ],
      },
    ],
  },
  {
    slug: "wordpress-abstract-review-plugin",
    index: "03",
    title: "Abstract Submission & Weighted Review Plugin",
    category: "Custom WordPress Plugin · PHP",
    summary:
      "A bespoke WordPress plugin for the 3rd Cyprus Speech Therapy Conference: abstract submission, multi-stage reviewer workflows and weighted scoring rubrics for an international committee.",
    visual: "rubric",
    shots: [],
    links: [],
    tech: ["PHP", "WordPress Plugin API", "MySQL", "JavaScript", "Custom Post Types"],
    architecture: [
      {
        heading: "Workflow",
        points: [
          "Custom post types model submissions and reviews inside WordPress, with no third-party form plugin.",
          "Multi-stage reviewer workflow that moves each abstract through its review rounds.",
          "Weighted scoring rubrics turn every reviewer's marks into one comparable score for the committee.",
        ],
      },
    ],
    needsAssets: true,
  },
  {
    slug: "ai-blog-content-engine",
    index: "04",
    title: "Automated Multi-Site AI Blog & Content Engine",
    category: "Workflow Automation · AI · WordPress",
    summary:
      "An end-to-end publishing pipeline connecting n8n, Google AI Studio (Gemini) and a custom WordPress plugin to generate and schedule content across multiple sites.",
    visual: "pipeline",
    shots: [],
    links: [{ label: "GitHub: wonder-blog", href: "https://github.com/SkySaikat/wonder-blog" }],
    tech: ["n8n", "Google Gemini API", "PHP", "WordPress REST API"],
    architecture: [
      {
        heading: "Pipeline",
        points: [
          "n8n orchestrates the run and calls Google AI Studio (Gemini) to generate the content.",
          "A custom WordPress plugin receives posts over the REST API and handles publishing and scheduling.",
          "One pipeline feeds multiple sites.",
        ],
      },
    ],
    needsAssets: true,
  },
  {
    slug: "seo-duplicate-fixer-plugin",
    index: "05",
    title: "SEO Duplicate Fixer for WordPress",
    category: "Custom WordPress Plugin · Technical SEO",
    summary:
      "A surgical WordPress plugin that removes duplicate meta descriptions left by retired page builder plugins and strips doubled brand names from Yoast SEO titles, across thousands of URLs.",
    visual: "code",
    shots: [],
    links: [],
    tech: ["PHP 7.2+", "WordPress Plugin API", "Yoast SEO filters", "AJAX batching", "JavaScript"],
    architecture: [
      {
        heading: "How it works",
        points: [
          "Hooks template_redirect at priority 0 and buffers the page so only the first meta description survives.",
          "Detects callbacks registered by the legacy plugins and wraps them, instead of editing their files.",
          "Filters wpseo_title, wpseo_opengraph_title and wpseo_twitter_title to remove a doubled brand name from the right end of the title.",
          "Admin screen with a dry run, then batched AJAX processing in groups of five so large sites never time out.",
        ],
      },
    ],
  },
  {
    slug: "dococlock-healthcare-platform",
    index: "06",
    title: "DocOclock Healthcare Platform",
    category: "Full-Stack SaaS · Healthcare · Android",
    summary:
      "A dual-sided healthcare platform for Bangladesh with live serial queues, a fast digital prescription pad, BMDC doctor verification and patient booking, shipped to web and Android.",
    visual: "shots",
    shots: [
      { src: "/img/cases/dococlock-doctor-dashboard.jpg", alt: "DocOclock doctor dashboard" },
      { src: "/img/cases/dococlock-live-queue.jpg", alt: "DocOclock live serial queue" },
      { src: "/img/cases/dococlock-landing.jpg", alt: "DocOclock landing page" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/SkySaikat/DocOclock-Web" }],
    tech: ["React", "TypeScript", "Vite", "Supabase", "PostgreSQL", "Edge Functions", "Capacitor", "Tailwind CSS"],
    architecture: [
      {
        heading: "Platform",
        points: [
          "Six isolated role experiences: patient, doctor, hospital admin, super admin, branch manager and assistant.",
          "Doctors sign in with their BMDC number. Email OTP runs on a Supabase Edge Function.",
          "Live serial management that enforces single-chamber-per-day limits to keep clinics moving.",
          "One React codebase compiled to Android with Capacitor.",
        ],
      },
    ],
  },
  {
    slug: "ai-campus-navigator",
    index: "07",
    title: "AI Campus Navigator",
    category: "AI · Graph Search · Python",
    summary:
      "A multi-algorithm graph-search chatbot for the CSE department at Premier University. Students ask plain English questions and every answer shows its reasoning trace.",
    visual: "shots",
    shots: [
      { src: "/img/cases/ai-campus-navigator.jpg", alt: "Substitute teacher search using BFS with the reasoning panel" },
      { src: "/img/cases/ai-campus-navigator-astar.jpg", alt: "Meeting finder using A* search" },
    ],
    links: [],
    tech: ["Python 3", "BFS", "DFS", "Greedy Best-First", "A*", "Knowledge Graph"],
    architecture: [
      {
        heading: "Design",
        points: [
          "Keyword rules detect intent with no machine learning model, so behavior stays explainable.",
          "A knowledge graph of courses, teachers, topics and schedules searched with BFS, DFS, Greedy Best-First and A*.",
          "Every answer carries a trace: detected intent, algorithm, expanded nodes and final path.",
          "Pure Python standard library. Nothing to install.",
        ],
      },
    ],
  },
  {
    slug: "local-news-android-iot",
    index: "08",
    title: "Hyperlocal Android App & Smart IoT Monitor",
    category: "Mobile Engineering · IoT",
    summary:
      "Local News Chittagong, a map-driven community alert app in Kotlin and Jetpack Compose, alongside an ESP8266 NodeMCU environmental control prototype with real-time sensor telemetry.",
    visual: "device",
    shots: [],
    links: [{ label: "GitHub: local-news-app", href: "https://github.com/SkySaikat/local-news-app" }],
    tech: ["Kotlin", "Jetpack Compose", "Hilt", "Firebase Auth", "Firestore", "Google Maps SDK", "ESP8266", "C++"],
    architecture: [
      {
        heading: "Local News Chittagong",
        points: [
          "Clean Architecture with MVVM and the repository pattern, StateFlow UI state and Hilt dependency injection.",
          "Type-safe Navigation Compose routes and Material 3 dynamic color in light and dark.",
          "Firebase Auth and Firestore profiles, with geohash proximity queries on the roadmap.",
        ],
      },
      {
        heading: "IoT environmental monitor",
        points: [
          "ESP8266 NodeMCU prototype that reads environmental sensors and switches relays automatically.",
          "Real-time sensor telemetry for remote monitoring.",
        ],
      },
    ],
    needsAssets: true,
  },
  {
    slug: "ecommerce-web-platforms",
    index: "09",
    title: "E-Commerce Stores & Web Platforms",
    category: "E-Commerce · Full-Stack Web",
    summary:
      "Custom storefronts, buyer-centric marketplaces and interactive web apps with payment, courier and inventory integrations, including Pet-cy, Zplaza Marketplace and The Daily Grind.",
    visual: "shots",
    shots: [{ src: "/img/cases/pet-cy.jpg", alt: "Pet-cy online pet store homepage" }],
    links: [{ label: "pet-cy.com", href: "https://pet-cy.com" }],
    tech: ["PHP", "MySQL", "WooCommerce", "Shopify", "JavaScript", "HTML5 Canvas", "Bootstrap"],
    architecture: [
      {
        heading: "Scope",
        points: [
          "Pet-cy: a Cyprus pet supply store with catalog, special offers, gift cards and partnerships.",
          "Zplaza Marketplace: a buyer-centric marketplace.",
          "The Daily Grind and other interactive web applications.",
          "Custom payment, courier and inventory integrations.",
        ],
      },
    ],
    needsAssets: true,
  },
];

// Client websites carried over from the previous saikatchowdhury.com
export const ARCHIVE = [
  { name: "Windsor", type: "Website design", href: "https://www.windsorstore.com/", img: "/img/work/windsor.png" },
  { name: "The Unseen Threads", type: "Blog website", href: "https://theunseenthreads.com/", img: "/img/work/unseen-threads.png" },
  { name: "Read The Anime", type: "Blog website", href: "https://readtheanime.com", img: "/img/work/read-the-anime.png" },
  { name: "Ezeie", type: "UX design / Web app", href: "https://ezeie.com/", img: "/img/work/ezeie.png" },
  { name: "Crafted Look", type: "Blog website", href: "https://craftedlook.com/", img: "/img/work/crafted-look.png" },
  { name: "Workiz", type: "eCommerce development", href: "https://www.workiz.com/", img: "/img/work/workiz.jpg" },
  { name: "J.R. Watkins", type: "Website development", href: "https://jrwatkins.com/", img: "/img/work/jr-watkins.png" },
  { name: "California Olive Ranch", type: "Website development", href: "https://www.californiaoliveranch.com/", img: "/img/work/california-olive-ranch.png" },
];

export const TESTIMONIALS = [
  {
    quote:
      "Our website was outdated and not mobile-friendly. Saikat redesigned it beautifully, ensuring it performs well on all devices. The feedback from our customers has been overwhelmingly positive.",
    name: "Emily Brown",
    title: "Project Manager, Ezeie",
    photo: "/img/people/emily-brown.jpeg",
  },
  {
    quote:
      "Saikat transformed our outdated website into a modern, user-friendly platform. His expertise in SEO has significantly improved our online visibility and was a great plus for us.",
    name: "Amy Tan",
    title: "Project Manager, J.R. Watkins",
    photo: "/img/people/amy-tan.jpeg",
  },
];

export const CLIENT_LOGOS = [
  "/img/clients/client-1.png",
  "/img/clients/client-2.png",
  "/img/clients/client-3.png",
  "/img/clients/client-4.png",
  "/img/clients/client-5.png",
  "/img/clients/client-6-1.png",
];

export const FAQ = [
  {
    q: "What web development services do you offer?",
    a: "Full-stack web development in Next.js, React, Node.js and Laravel, custom WordPress plugin and WooCommerce development, AI automation and MCP servers, technical SEO and performance work, e-commerce builds, and technical leadership for web teams.",
  },
  {
    q: "Do you work with clients outside Bangladesh?",
    a: "Yes. I am based in Chattogram (Chittagong), Bangladesh, on GMT+6, and most of my clients and teams are in Europe, North America and Asia. My working day overlaps with European business hours and with North American mornings.",
  },
  {
    q: "Can you build a custom WordPress plugin for my business?",
    a: "Yes. I build bespoke WordPress plugins from scratch, from abstract submission and weighted review systems for academic conferences to SEO clean-up tools and AI publishing pipelines that use the WordPress REST API.",
  },
  {
    q: "What is an MCP server, and does my business need one?",
    a: "A Model Context Protocol (MCP) server lets AI assistants like Claude, ChatGPT and Gemini use your tools and data safely. I have built MCP servers for Google Ads and CallRail so a team can ask questions about campaigns and calls in plain English, with guardrails such as previews, signed confirmations and budget caps.",
  },
  {
    q: "Can you move my WordPress site to Next.js without losing SEO rankings?",
    a: "Yes. I treat the existing URL map as a contract, carry over metadata and content, and ship static pages that load faster. One migration I led produced 646 static routes with 595 blog posts carried over intact.",
  },
  {
    q: "How do we start a project?",
    a: "Send a short brief through the contact form or email hi@saikatchowdhury.com. Tell me what you are building and what success looks like, and we will set up a call to scope it.",
  },
];

// Options in the contact form; the API only accepts these.
export const CONTACT_TOPICS = ["Website / web app", "WordPress plugin", "AI / MCP build", "Technical SEO", "Team lead", "Other"];

export const NAV = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];
