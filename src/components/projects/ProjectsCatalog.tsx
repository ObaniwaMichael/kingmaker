"use client";

import { useState } from "react";
import Link from "next/link";
import { CategoryChips, ProjectActions } from "@/components/projects/ProjectActions";
import { projectsByCategory, type ProjectCategory } from "@/data/projects";

export function ProjectsCatalog() {
  const [category, setCategory] = useState<"All" | ProjectCategory>("All");
  const list = projectsByCategory(category);

  return (
    <>
      <CategoryChips value={category} onChange={setCategory} />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {list.map((p) => (
          <li key={p.slug} className="border border-border bg-surface p-4">
            <h2 className="text-lg font-semibold">
              <Link className="text-accent" href={`/projects/${p.slug}`}>
                {p.title}
              </Link>
            </h2>
            <p className="mt-1 text-[10px] uppercase text-muted">{p.category}</p>
            <p className="mt-2 text-sm text-muted">{p.summary}</p>
            {p.stack.length > 0 ? <p className="mt-2 text-xs">{p.stack.join(" · ")}</p> : null}
            <div className="mt-3">
              <ProjectActions project={p} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
