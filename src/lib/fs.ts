import { contact } from "@/data/contact";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { githubUrl, linkFileName, projectLinks, projects } from "@/data/projects";
import { skills } from "@/data/skills";

export type FsFile = {
  type: "file";
  name: string;
  content: string;
  app?: string;
  url?: string;
  label?: string;
};
export type FsDir = { type: "dir"; name: string; children: Record<string, FsNode> };
export type FsNode = FsFile | FsDir;

const HOME = "/home/guest";

function file(
  name: string,
  content: string,
  app?: string,
  url?: string,
  label?: string,
): FsFile {
  return { type: "file", name, content, app, url, label };
}

function dir(name: string, children: FsNode[]): FsDir {
  const map: Record<string, FsNode> = {};
  for (const child of children) map[child.name] = child;
  return { type: "dir", name, children: map };
}

const aboutMd = ["# " + profile.name, "", ...profile.about].join("\n") + "\n";

const readmeMd = [
  "# " + profile.handle,
  "",
  profile.title,
  profile.tagline,
  "",
  "Type help in the terminal.",
].join("\n");

const projectFiles = projects.map((p) => {
  const links = projectLinks(p);
  const body = [
    "# " + p.title,
    "",
    p.summary,
    "",
    "Role: " + p.role,
    ...(p.stack.length > 0 ? ["Stack: " + p.stack.join(", ")] : []),
    "Category: " + p.category,
    "Status: " + p.status,
    ...links.map((l) => l.label + ": " + l.url),
    ...(p.repo ? ["Repo: " + githubUrl(p.repo)] : []),
    ...(links.length === 0 ? ["Private / client work"] : []),
  ].join("\n");
  if (links.length > 1) {
    const children = links.map((l) =>
      file(linkFileName(l.label), l.url, "browser", l.url, l.label),
    );
    if (p.repo) {
      const url = githubUrl(p.repo);
      children.push(file("github.url", url, "browser", url, "Repo"));
    }
    return dir(p.slug, children);
  }
  return file(p.slug + ".md", body, "projects");
});

const guest = dir("guest", [
  file("README.md", readmeMd),
  file("about.md", aboutMd, "about"),
  file("resume.pdf", "Binary: download at /resume.pdf", "resume"),
  file("contact.sh", "echo " + contact.email, "contact"),
  dir("projects", projectFiles),
]);

export const vfs: FsDir = dir("", [dir("home", [guest])]);

export function normalizePath(cwd: string, input: string): string {
  let raw = input.trim();
  if (!raw) return cwd;
  if (raw === "~") return HOME;
  if (raw.startsWith("~/")) raw = HOME + "/" + raw.slice(2);
  const abs = raw.startsWith("/") ? raw : cwd + "/" + raw;
  const parts: string[] = [];
  for (const seg of abs.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return "/" + parts.join("/");
}

export function getNode(path: string): FsNode | undefined {
  if (path === "/") return vfs;
  const parts = path.split("/").filter(Boolean);
  let node: FsNode = vfs;
  for (const part of parts) {
    if (node.type !== "dir") return undefined;
    const next: FsNode | undefined = node.children[part];
    if (!next) return undefined;
    node = next;
  }
  return node;
}

export function listDir(path: string): string[] | undefined {
  const node = getNode(path);
  if (!node || node.type !== "dir") return undefined;
  return Object.keys(node.children);
}

export function readFile(path: string): string | undefined {
  const node = getNode(path);
  if (!node || node.type !== "file") return undefined;
  return node.content;
}

export function dirLinks(path: string): { label: string; url: string }[] {
  const node = getNode(path);
  if (!node || node.type !== "dir") return [];
  return Object.values(node.children).flatMap((child) => {
    if (child.type !== "file" || !child.url) return [];
    return [
      {
        label: child.label ?? child.name.replace(/\.url$/, ""),
        url: child.url,
      },
    ];
  });
}

export const HOME_PATH = HOME;

export const skillsText = skills
  .map((g) => g.name + ": " + g.items.map((i) => i.name + " (" + i.level + "%)").join(", "))
  .join("\n");

export const experienceText = experience
  .map((e) => e.org + " — " + e.role + (e.current ? " (current)" : "") + "\n  " + e.line)
  .join("\n");
