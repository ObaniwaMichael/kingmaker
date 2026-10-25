import Link from "next/link";
import { contact } from "@/data/contact";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { sortedProjects } from "@/data/projects";
import { skills } from "@/data/skills";

export function SiteNav() {
  return (
    <nav className="flex flex-wrap gap-4 border-b border-border bg-surface px-4 py-3 text-sm" aria-label="Simple site">
      <Link href="/" className="text-accent">
        Home
      </Link>
      <Link href="/projects">Projects</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <a href={contact.resume}>Resume</a>
    </nav>
  );
}

export function HomeContent() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 font-prose">
      <h1 className="text-3xl font-semibold">{profile.name}</h1>
      <p className="mt-1 text-accent">{profile.title}</p>
      <p className="mt-4 text-muted">{profile.tagline}</p>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">About</h2>
        {profile.about.map((p) => (
          <p key={p.slice(0, 24)} className="mt-3 leading-relaxed">
            {p}
          </p>
        ))}
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Projects</h2>
        <ul className="mt-3 space-y-2">
          {sortedProjects().map((p) => (
            <li key={p.slug}>
              <Link className="text-accent" href={`/projects/${p.slug}`}>
                {p.title}
              </Link>
              <span className="text-muted"> — {p.summary}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Skills</h2>
        {skills.map((g) => (
          <p key={g.name} className="mt-2">
            <strong>{g.name}:</strong> {g.items.map((i) => i.name).join(", ")}
          </p>
        ))}
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Experience</h2>
        {experience.map((e) => (
          <p key={e.org} className="mt-2">
            <strong>{e.org}</strong> — {e.role}. {e.line}
          </p>
        ))}
      </section>
    </article>
  );
}
