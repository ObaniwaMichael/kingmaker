"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { FileTerminal, FileText, Folder } from "lucide-react";
import { Boot } from "@/components/desktop/Boot";
import { ContextMenu } from "@/components/desktop/ContextMenu";
import { Dock, DOCK_APPS } from "@/components/desktop/Dock";
import { TopBar } from "@/components/desktop/TopBar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { APP_ICONS, Window } from "@/components/desktop/Window";
import type { AppId } from "@/store/desktop";
import { useDesktop } from "@/store/desktop";

const Terminal = dynamic(() => import("@/components/apps/Terminal").then((m) => m.Terminal), { ssr: false });
const Files = dynamic(() => import("@/components/apps/Files").then((m) => m.Files), { ssr: false });
const Projects = dynamic(() => import("@/components/apps/Projects").then((m) => m.Projects), { ssr: false });
const Pictures = dynamic(() => import("@/components/apps/Pictures").then((m) => m.Pictures), { ssr: false });
const About = dynamic(() => import("@/components/apps/About").then((m) => m.About), { ssr: false });
const Browser = dynamic(() => import("@/components/apps/Browser").then((m) => m.Browser), { ssr: false });
const Contact = dynamic(() => import("@/components/apps/Contact").then((m) => m.Contact), { ssr: false });
const Settings = dynamic(() => import("@/components/apps/Settings").then((m) => m.Settings), { ssr: false });
const Monitor = dynamic(() => import("@/components/apps/Monitor").then((m) => m.Monitor), { ssr: false });

function AppBody({ app, payload, winId }: { app: AppId; payload?: string; winId: string }) {
  switch (app) {
    case "terminal":
      return <Terminal winId={winId} />;
    case "files":
      return <Files />;
    case "projects":
      return <Projects payload={payload} />;
    case "pictures":
      return <Pictures />;
    case "about":
      return <About />;
    case "browser":
      return <Browser payload={payload} />;
    case "contact":
      return <Contact />;
    case "settings":
      return <Settings />;
    case "monitor":
      return <Monitor />;
  }
}

type DesktopShortcutId = "readme" | "projects" | "resume" | "contact";

