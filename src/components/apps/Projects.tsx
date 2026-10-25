"use client";

import Image from "next/image";
import { GraduationCap, School, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { getProject, primaryLink, projects, type Project, type ProjectLink } from "@/data/projects";
import { useDesktop } from "@/store/desktop";

const PORTAL_ICONS: Record<string, LucideIcon> = {
  "School site": School,
  "Admin portal": ShieldCheck,
  "Parent portal": Users,
  "Student portal": GraduationCap,
};

function LinkRow({
  project,
  onBrowse,
}: {
  project: Project;
  onBrowse: (link: ProjectLink) => void;
}) {
  const primary = primaryLink(project);
  if (project.slug === "springbase") {
    return (
      <div className="mt-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-muted">Portals</p>
        <div className="flex flex-wrap gap-2">
          {project.links.map((link) => {
            const Icon = PORTAL_ICONS[link.label];
            return (
              <button
                key={link.url}
                type="button"
                className="inline-flex items-center gap-1.5 border border-border px-2 py-1 text-xs hover:border-accent"
                onClick={() => onBrowse(link)}
              >
                {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if (project.links.length > 1) {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {project.links.map((link) => (
          <button
            key={link.url}
            type="button"
            className="border border-border px-2 py-1 text-xs hover:border-accent"
            onClick={() => onBrowse(link)}
          >
            {link.label}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-4 flex gap-3 text-sm">
      <a className="text-accent" href={primary.url} target="_blank" rel="noreferrer">
        Live
      </a>
      <button type="button" className="text-accent-2" onClick={() => onBrowse(primary)}>
        Open in Browser
      </button>
    </div>
  );
}

export function Projects({ payload }: { payload?: string }) {
  const openApp = useDesktop((s) => s.openApp);
  const project = payload ? getProject(payload) : undefined;

  if (project) {
    const primary = primaryLink(project);
    return (
      <div className="h-full overflow-auto p-4 font-prose">
        <button type="button" className="mb-3 text-xs text-accent" onClick={() => openApp("projects")}>
          ← All projects
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          {project.category ? (
            <span className="border border-border px-1.5 py-0.5 text-[10px] uppercase text-muted">
              {project.category}
            </span>
          ) : null}
          {project.status ? (
            <span className="border border-accent/50 px-1.5 py-0.5 text-[10px] uppercase text-accent">
              {project.status}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-muted">{project.summary}</p>
        <p className="mt-3 text-xs">Role: {project.role}</p>
        {project.stack.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {project.stack.map((s) => (
              <span key={s} className="border border-border px-2 py-0.5 text-xs">
                {s}
              </span>
            ))}
          </div>
        ) : null}
        <div className="relative mt-4 aspect-video w-full overflow-hidden border border-border bg-surface">
          {project.image ? (
            <Image src={project.image} alt={project.title} fill className="object-cover" sizes="700px" />
          ) : (
            <div className="flex h-full items-center justify-center text-accent">{project.title}</div>
          )}
        </div>
        <LinkRow
          project={project}
          onBrowse={(link) => openApp("browser", link.url, link.label)}
        />
        {project.repo ? (
          <p className="mt-3 text-xs">
            <a
              className="text-accent"
              href={`https://github.com/${project.repo}`}
              target="_blank"
              rel="noreferrer"
            >
              GitHub {project.repo}
            </a>
          </p>
        ) : null}
        {project.links.length > 1 ? (
          <p className="mt-3 text-xs">
            <a className="text-muted underline" href={primary.url} target="_blank" rel="noreferrer">
              Open {primary.label} in new tab
            </a>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-1 gap-3 overflow-auto p-4 sm:grid-cols-2">
      {projects.map((p) => {
        const live = primaryLink(p);
        return (
          <article key={p.slug} className="flex flex-col border border-border bg-surface p-3 text-left">
            <button type="button" className="text-left hover:border-accent" onClick={() => openApp("projects", p.slug, p.title)}>
              <div className="relative mb-2 aspect-video w-full overflow-hidden bg-bg">
                {p.image ? (
                  <Image src={p.image} alt="" fill className="object-cover" sizes="320px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-accent">{p.title}</div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{p.title}</h3>
                {p.category ? (
                  <span className="shrink-0 text-[10px] uppercase text-muted">{p.category}</span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-muted">{p.summary}</p>
            </button>
            <div className="mt-2 flex gap-2 text-xs">
              <a className="text-accent" href={live.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                Live
              </a>
              <button
                type="button"
                className="text-accent-2"
                onClick={() => openApp("browser", live.url, p.title)}
              >
                Browser
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
