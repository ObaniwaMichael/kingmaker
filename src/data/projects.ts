export type ProjectLink = { label: string; url: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  role: string;
  links: ProjectLink[];
  status?: "live" | "in-progress" | "archived";
  image?: string;
  outcome?: string;
  repo?: string;
  featured?: boolean;
  category?: string;
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
    category: "Product",
    links: [{ label: "Live", url: "https://platform.afretrade.com/" }],
  },
  {
    slug: "canpad",
    title: "Canpad",
    summary: "Association website, mobile app (iOS) and IT support",
    stack: ["Web", "Mobile"],
    role: "Developer",
    status: "live",
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
    links: live("https://folashayeglobal.com"),
    image: "/projects/folashaye-global.jpg",
  },
  {
    slug: "shopmaster",
    title: "ShopMaster",
    summary: "Business directory connecting customers with trusted local services",
    stack: ["React", "Next.js", "TypeScript", "Tailwind"],
    role: "Developer",
    status: "live",
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
    links: live("https://mindspace-ai.vercel.app"),
    image: "/projects/mindspace-ai.png",
  },
  {
    slug: "lovers-code",
    title: "Lover's Code",
    summary:
      "Platform for connections: AI companionship, matchmaking, solo journeys",
    stack: ["React", "Next.js", "TypeScript", "Tailwind"],
    role: "Developer",
    status: "live",
    links: live("https://Lover-livid.vercel.app"),
  },
  {
    slug: "tifes-gourmet",
    title: "Tife's Gourmet",
    summary:
      "Food business site: bakery, smoothie bar, healthy options with ordering",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    role: "Developer",
    status: "live",
    links: live("https://Tife.lovestoblog.com"),
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function primaryLink(project: Project): ProjectLink {
  return project.links[0];
}

export function linkFileName(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".url";
}
