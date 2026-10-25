import type { Metadata } from "next";
import { profile, SITE_URL } from "@/data/profile";
import { SiteNav } from "@/components/site/SimpleSite";
import { ProjectsCatalog } from "@/components/projects/ProjectsCatalog";

const description = `Projects by ${profile.name} — education, product, business, creative and automation work.`;

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    url: `${SITE_URL}/projects`,
    description,
  },
  twitter: {
    description,
  },
};

export default function ProjectsPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-10 font-prose">
        <h1 className="mb-6 text-3xl font-semibold">Projects</h1>
        <ProjectsCatalog />
      </main>
    </>
  );
}
