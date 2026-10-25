import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { SITE_URL } from "@/data/profile";
import { SiteNav } from "@/components/site/SimpleSite";
import { ProjectActions } from "@/components/projects/ProjectActions";

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
    },
    twitter: {
      description: p.summary,
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
        {p.stack.length > 0 ? <p className="mt-1 text-sm">Stack: {p.stack.join(", ")}</p> : null}
        <p className="mt-1 text-sm">Category: {p.category}</p>
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
          <ProjectActions project={p} />
        </div>
      </main>
    </>
  );
}
