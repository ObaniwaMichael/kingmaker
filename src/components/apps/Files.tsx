"use client";

import { useState } from "react";
import { FileText, Folder, Globe, Lock } from "lucide-react";
import { getNode, HOME_PATH, listDir, normalizePath, type FsDir } from "@/lib/fs";
import { useDesktop } from "@/store/desktop";
import { getProject, projectLinks } from "@/data/projects";

export function Files() {
  const openApp = useDesktop((s) => s.openApp);
  const [cwd, setCwd] = useState(HOME_PATH);
  const [list, setList] = useState(false);
  const node = getNode(cwd);
  const names = listDir(cwd) ?? [];
  const crumbs = cwd.split("/").filter(Boolean);

  function openName(name: string) {
    const path = normalizePath(cwd, name);
    const n = getNode(path);
    if (!n) return;
    if (n.type === "dir") {
      setCwd(path);
      return;
    }
    if (n.app === "about") openApp("about");
    else if (n.app === "contact") openApp("contact");
    else if (n.app === "resume") window.open("/resume.pdf", "_blank", "noopener,noreferrer");
    else if (n.app === "browser" && n.url) {
      openApp("browser", n.url, n.label ?? name.replace(/\.url$/, ""));
    } else if (n.app === "projects" || name.endsWith(".md")) {
      const slug = name.replace(/\.md$/, "");
      const p = getProject(slug);
      openApp("projects", slug, p?.title);
    } else if (name === "README.md") openApp("terminal");
  }

  function goCrumb(i: number) {
    setCwd("/" + crumbs.slice(0, i + 1).join("/"));
  }

  return (
    <div className="flex h-full bg-transparent text-sm">
      <aside className="w-40 border-r border-border bg-surface/75 p-2">
        <button type="button" className="block w-full px-2 py-1 text-left hover:bg-bg/60" onClick={() => setCwd(HOME_PATH)}>
          Home
        </button>
        <button type="button" className="block w-full px-2 py-1 text-left hover:bg-bg/60" onClick={() => setCwd(`${HOME_PATH}/projects`)}>
          Projects
        </button>
        <button type="button" className="block w-full px-2 py-1 pl-4 text-left text-xs text-muted hover:bg-bg/60 hover:text-fg" onClick={() => setCwd(`${HOME_PATH}/projects/springbase`)}>
          springbase/
        </button>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-1">
            {crumbs.map((c, i) => (
              <button key={`${c}-${i}`} type="button" className="text-accent" onClick={() => goCrumb(i)}>
                {c}
                {i < crumbs.length - 1 ? " /" : ""}
              </button>
            ))}
          </nav>
          <button type="button" onClick={() => setList((v) => !v)}>
            {list ? "Grid" : "List"}
          </button>
        </div>
        <div className={list ? "flex flex-col" : "grid grid-cols-2 gap-2 p-3 sm:grid-cols-3"}>
          {node?.type === "dir"
            ? names.map((name) => {
                const child = (node as FsDir).children[name];
                const isUrl = child.type === "file" && name.endsWith(".url");
                const slug = name.replace(/\.md$/, "");
                const project = getProject(slug);
                const isPrivate = Boolean(project && projectLinks(project).length === 0);
                return (
                  <button
                    key={name}
                    type="button"
                    className={`flex items-center gap-2 p-2 text-left hover:bg-surface/75 ${list ? "border-b border-border" : ""}`}
                    onDoubleClick={() => openName(name)}
                    onClick={() => {
                      if (child.type === "dir" || isUrl) openName(name);
                    }}
                  >
                    {child.type === "dir" ? (
                      <Folder className="size-4 shrink-0 text-accent" />
                    ) : isUrl ? (
                      <Globe className="size-4 shrink-0 text-accent" />
                    ) : isPrivate ? (
                      <Lock className="size-4 shrink-0 text-muted" />
                    ) : (
                      <FileText className="size-4 shrink-0 text-accent-2" />
                    )}
                    <span className="truncate">{name}</span>
                  </button>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}
