import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { profile, SITE_URL } from "@/data/profile";
import { contact } from "@/data/contact";
import { githubUrl, projectLinks, projects } from "@/data/projects";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-prose-face",
  display: "swap",
});

const homeDescription = profile.tagline;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s · ${profile.name}`,
  },
  description: homeDescription,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: homeDescription,
    url: SITE_URL,
    siteName: profile.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: homeDescription,
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.handle,
  jobTitle: profile.title,
  description: profile.tagline,
  url: SITE_URL,
  email: contact.email,
  sameAs: [
    contact.github,
    contact.whatsapp,
    ...projects.flatMap((p) => [
      ...projectLinks(p).map((l) => l.url),
      ...(p.repo ? [githubUrl(p.repo)] : []),
    ]),
  ],
  address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
  makes: projects.map((p) => {
    const links = projectLinks(p);
    return {
      "@type": "SoftwareApplication",
      name: p.title,
      description: p.summary,
      url: `${SITE_URL}/projects/${p.slug}`,
      ...(links.length > 0 ? { sameAs: links.map((l) => l.url) } : {}),
      ...(p.repo ? { codeRepository: githubUrl(p.repo) } : {}),
      applicationCategory: p.category,
    };
  }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="midnight-code" className={`${jetbrains.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-bg text-fg antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
