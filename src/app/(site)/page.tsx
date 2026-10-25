import { Desktop } from "@/components/desktop/Desktop";
import { HomeContent, SiteNav } from "@/components/site/SimpleSite";

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
