export type SkillGroup = {
  name: string;
  items: { name: string; level: number }[];
};

export const skills: SkillGroup[] = [
  {
    name: "Frontend",
    items: [
      { name: "React", level: 94 },
      { name: "Next.js", level: 92 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind", level: 93 },
      { name: "Three.js", level: 72 },
    ],
  },
  {
    name: "Mobile",
    items: [
      { name: "React Native", level: 88 },
      { name: "Flutter", level: 84 },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js", level: 86 },
      { name: "Express", level: 83 },
      { name: "MongoDB", level: 80 },
      { name: "PHP", level: 78 },
      { name: "MySQL", level: 81 },
    ],
  },
  {
    name: "Business",
    items: [
      { name: "Project management", level: 89 },
      { name: "Digital marketing", level: 82 },
      { name: "GA4", level: 80 },
      { name: "SEO", level: 85 },
    ],
  },
];
