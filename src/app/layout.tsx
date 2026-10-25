import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { profile, SITE_URL } from "@/data/profile";
import { contact } from "@/data/contact";
import { primaryLink, projects } from "@/data/projects";
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

const OG_FALLBACK_IMAGE = {
  url: "/wallpapers/laptop-wallpaper.jpg",
  width: 1200,
  height: 630,
  alt: `${profile.name} — ${profile.title}`,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.tagline,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.tagline,
    url: SITE_URL,
    siteName: profile.name,
    type: "website",
    images: [OG_FALLBACK_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.tagline,
    images: ["/wallpapers/laptop-wallpaper.jpg"],
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
    ...projects.flatMap((p) => p.links.map((l) => l.url)),
  ],
  address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
  makes: projects.map((p) => ({
    "@type": "SoftwareApplication",
    name: p.title,
    description: p.summary,
    url: primaryLink(p).url,
    sameAs: p.links.map((l) => l.url),
    ...(p.repo ? { codeRepository: `https://github.com/${p.repo}` } : {}),
  })),
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
