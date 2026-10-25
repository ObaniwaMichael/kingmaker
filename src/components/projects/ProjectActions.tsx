"use client";

import {
  Github,
  GraduationCap,
  Lock,
  School,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  PROJECT_CATEGORIES,
  githubUrl,
  projectLinks,
  type Project,
  type ProjectCategory,
  type ProjectLink,
} from "@/data/projects";

const PORTAL_ICONS: Record<string, LucideIcon> = {
  "School site": School,
  "Admin portal": ShieldCheck,
  "Parent portal": Users,
  "Student portal": GraduationCap,
};

const btn =
  "inline-flex items-center gap-1.5 border border-border px-2 py-1 text-xs hover:border-accent";

export function ProjectActions({
  project,
  onOpen,
}: {
  project: Project;
  onOpen?: (link: ProjectLink) => void;
}) {
  const links = projectLinks(project);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.length === 0 ? (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <Lock className="size-3.5" aria-hidden />
          Private / client work
        </span>
      ) : (
        links.map((link) => {
          const Icon = PORTAL_ICONS[link.label];
          if (onOpen) {
            return (
              <button
                key={link.url}
                type="button"
                className={btn}
                onClick={() => onOpen(link)}
              >
                {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
                {link.label}
              </button>
            );
          }
          return (
            <a
              key={link.url}
              className={`${btn} text-accent`}
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
              {link.label}
            </a>
          );
        })
      )}
      {project.repo ? (
        <a
          className={`${btn} text-accent`}
          href={githubUrl(project.repo)}
          target="_blank"
          rel="noreferrer"
        >
          <Github className="size-3.5" aria-hidden />
          Repo
        </a>
      ) : null}
    </div>
  );
}

export function CategoryChips({
  value,
  onChange,
}: {
  value: "All" | ProjectCategory;
  onChange: (next: "All" | ProjectCategory) => void;
}) {
  const options = ["All", ...PROJECT_CATEGORIES] as const;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((c) => (
        <button
          key={c}
          type="button"
          className={`border px-2 py-1 text-xs uppercase ${
            value === c ? "border-accent text-accent" : "border-border text-muted"
          }`}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