export function Desktop() {
  const theme = useDesktop((s) => s.theme);
  const fontSize = useDesktop((s) => s.fontSize);
  const reduceMotion = useDesktop((s) => s.reduceMotion);
  const skipDesktop = useDesktop((s) => s.skipDesktop);
  const setSkipDesktop = useDesktop((s) => s.setSkipDesktop);
  const booted = useDesktop((s) => s.booted);
  const setBooted = useDesktop((s) => s.setBooted);
  const windows = useDesktop((s) => s.windows);
  const workspace = useDesktop((s) => s.workspace);
  const openApp = useDesktop((s) => s.openApp);
  const focusWin = useDesktop((s) => s.focusWin);
  const closeActive = useDesktop((s) => s.closeActive);
  const setWorkspace = useDesktop((s) => s.setWorkspace);
  const snapWin = useDesktop((s) => s.snapWin);
  const activeId = useDesktop((s) => s.activeId);
  const cycleWindows = useDesktop((s) => s.cycleWindows);
  const setContextMenu = useDesktop((s) => s.setContextMenu);
  const setPowerOpen = useDesktop((s) => s.setPowerOpen);
  const activitiesOpen = useDesktop((s) => s.activitiesOpen);
  const setActivitiesOpen = useDesktop((s) => s.setActivitiesOpen);
  const hydrated = useDesktop((s) => s.hydrated);
  const setHydrated = useDesktop((s) => s.setHydrated);
  const setReduceMotion = useDesktop((s) => s.setReduceMotion);
  const [mobile, setMobile] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<DesktopShortcutId | null>(null);

  useEffect(() => {
    try {
      useDesktop.persist.rehydrate();
    } catch {
      setHydrated(true);
    }
    const unsub = useDesktop.persist.onFinishHydration(() => setHydrated(true));
    window.setTimeout(() => setHydrated(true), 300);
    return unsub;
  }, [setHydrated]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const stored = localStorage.getItem("km-desktop");
      if (!stored) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setReduceMotion(true);
        }
      }
    } catch {
      /* ignore */
    }
  }, [hydrated, setReduceMotion]);

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem("km-booted", "1");
    } catch {
      /* ignore */
    }
    setBooted(true);
  }, [setBooted]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("km-booted") === "1") {
        setBooted(true);
      }
    } catch {
      /* ignore */
    }
  }, [setBooted]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setContextMenu(null);
        setPowerOpen(false);
        setActivitiesOpen(false);
        setSelectedIcon(null);
      }
      const superKey = e.metaKey || e.ctrlKey;
      if (superKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        openApp("terminal");
      }
      if (superKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        closeActive();
      }
      if (superKey && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        setWorkspace(Number(e.key));
      }
      if (superKey && (e.key === "ArrowLeft" || e.key === "ArrowRight") && activeId) {
        e.preventDefault();
        snapWin(activeId, e.key === "ArrowLeft" ? "left" : "right");
      }
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        cycleWindows();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, closeActive, cycleWindows, openApp, setActivitiesOpen, setContextMenu, setPowerOpen, setWorkspace, snapWin]);

  useEffect(() => {
    document.body.classList.toggle("desktop-on", !skipDesktop);
  }, [skipDesktop]);

  const visible = windows.filter((w) => w.workspace === workspace);
  const hasActiveMobileWindow =
    mobile && visible.some((w) => w.id === activeId && !w.minimized);

  return (
    <>
      <a
        href="#simple-site"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[90] bg-surface px-3 py-1 text-sm"
        onClick={() => setSkipDesktop(true)}
      >
        Skip the desktop, view simple site
      </a>
      {skipDesktop ? null : (
        <div
          className="fixed inset-0 z-20 flex flex-col"
          style={{ fontSize }}
          onContextMenu={(e) => {
            if ((e.target as HTMLElement).closest("[role='dialog']")) return;
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY });
          }}
          onClick={() => {
            setContextMenu(null);
            setSelectedIcon(null);
          }}
        >
          <Wallpaper mobile={mobile} />
          {!booted ? <Boot onDone={finishBoot} /> : null}
          <TopBar />
          <div className="relative z-10 min-h-0 flex-1">
            {mobile ? null : <Dock />}
            {mobile ? (
              !hasActiveMobileWindow ? (
                <div
                  aria-label="Home screen apps"
                  className="absolute inset-x-0 top-1/2 bottom-0 z-10 grid grid-cols-3 content-start gap-3 overflow-y-auto px-6 py-4"
                >
                  {DOCK_APPS.map(({ app, label, Icon }) => (
                    <button
                      key={app}
                      type="button"
                      className="flex flex-col items-center gap-1.5 rounded border border-border/60 bg-surface/75 p-3 text-xs text-fg backdrop-blur-[6px] active:border-accent"
                      onClick={() => openApp(app)}
                    >
                      <Icon className="size-6 text-accent" aria-hidden />
                      <span className="truncate">{label}</span>
                    </button>
                  ))}
                </div>
              ) : null
            ) : (
              <div
                className="desktop-icon-shadow absolute top-6 left-20 z-10 flex flex-col gap-3 text-xs text-fg"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="README.md"
                  className={`flex w-20 flex-col items-center gap-1 p-1.5 ${
                    selectedIcon === "readme"
                      ? "bg-surface/70 outline-2 outline-accent"
                      : "hover:bg-surface/40"
                  }`}
                  onClick={() => setSelectedIcon("readme")}
                  onDoubleClick={() => openApp("terminal")}
                >
                  <FileText className="size-8 text-accent" aria-hidden />
                  <span>README.md</span>
                </button>
                <button
                  type="button"
                  aria-label="projects/"
                  className={`flex w-20 flex-col items-center gap-1 p-1.5 ${
                    selectedIcon === "projects"
                      ? "bg-surface/70 outline-2 outline-accent"
                      : "hover:bg-surface/40"
                  }`}
                  onClick={() => setSelectedIcon("projects")}
                  onDoubleClick={() => openApp("files")}
                >
                  <Folder className="size-8 text-accent" aria-hidden />
                  <span>projects/</span>
                </button>
                <a
                  href="/resume.pdf"
                  aria-label="resume.pdf"
                  className={`relative flex w-20 flex-col items-center gap-1 p-1.5 ${
                    selectedIcon === "resume"
                      ? "bg-surface/70 outline-2 outline-accent"
                      : "hover:bg-surface/40"
                  }`}
                  onClick={() => setSelectedIcon("resume")}
                >
                  <span className="relative inline-flex">
                    <FileText className="size-8 text-accent-2" aria-hidden />
                    <span className="absolute -right-2 -bottom-0.5 border border-border bg-surface px-1 text-[9px] font-bold leading-tight text-accent-2">
                      PDF
                    </span>
                  </span>
                  <span>resume.pdf</span>
                </a>
                <button
                  type="button"
                  aria-label="contact.sh"
                  className={`flex w-20 flex-col items-center gap-1 p-1.5 ${
                    selectedIcon === "contact"
                      ? "bg-surface/70 outline-2 outline-accent"
                      : "hover:bg-surface/40"
                  }`}
                  onClick={() => setSelectedIcon("contact")}
                  onDoubleClick={() => openApp("contact")}
                >
                  <FileTerminal className="size-8 text-cyan" aria-hidden />
                  <span>contact.sh</span>
                </button>
              </div>
            )}
            {activitiesOpen ? (
              <div
                role="dialog"
                aria-label="Activities overview"
                className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-bg/85 p-6 backdrop-blur-[6px]"
                onClick={() => setActivitiesOpen(false)}
              >
                <div
                  className="w-full max-w-2xl space-y-6 border border-border bg-surface/95 p-6 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Applications — Workspace {workspace}
                    </h2>
                    <button
                      type="button"
                      className="border border-border px-2 py-0.5 text-xs hover:border-accent"
                      onClick={() => setActivitiesOpen(false)}
                    >
                      Esc
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {DOCK_APPS.map(({ app, label, Icon }) => {
                      const running = visible.some((w) => w.app === app && !w.minimized);
                      return (
                        <button
                          key={app}
                          type="button"
                          className="relative flex flex-col items-center gap-2 border border-border bg-bg/60 p-3 text-xs hover:border-accent"
                          onClick={() => openApp(app)}
                        >
                          <Icon className="size-6 text-accent" aria-hidden />
                          <span className="text-fg">{label}</span>
                          {running ? (
                            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                  {visible.length > 0 ? (
                    <div>
                      <h3 className="mb-2 text-xs uppercase tracking-wider text-muted">
                        Open Windows
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {visible.map((w) => {
                          const WinIcon = APP_ICONS[w.app];
                          return (
                            <button
                              key={w.id}
                              type="button"
                              className="inline-flex items-center gap-2 border border-border bg-bg/60 px-3 py-1.5 text-xs hover:border-accent"
                              onClick={() => focusWin(w.id)}
                            >
                              <WinIcon className="size-4 text-accent" aria-hidden />
                              <span>{w.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {visible.map((w) => (
              <Window key={w.id} win={w} mobile={mobile}>
                <AppBody app={w.app} payload={w.payload} winId={w.id} />
              </Window>
            ))}
          </div>
          {mobile ? <Dock mobile /> : null}
          <ContextMenu />
        </div>
      )}
    </>
  );
}
