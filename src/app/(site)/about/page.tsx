import type { Metadata } from "next";
import { profile, SITE_URL } from "@/data/profile";
import { SiteNav } from "@/components/site/SimpleSite";

const description = `About ${profile.name}, ${profile.title} based in ${profile.location}.`;

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    url: `${SITE_URL}/about`,
    description,
  },
  twitter: {
    description,
  },
};

export default function AboutPage() {
  return (
    <>
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 bg-surface px-3 py-1">
        Skip to content
      </a>
      <SiteNav />
      <main id="content" className="mx-auto max-w-3xl px-4 py-10 font-prose">
        <h1 className="text-3xl font-semibold">About {profile.name}</h1>
        {profile.about.map((p) => (
          <p key={p.slice(0, 20)} className="mt-4 leading-relaxed">
            {p}
          </p>
        ))}
      </main>
    </>
  );
}
