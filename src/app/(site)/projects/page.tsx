import type { Metadata } from "next";
import Link from "next/link";
import { primaryLink, projects } from "@/data/projects";
import { profile, SITE_URL } from "@/data/profile";
import { SiteNav } from "@/components/site/SimpleSite";

export const metadata: Metadata = {
  title: "Projects",
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    url: `${SITE_URL}/projects`,
    images: [{ url: "/wallpapers/laptop-wallpaper.jpg", width: 1200, height: 630, alt: `${profile.name} — ${profile.title}` }],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-10 font-prose">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.slug} className="border border-border bg-surface p-4">
              <h2 className="text-lg font-semibold">
                <Link className="text-accent" href={`/projects/${p.slug}`}>
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted">{p.summary}</p>
              <p className="mt-2 text-xs">{p.stack.join(" · ")}</p>
              <p className="mt-3">
                <a className="text-accent" href={primaryLink(p).url} target="_blank" rel="noreferrer">
                  Live
                </a>
              </p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
