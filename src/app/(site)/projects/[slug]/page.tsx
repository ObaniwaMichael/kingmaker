import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GraduationCap, School, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { SITE_URL } from "@/data/profile";
import { SiteNav } from "@/components/site/SimpleSite";

const PORTAL_ICONS: Record<string, LucideIcon> = {
  "School site": School,
  "Admin portal": ShieldCheck,
  "Parent portal": Users,
  "Student portal": GraduationCap,
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `${SITE_URL}/projects/${p.slug}` },
    openGraph: {
      url: `${SITE_URL}/projects/${p.slug}`,
      description: p.summary,
      images: [
        {
          url: p.image || "/wallpapers/laptop-wallpaper.jpg",
          width: 1200,
          height: 630,
          alt: p.title,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-10 font-prose">
        <h1 className="text-3xl font-semibold">{p.title}</h1>
        <p className="mt-2 text-muted">{p.summary}</p>
        <p className="mt-4 text-sm">Role: {p.role}</p>
        <p className="mt-1 text-sm">Stack: {p.stack.join(", ")}</p>
        {p.category ? <p className="mt-1 text-sm">Category: {p.category}</p> : null}
        {p.outcome ? <p className="mt-2">{p.outcome}</p> : null}
        <div className="relative mt-6 aspect-video w-full overflow-hidden border border-border bg-surface">
          {p.image ? (
            <Image src={p.image} alt={p.title} fill className="object-cover" sizes="800px" />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface text-accent">
              {p.title}
            </div>
          )}
        </div>
        <div className="mt-6">
          {p.slug === "springbase" ? (
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Portals</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {p.links.map((link) => {
              const Icon = p.slug === "springbase" ? PORTAL_ICONS[link.label] : undefined;
              return (
                <a
                  key={link.url}
                  className="inline-flex items-center gap-1.5 border border-border px-3 py-1 text-sm text-accent hover:border-accent"
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {Icon ? <Icon className="size-4" aria-hidden /> : null}
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
        {p.repo ? (
          <p className="mt-4 text-sm">
            <a className="text-accent" href={`https://github.com/${p.repo}`} target="_blank" rel="noreferrer">
              GitHub {p.repo}
            </a>
          </p>
        ) : null}
      </main>
    </>
  );
}
