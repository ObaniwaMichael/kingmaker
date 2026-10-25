"use client";

import NextImage from "next/image";
import { projects } from "@/data/projects";
import { useDesktop } from "@/store/desktop";

export function Pictures() {
  const openApp = useDesktop((s) => s.openApp);
  const items = projects.filter((p) => Boolean(p.image));

  return (
    <div className="grid h-full grid-cols-1 gap-3 overflow-auto p-4 sm:grid-cols-2">
      {items.map((p) => (
        <button
          key={p.slug}
          type="button"
          className="group flex flex-col overflow-hidden border border-border bg-surface/80 text-left hover:border-accent"
          onClick={() => openApp("projects", p.slug, p.title)}
        >
          <div className="relative aspect-video w-full overflow-hidden bg-bg">
            {p.image ? (
              <NextImage
                src={p.image}
                alt={p.title}
                fill
                sizes="340px"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : null}
          </div>
          <div className="flex items-center justify-between px-3 py-2 text-xs">
            <span className="truncate font-semibold text-fg">{p.title}</span>
            <span className="text-muted">{p.slug}.jpg</span>
          </div>
        </button>
      ))}
    </div>
  );
}
