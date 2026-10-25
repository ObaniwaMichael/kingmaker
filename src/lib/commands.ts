import { contact } from "@/data/contact";
import { profile } from "@/data/profile";
import { getProject, projects } from "@/data/projects";
import type { AppId } from "@/store/desktop";
import type { ThemeName } from "@/lib/themes";
import { THEMES, THEME_LABELS } from "@/lib/themes";
import {
  HOME_PATH,
  dirLinks,
  experienceText,
  getNode,
  listDir,
  normalizePath,
  readFile,
  skillsText,
} from "@/lib/fs";

export const COMMANDS = [
  "help",
  "about",
  "whoami",
  "ls",
  "cd",
  "cat",
  "pwd",
  "projects",
  "project",
  "skills",
  "experience",
  "contact",
  "resume",
  "theme",
  "neofetch",
  "clear",
  "history",
  "sudo",
  "open",
  "exit",
] as const;

export type LineIcon = "folder" | "file" | "link";

export type Line =
  | { kind: "text"; text: string; icon?: LineIcon }
  | { kind: "link"; text: string; href: string; icon?: LineIcon };

export type CommandCtx = {
  cwd: string;
  history: string[];
  setCwd: (p: string) => void;
  setTheme: (t: ThemeName) => void;
  openApp: (app: AppId, payload?: string, title?: string) => void;
  close: () => void;
};

export type CommandResult = {
  lines: Line[];
  clear?: boolean;
};

const APPS: AppId[] = [
  "terminal",
  "files",
  "projects",
  "pictures",
  "about",
  "browser",
  "contact",
  "settings",
  "monitor",
];

function text(s: string, icon?: LineIcon): Line[] {
  return s.split("\n").map((line) => ({ kind: "text" as const, text: line, icon }));
}

const NEOFETCH = `
      ██████╗ ██████╗ 
      ██╔══██╗██╔══██╗
      ██████╔╝██████╔╝
      ██╔══██╗██╔══██╗
      ██║  ██║██║  ██║
      ╚═╝  ╚═╝╚═╝  ╚═╝
${profile.handle}@${profile.hostname}
------------------------
OS: ${profile.os}
Host: ${profile.name}
Shell: ${profile.shell}
Uptime: ${profile.uptime}
Stack: ${profile.stack.join(", ")}
Theme: data-theme
`.trim();

export function complete(input: string, cwd: string): string {
  const parts = input.split(" ");
  const last = parts[parts.length - 1] ?? "";
  if (parts.length <= 1) {
    const hit = COMMANDS.find((c) => c.startsWith(last));
    return hit ?? input;
  }
  const cmd = parts[0];
  if (cmd === "open") {
    const tokens = input.split(/\s+/);
    if (tokens.length <= 2) {
      const hit =
        APPS.find((a) => a.startsWith(last)) ??
        projects.find((p) => p.slug.startsWith(last))?.slug;
      if (hit) return `open ${hit}`;
    } else {
      const p = getProject(tokens[1] ?? "");
      const hit = p?.links.find((l) =>
        l.label.toLowerCase().startsWith(last.toLowerCase()),
      );
      if (p && hit) return `open ${p.slug} ${hit.label}`;
    }
  }
  if (cmd === "theme") {
    const hit = THEMES.find((t) => t.startsWith(last));
    if (hit) return `theme ${hit}`;
  }
  if (cmd === "project") {
    const hit = projects.find((p) => p.slug.startsWith(last));
    if (hit) return `project ${hit.slug}`;
  }
  if (cmd === "cd" || cmd === "cat" || cmd === "ls") {
    const parent = normalizePath(cwd, last.includes("/") ? last.slice(0, last.lastIndexOf("/") + 1) : ".");
    const prefix = last.includes("/") ? last.slice(last.lastIndexOf("/") + 1) : last;
    const names = listDir(parent) ?? [];
    const hit = names.find((n) => n.startsWith(prefix));
    if (hit) {
      const base = last.includes("/") ? last.slice(0, last.lastIndexOf("/") + 1) : "";
      return `${cmd} ${base}${hit}`;
    }
  }
  return input;
}

