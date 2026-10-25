export type ProjectLink = { label: string; url: string };

export const PROJECT_CATEGORIES = [
  "Business",
  "Education",
  "Product",
  "Creative",
  "Automation",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export type ProjectStatus = "live" | "private" | "in-progress";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  role: string;
  links?: ProjectLink[];
  repo?: string;
  featured: boolean;
  status: ProjectStatus;
  category: ProjectCategory;
  image?: string;
  outcome?: string;
};

function live(url: string): ProjectLink[] {
  return [{ label: "Live", url }];
}

export const projects: Project[] = [
  {
    slug: "upco-nigeria",
    title: "UPCO Nigeria",
    summary: "EdTech platform offering digital skills training",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    role: "CEO/Co-Founder & Developer",
    status: "live",
    featured: true,
    category: "Education",
    links: live("https://upco.live"),
  },
  {
    slug: "springbase",
    title: "Springbase School Management System",
    summary:
      "Multi-portal school platform: public school website plus separate admin, parent and student portals for academic tracking and management",
    stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    role: "Project Manager & Developer",
    repo: "ObaniwaMichael/springbase",
    status: "live",
    featured: true,
    category: "Education",
    image: "/projects/springbase.jpg",
    links: [
      { label: "School site", url: "https://springbase.com.ng" },
      { label: "Admin portal", url: "https://admin.springbase.com.ng" },
      { label: "Parent portal", url: "https://parents.springbase.com.ng" },
      { label: "Student portal", url: "https://students.springbase.com.ng" },
    ],
  },
  {
    slug: "figora-health",
    title: "Figora Health",
    summary: "Cross-border telehealth platform",
    stack: [],
    role: "Developer via King of CMS Consulting",
    status: "live",
    featured: true,
    category: "Product",
    links: [{ label: "Live", url: "https://www.figorahealth.com/" }],
  },
  {
    slug: "afretrade",
    title: "Afretrade",
    summary: "Learning and hiring platform",
    stack: ["Flutter", "REST (Swagger)"],
    role: "Developer",
    status: "live",
    featured: false,
    category: "Product",
    links: [{ label: "Live", url: "https://platform.afretrade.com/" }],
  },
  {
    slug: "canpad",
    title: "Canpad",
    summary:
      "Membership website for Canadian-Nigerian medical professionals, plus the association's mobile app and IT support",
    stack: ["WordPress", "Mobile (iOS)"],
    role: "Developer & IT Support",
    status: "live",
    featured: false,
    category: "Business",
    links: live("https://canpad.net"),
  },
  {
    slug: "folashaye-global",
    title: "Folashaye Global",
    summary:
      "Business site for haulage, vocational services, construction and exam registration in Lagos",
    stack: ["React", "SEO"],
    role: "Developer",
    status: "live",
    featured: false,
    category: "Business",
    links: live("https://folashayeglobal.com"),
    image: "/projects/folashaye-global.jpg",
  },
  {
    slug: "shopmaster",
    title: "ShopMaster",
    summary: "Local business discovery app connecting customers with trusted local services",
    stack: ["Flutter"],
    role: "Developer",
    status: "live",
    featured: false,
    category: "Product",
    links: live("https://shopmaster.folashayeglobal.com"),
    image: "/projects/shopmaster.jpg",
  },
  {
    slug: "insightpilot",
    title: "InsightPilot",
    summary: "Turns CSVs into dashboards with automatic analysis and export",
    stack: ["React", "Next.js", "TypeScript", "Tailwind"],
    role: "Developer",
    status: "live",
    featured: false,
    category: "Product",
    links: live("https://insightpilot-drab.vercel.app"),
    image: "/projects/insightpilot.jpg",
  },
  {
    slug: "mindspace-ai",
    title: "MindSpace AI",
    summary: "Mental wellness assistant with Google auth and AI-driven guidance",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    role: "Developer",
    status: "live",
    featured: false,
    category: "Product",
    links: live("https://mindspace-ai.vercel.app"),
    image: "/projects/mindspace-ai.png",
  },
  {
    slug: "lovers-code",
    title: "Lover's Code",
    summary: "Platform for connections: AI companionship, matchmaking, solo journeys",
    stack: ["React", "Next.js", "TypeScript", "Tailwind"],
    role: "Developer",
    status: "live",
    featured: false,
    category: "Product",
    links: live("https://Lover-livid.vercel.app"),
  },
  {
    slug: "tifes-gourmet",
    title: "Tife's Gourmet",
    summary: "Food business site: bakery, smoothie bar, healthy options with ordering",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    role: "Developer",
    status: "live",
    featured: false,
    category: "Business",
    links: live("https://Tife.lovestoblog.com"),
  },
  {
    slug: "pulsetrack",
    title: "PulseTrack",
    summary: "Live mobility tracking MVP",
    stack: ["Next.js", "TypeScript"],
    role: "Developer",
    repo: "ObaniwaMichael/Tracker",
    status: "live",
    featured: true,
    category: "Product",
    links: live("https://tracker-weld-psi.vercel.app"),
  },
  {
    slug: "mama-shot-it",
    title: "Mama Shot It",
    summary:
      "Photography and beauty studio site with services, portfolio, pricing and WhatsApp booking",
    stack: ["React", "TypeScript", "Tailwind"],
    role: "Developer",
    repo: "ObaniwaMichael/mama-shot-it-studio",
    status: "live",
    featured: true,
    category: "Creative",
    links: live("https://mama-shot-it-studio.vercel.app"),
  },
  {
    slug: "mdrealtor",
    title: "MDREALTOR",
    summary:
      "Real estate listings for Badagry and Agbara with video walkthroughs and WhatsApp inquiry",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    role: "Developer",
    repo: "ObaniwaMichael/mdrealtor",
    status: "live",
    featured: true,
    category: "Business",
    links: live("https://mdrealtor.vercel.app"),
  },
  {
    slug: "webwizard-jr",
    title: "WebWizard Jr.",
    summary: "Kids' coding game with XP levels, challenges and an AI coach",
    stack: ["JavaScript", "Claude API"],
    role: "Developer",
    repo: "ObaniwaMichael/kiddy",
    status: "live",
    featured: true,
    category: "Education",
    links: live("https://kiddy-peach.vercel.app"),
  },
  {
    slug: "fedpoly-ilaro-attend",
    title: "FederalPolyIlaro Attend",
    summary:
      "QR attendance system (also known as AttendX) with separate student and tutor portals",
    stack: ["JavaScript", "QR scanning"],
    role: "Developer",
    repo: "ObaniwaMichael/FederalPolyIlaro-Attend",
    status: "live",
    featured: true,
    category: "Education",
    links: live("https://federal-poly-ilaro-attend.vercel.app"),
  },
  {
    slug: "triss5glam",
    title: "Triss5Glam",
    summary: "Makeup artist site with portfolio, services and WhatsApp booking",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    role: "Developer",
    repo: "ObaniwaMichael/Triss5",
    status: "live",
    featured: false,
    category: "Creative",
    links: live("https://triss5.vercel.app"),
  },
  {
    slug: "lades-touch",
    title: "Lade's Touch",
    summary: "Home massage booking site with multi-step booking form",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    role: "Developer",
    repo: "ObaniwaMichael/Lades-Touch",
    status: "live",
    featured: false,
    category: "Business",
    links: live("https://ladestouch.vercel.app"),
  },
  {
    slug: "rollys-design-studio",
    title: "Rolly's Design Studio",
    summary: "Portfolio site for a UI/UX designer and frontend developer",
    stack: ["React", "TypeScript"],
    role: "Developer",
    repo: "ObaniwaMichael/rolly-s-design-studio",
    status: "live",
    featured: false,
    category: "Creative",
    links: live("https://rolly-s.vercel.app"),
  },
  {
    slug: "kingmaker",
    title: "This portfolio",
    summary: "Linux desktop-style portfolio",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    role: "Designer & Developer",
    repo: "ObaniwaMichael/kingmaker",
    status: "live",
    featured: false,
    category: "Product",
    links: live("https://kingmaker-ten.vercel.app"),
  },
  {
    slug: "upco-scraper",
    title: "UPCO Scraper",
    summary: "Lead generation tool with CSV export",
    stack: [],
    role: "Developer",
    status: "private",
    featured: false,
    category: "Automation",
  },
  {
    slug: "mysterium",
    title: "Mysterium",
    summary:
      "WhatsApp-first VPN reseller business with an auto-reply bot, two subscription tiers and a member dashboard",
    stack: ["Botpress", "WhatsApp Business", "HTML/CSS/JS"],
    role: "Founder & Developer",
    status: "private",
    featured: false,
    category: "Automation",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectLinks(project: Project): ProjectLink[] {
  return project.links ?? [];
}

export function primaryLink(project: Project): ProjectLink | undefined {
  return projectLinks(project)[0];
}

export function githubUrl(repo: string): string {
  return `https://github.com/${repo}`;
}

export function sortedProjects(list: Project[] = projects): Project[] {
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
}

export function projectsByCategory(category: ProjectCategory | "All"): Project[] {
  const list = sortedProjects();
  if (category === "All") return list;
  return list.filter((p) => p.category === category);
}

export function linkFileName(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".url";
}
