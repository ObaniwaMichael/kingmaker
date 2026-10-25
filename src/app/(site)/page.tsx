import type { Metadata } from "next";
import { Desktop } from "@/components/desktop/Desktop";
import { HomeContent, SiteNav } from "@/components/site/SimpleSite";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  description: profile.tagline,
};

export default function HomePage() {
  return (
    <>
      <Desktop />
      <div id="simple-site" className="simple-site">
        <SiteNav />
        <HomeContent />
      </div>
    </>
  );
}