export function runCommand(raw: string, ctx: CommandCtx): CommandResult {
  const trimmed = raw.trim();
  if (!trimmed) return { lines: [] };
  const [cmd, ...rest] = trimmed.split(/\s+/);
  const arg = rest.join(" ");

  switch (cmd) {
    case "help":
      return { lines: text(`Available commands:\n${COMMANDS.join(", ")}`) };
    case "about":
      return { lines: text(profile.about.join("\n\n")) };
    case "whoami":
      return { lines: text(`${profile.name} (${profile.handle})\n${profile.title}`) };
    case "pwd":
      return { lines: text(ctx.cwd, "folder") };
    case "ls": {
      const path = normalizePath(ctx.cwd, arg || ".");
      const names = listDir(path);
      if (!names) return { lines: text(`ls: ${path}: not a directory`) };
      const node = getNode(path);
      if (node?.type !== "dir") return { lines: text(`ls: ${path}: not a directory`) };
      if (names.length === 0) return { lines: text("(empty)") };
      return {
        lines: names.map((n) => {
          const isDir = node.children[n].type === "dir";
          return {
            kind: "text" as const,
            text: isDir ? `${n}/` : n,
            icon: isDir ? "folder" : "file",
          };
        }),
      };
    }
    case "cd": {
      const path = normalizePath(ctx.cwd, arg || HOME_PATH);
      const node = getNode(path);
      if (!node) return { lines: text(`cd: no such file or directory: ${arg}`) };
      if (node.type !== "dir") return { lines: text(`cd: not a directory: ${arg}`) };
      ctx.setCwd(path);
      return { lines: [] };
    }
    case "cat": {
      if (!arg) return { lines: text("cat: missing file") };
      const rawPath = normalizePath(ctx.cwd, arg);
      const path = getNode(rawPath)
        ? rawPath
        : getNode(rawPath.replace(/\.md$/, ""))
          ? rawPath.replace(/\.md$/, "")
          : getNode(`${rawPath}.md`)
            ? `${rawPath}.md`
            : rawPath;
      const node = getNode(path);
      if (!node) return { lines: text(`cat: ${arg}: no such file`) };
      if (node.type === "dir") {
        const links = dirLinks(path);
        if (!links.length) return { lines: text(`cat: ${arg}: is a directory`) };
        return {
          lines: links.map((l) => ({
            kind: "link" as const,
            text: `${l.label} — ${l.url}`,
            href: l.url,
            icon: "link" as const,
          })),
        };
      }
      if (node.url) {
        return {
          lines: [
            {
              kind: "link",
              text: node.label ? `${node.label} — ${node.url}` : node.url,
              href: node.url,
              icon: "link",
            },
          ],
        };
      }
      const content = readFile(path);
      if (content === undefined) return { lines: text(`cat: ${arg}: no such file`) };
      return {
        lines: [
          { kind: "text", text: node.name, icon: "file" },
          ...text(content),
        ],
      };
    }
    case "projects":
      return {
        lines: projects.flatMap((p) => [
          {
            kind: "text" as const,
            text: `${p.slug} — ${p.title}`,
            icon: (p.links.length > 1 ? "folder" : "file") as LineIcon,
          },
          ...p.links.map((l) => ({
            kind: "link" as const,
            text: `${l.label}: ${l.url}`,
            href: l.url,
            icon: "link" as const,
          })),
        ]),
      };
    case "project": {
      const p = projects.find((x) => x.slug === arg);
      if (!p) return { lines: text("usage: project <slug>") };
      ctx.openApp("projects", p.slug, p.title);
      return {
        lines: [
          { kind: "text" as const, text: `${p.title} (${p.role})`, icon: "file" },
          { kind: "text" as const, text: p.summary },
          ...(p.stack.length > 0
            ? [{ kind: "text" as const, text: `Stack: ${p.stack.join(", ")}` }]
            : []),
          ...p.links.map((l) => ({
            kind: "link" as const,
            text: `${l.label}: ${l.url}`,
            href: l.url,
            icon: "link" as const,
          })),
        ],
      };
    }
    case "skills":
      return { lines: text(skillsText) };
    case "experience":
      return { lines: text(experienceText) };
    case "contact":
      return {
        lines: [
          { kind: "link", text: contact.email, href: `mailto:${contact.email}`, icon: "link" },
          { kind: "link", text: contact.whatsapp, href: contact.whatsapp, icon: "link" },
          { kind: "link", text: contact.github, href: contact.github, icon: "link" },
        ],
      };
    case "resume":
      return {
        lines: [{ kind: "link", text: "Download CV", href: contact.resume, icon: "file" }],
      };
    case "theme": {
      if (!THEMES.includes(arg as ThemeName)) {
        return { lines: text(`themes: ${THEMES.map((t) => `${t} (${THEME_LABELS[t]})`).join(", ")}`) };
      }
      ctx.setTheme(arg as ThemeName);
      return { lines: text(`theme set to ${THEME_LABELS[arg as ThemeName]}`) };
    }
    case "neofetch":
      return { lines: text(NEOFETCH) };
    case "clear":
      return { lines: [], clear: true };
    case "history":
      return { lines: text(ctx.history.map((h, i) => `${i + 1}  ${h}`).join("\n")) };
    case "sudo":
      return {
        lines: text(
          `${profile.handle} is not in the sudoers file. This incident will be reported.`,
        ),
      };
    case "open": {
      const [target, ...labelParts] = rest;
      if (!target) {
        return { lines: text(`open: try apps (${APPS.join(", ")}) or a project slug`) };
      }
      const project = getProject(target);
      if (project) {
        const hint = labelParts.join(" ").toLowerCase();
        const chosen = hint
          ? project.links.find(
              (l) =>
                l.label.toLowerCase().includes(hint) ||
                l.label.toLowerCase() === hint,
            )
          : project.links.length === 1
            ? project.links[0]
            : undefined;
        if (chosen) {
          ctx.openApp("browser", chosen.url, `${project.title} — ${chosen.label}`);
          return {
            lines: [
              {
                kind: "link",
                text: `${chosen.label}: ${chosen.url}`,
                href: chosen.url,
                icon: "link",
              },
            ],
          };
        }
        return {
          lines: [
            {
              kind: "text",
              text: `Select a link for ${project.title} (usage: open ${project.slug} <portal>):`,
              icon: "folder",
            },
            ...project.links.map((l) => ({
              kind: "link" as const,
              text: `${l.label} — ${l.url}`,
              href: l.url,
              icon: "link" as const,
            })),
          ],
        };
      }
      if (!APPS.includes(target as AppId)) {
        return { lines: text(`open: unknown app. try: ${APPS.join(", ")}`) };
      }
      ctx.openApp(target as AppId);
      return { lines: text(`opened ${target}`) };
    }
    case "exit":
      ctx.close();
      return { lines: text("logout") };
    default:
      return { lines: text(`command not found: ${cmd}. try help`) };
  }
}
