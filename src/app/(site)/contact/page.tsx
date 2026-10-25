import type { Metadata } from "next";
import { contact } from "@/data/contact";
import { profile, SITE_URL } from "@/data/profile";
import { SiteNav } from "@/components/site/SimpleSite";
import { Contact } from "@/components/apps/Contact";

const description = `Contact ${profile.name} by email, WhatsApp, GitHub, or the message form.`;

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    url: `${SITE_URL}/contact`,
    description,
  },
  twitter: {
    description,
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-semibold font-prose">Contact</h1>
        <p className="mb-6 font-prose text-muted">
          <a className="text-accent" href={`mailto:${contact.email}`}>{contact.email}</a>
          {" · "}
          <a className="text-accent" href={contact.whatsapp}>WhatsApp</a>
          {" · "}
          <a className="text-accent" href={contact.github}>GitHub</a>
        </p>
        <Contact />
      </main>
    </>
  );
}
