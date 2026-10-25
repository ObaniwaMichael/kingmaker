"use client";

import {
  Activity,
  Folder,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  LayoutGrid,
  Mail,
  Settings,
  Terminal,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { AppId } from "@/store/desktop";
import { useDesktop } from "@/store/desktop";

export const DOCK_APPS: { app: AppId; label: string; Icon: LucideIcon }[] = [
  { app: "terminal", label: "Terminal", Icon: Terminal },
  { app: "files", label: "Files", Icon: Folder },
  { app: "projects", label: "Projects", Icon: FolderKanban },
  { app: "pictures", label: "Pictures", Icon: ImageIcon },
  { app: "about", label: "About", Icon: UserRound },
  { app: "browser", label: "Browser", Icon: Globe },
  { app: "contact", label: "Contact", Icon: Mail },
  { app: "settings", label: "Settings", Icon: Settings },
  { app: "monitor", label: "Monitor", Icon: Activity },
];

export function Dock({ mobile }: { mobile?: boolean }) {
  const windows = useDesktop((s) => s.windows);
  const workspace = useDesktop((s) => s.workspace);
  const openApp = useDesktop((s) => s.openApp);
  const activitiesOpen = useDesktop((s) => s.activitiesOpen);
  const setActivitiesOpen = useDesktop((s) => s.setActivitiesOpen);

  const items = DOCK_APPS.map(({ app, label, Icon }) => {
    const active = windows.some(
      (w) => w.app === app && w.workspace === workspace && !w.minimized,
    );
    return (
      <button
        key={app}
        type="button"
        title={label}
        aria-label={label}
        className="group relative flex flex-col items-center justify-center gap-1 p-2 text-fg hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
        onClick={() => openApp(app)}
      >
        <Icon className="size-5 shrink-0" aria-hidden />
        {active ? (
          <span
            className="
              absolute bottom-0.5 size-1.5 rounded-full bg-accent
            "
            aria-hidden
          />
        ) : null}
        {mobile ? (
          <span className="max-w-14 truncate text-[10px] leading-tight">{label}</span>
        ) : (
          <span
            role="tooltip"
            className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap border border-border bg-surface px-2 py-0.5 text-xs text-fg shadow-md group-hover:block"
          >
            {label}
          </span>
        )}
      </button>
    );
  });

  const activitiesBtn = (
    <button
      key="activities"
      type="button"
      title="Activities"
      aria-label="Activities"
      aria-pressed={activitiesOpen}
      className={`group relative flex flex-col items-center justify-center gap-1 p-2 hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent ${
        activitiesOpen ? "text-accent" : "text-fg"
      }`}
      onClick={() => setActivitiesOpen(!activitiesOpen)}
    >
      <LayoutGrid className="size-5 shrink-0" aria-hidden />
      {mobile ? (
        <span className="max-w-14 truncate text-[10px] leading-tight">Activities</span>
      ) : (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap border border-border bg-surface px-2 py-0.5 text-xs text-fg shadow-md group-hover:block"
        >
          Activities
        </span>
      )}
    </button>
  );

  if (mobile) {
    return (
      <nav
        aria-label="Apps"
        className="pointer-events-auto relative z-30 flex h-16 items-center justify-around overflow-x-auto border-t border-border bg-surface/95 px-1 backdrop-blur-[6px]"
      >
        {activitiesBtn}
        {items.slice(0, 5)}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Dock"
      className="pointer-events-auto absolute top-12 bottom-4 left-1 z-[30] flex w-14 flex-col items-center gap-1 border border-border bg-surface/90 py-2 backdrop-blur-[6px]"
    >
      {activitiesBtn}
      {items}
    </nav>
  );
}
