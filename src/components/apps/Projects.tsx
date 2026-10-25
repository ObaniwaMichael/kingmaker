"use client";

import { useState } from "react";
import Image from "next/image";
import { CategoryChips, ProjectActions } from "@/components/projects/ProjectActions";
import {
  getProject,
  projectsByCategory,
  type ProjectCategory,
} from "@/data/projects";
import { useDesktop } from "@/store/desktop";

export function Projects({ payload }: { payload?: string }) {
  const openApp = useDesktop((s) => s.openApp);
  const project = payload ? getProject(payload) : undefined;
  const [category, setCategory] = useState<"All" | ProjectCategory>("All");

  if (project) {
    return (
      <div className="h-full overflow-auto p-4 font-prose">
        <button type="button" className="mb-3 text-xs text-accent" onClick={() => openApp("projects")}>
          ← All projects
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <span className="border border-border px-1.5 py-0.5 text-[10px] uppercase text-muted">
            {project.category}
          </span>
          <span className="border border-accent/50 px-1.5 py-0.5 text-[10px] uppercase text-accent">
            {project.status}
          </span>
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
        <div className="mt-4">
          <ProjectActions
            project={project}
            onOpen={(link) => openApp("browser", link.url, link.label)}
          />
        </div>
      </div>
    );
  }

  const list = projectsByCategory(category);

  return (
    <div className="flex h-full flex-col overflow-auto p-4">
      <CategoryChips value={category} onChange={setCategory} />
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {list.map((p) => (
          <article key={p.slug} className="flex flex-col border border-border bg-surface p-3 text-left">
            <button type="button" className="text-left" onClick={() => openApp("projects", p.slug, p.title)}>
              <div className="relative mb-2 aspect-video w-full overflow-hidden bg-bg">
                {p.image ? (
                  <Image src={p.image} alt="" fill className="object-cover" sizes="320px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-accent">{p.title}</div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{p.title}</h3>
                <span className="shrink-0 text-[10px] uppercase text-muted">{p.category}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{p.summary}</p>
            </button>
            <div className="mt-2">
              <ProjectActions
                project={p}
                onOpen={(link) => openApp("browser", link.url, p.title)}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
