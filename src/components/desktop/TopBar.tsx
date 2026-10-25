"use client";

import { useEffect, useState } from "react";
import { Battery, LayoutGrid, Moon, Power, Sun, Volume2, Wifi } from "lucide-react";
import { useDesktop } from "@/store/desktop";

export function TopBar() {
  const workspace = useDesktop((s) => s.workspace);
  const setWorkspace = useDesktop((s) => s.setWorkspace);
  const theme = useDesktop((s) => s.theme);
  const cycleTheme = useDesktop((s) => s.cycleTheme);
  const powerOpen = useDesktop((s) => s.powerOpen);
  const setPowerOpen = useDesktop((s) => s.setPowerOpen);
  const activitiesOpen = useDesktop((s) => s.activitiesOpen);
  const setActivitiesOpen = useDesktop((s) => s.setActivitiesOpen);
  const setBooted = useDesktop((s) => s.setBooted);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header
      role="banner"
      className="pointer-events-auto relative z-[40] flex h-9 items-center justify-between border-b border-border bg-surface/90 px-2 text-xs backdrop-blur-[6px]"
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          title="Activities overview"
          aria-label="Activities overview"
          aria-pressed={activitiesOpen}
          className={`inline-flex items-center gap-1.5 px-2 py-1 hover:bg-bg ${
            activitiesOpen ? "bg-accent text-bg" : "text-fg"
          }`}
          onClick={() => setActivitiesOpen(!activitiesOpen)}
        >
          <LayoutGrid className="size-3.5" aria-hidden />
          <span>Activities</span>
        </button>
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            title={`Workspace ${n}`}
            aria-label={`Workspace ${n}`}
            aria-pressed={workspace === n}
            className={`h-6 min-w-6 px-1 ${
              workspace === n ? "bg-accent text-bg" : "text-muted hover:text-fg"
            }`}
            onClick={() => setWorkspace(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <time className="absolute left-1/2 -translate-x-1/2 tabular-nums" dateTime={clock}>
        {clock}
      </time>
      <div className="flex items-center gap-2.5">
        <span role="img" aria-label="Wi-Fi connected" title="Wi-Fi connected">
          <Wifi className="size-3.5" aria-hidden />
        </span>
        <span role="img" aria-label="Volume" title="Volume">
          <Volume2 className="size-3.5" aria-hidden />
        </span>
        <span role="img" aria-label="Battery" title="Battery">
          <Battery className="size-3.5" aria-hidden />
        </span>
        <button
          type="button"
          title="Toggle theme"
          aria-label="Toggle theme"
          className="p-1 hover:bg-bg"
          onClick={cycleTheme}
        >
          {theme === "light" ? (
            <Moon className="size-3.5" aria-hidden />
          ) : (
            <Sun className="size-3.5" aria-hidden />
          )}
        </button>
        <div className="relative">
          <button
            type="button"
            title="Power menu"
            aria-haspopup="menu"
            aria-expanded={powerOpen}
            aria-label="Power menu"
            className="p-1 hover:bg-bg"
            onClick={() => setPowerOpen(!powerOpen)}
          >
            <Power className="size-3.5" aria-hidden />
          </button>
          {powerOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-7 z-50 min-w-40 border border-border bg-surface p-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                className="block w-full px-2 py-1 text-left hover:bg-bg"
                onClick={() => {
                  try {
                    sessionStorage.removeItem("km-booted");
                  } catch {
                    /* ignore */
                  }
                  setPowerOpen(false);
                  setBooted(false);
                }}
              >
                Log out
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-2 py-1 text-left hover:bg-bg"
                onClick={() => window.location.reload()}
              >
                Restart
              </button>
              <p className="px-2 py-1 text-muted">It is now safe to close this tab.</p>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
