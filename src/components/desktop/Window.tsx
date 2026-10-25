"use client";

import { Rnd } from "react-rnd";
import {
  Activity,
  Copy,
  Folder,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  Mail,
  Minus,
  Settings,
  Square,
  Terminal as TerminalIcon,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useDesktop, type AppId, type Win } from "@/store/desktop";

export const APP_ICONS: Record<AppId, LucideIcon> = {
  terminal: TerminalIcon,
  files: Folder,
  projects: FolderKanban,
  pictures: ImageIcon,
  about: UserRound,
  browser: Globe,
  contact: Mail,
  settings: Settings,
  monitor: Activity,
};

export function Window({
  win,
  mobile,
  children,
}: {
  win: Win;
  mobile: boolean;
  children: React.ReactNode;
}) {
  const activeId = useDesktop((s) => s.activeId);
  const tiling = useDesktop((s) => s.tiling);
  const focusWin = useDesktop((s) => s.focusWin);
  const closeWin = useDesktop((s) => s.closeWin);
  const minimizeWin = useDesktop((s) => s.minimizeWin);
  const maximizeWin = useDesktop((s) => s.maximizeWin);
  const moveWin = useDesktop((s) => s.moveWin);
  const resizeWin = useDesktop((s) => s.resizeWin);
  const snapWin = useDesktop((s) => s.snapWin);
  const active = activeId === win.id;
  const titleId = `${win.id}-title`;
  const AppIcon = APP_ICONS[win.app];

  const chrome = (
    <div
      className="flex h-9 shrink-0 items-center justify-between border-b border-border bg-surface/95 px-2 select-none"
      onDoubleClick={() => maximizeWin(win.id)}
    >
      <div
        className={`flex min-w-0 items-center gap-2 ${
          active ? "text-fg" : "text-muted opacity-65"
        }`}
      >
        <AppIcon className="size-4 shrink-0 text-accent" aria-hidden />
        <h2 id={titleId} className="truncate text-xs font-medium">
          {win.title}
        </h2>
      </div>
      <div
        className={`flex items-center gap-1 ${
          active ? "text-fg" : "text-muted opacity-65"
        }`}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Minimize"
          title="Minimize"
          className="flex size-7 items-center justify-center border border-border bg-surface/60 hover:bg-bg focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => minimizeWin(win.id)}
        >
          <Minus className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={win.maximized ? "Restore" : "Maximize"}
          title={win.maximized ? "Restore" : "Maximize"}
          className="flex size-7 items-center justify-center border border-border bg-surface/60 hover:bg-bg focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => maximizeWin(win.id)}
        >
          {win.maximized ? (
            <Copy className="size-4" aria-hidden />
          ) : (
            <Square className="size-4" aria-hidden />
          )}
        </button>
        <button
          type="button"
          aria-label="Close"
          title="Close"
          className="flex size-7 items-center justify-center border border-border bg-surface/60 hover:border-danger hover:bg-danger hover:text-bg focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => closeWin(win.id)}
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );

  if (mobile) {
    if (!active || win.minimized) return null;
    return (
      <section
        role="dialog"
        aria-labelledby={titleId}
        className="flex h-full flex-col border border-border bg-surface/90 backdrop-blur-[6px]"
        onPointerDown={() => focusWin(win.id)}
      >
        {chrome}
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </section>
    );
  }

  if (win.minimized) return null;

  const maxed = win.maximized;
  const disableDrag = tiling || maxed;

  return (
    <Rnd
      size={maxed ? { width: "calc(100vw - 72px)", height: "calc(100dvh - 44px)" } : { width: win.w, height: win.h }}
      position={maxed ? { x: 68, y: 40 } : { x: win.x, y: win.y }}
      disableDragging={disableDrag}
      enableResizing={!disableDrag}
      bounds="parent"
      dragHandleClassName="wm-drag"
      style={{ zIndex: win.z }}
      onDragStop={(_e, d) => {
        moveWin(win.id, d.x, d.y);
        if (d.x < 72) snapWin(win.id, "left");
        if (d.x + win.w > window.innerWidth - 16) snapWin(win.id, "right");
      }}
      onResizeStop={(_e, _dir, ref, _delta, pos) => {
        resizeWin(win.id, parseInt(ref.style.width, 10), parseInt(ref.style.height, 10), pos.x, pos.y);
      }}
      onMouseDown={() => focusWin(win.id)}
    >
      <section
        role="dialog"
        aria-labelledby={titleId}
        className={`flex h-full flex-col border border-border bg-surface/90 backdrop-blur-[6px] ${
          active ? "shadow-lg" : "opacity-90"
        }`}
      >
        <div className="wm-drag cursor-grab">{chrome}</div>
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </section>
    </Rnd>
  );
}
