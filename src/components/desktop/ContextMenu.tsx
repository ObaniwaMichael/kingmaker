"use client";

import { useDesktop } from "@/store/desktop";

export function ContextMenu() {
  const pos = useDesktop((s) => s.contextMenu);
  const setContextMenu = useDesktop((s) => s.setContextMenu);
  const cycleTheme = useDesktop((s) => s.cycleTheme);
  const openApp = useDesktop((s) => s.openApp);
  const toggleTiling = useDesktop((s) => s.toggleTiling);
  const tiling = useDesktop((s) => s.tiling);

  if (!pos) return null;

  return (
    <div
      role="menu"
      className="fixed z-[70] min-w-48 border border-border bg-surface py-1 text-sm shadow-lg"
      style={{ left: pos.x, top: pos.y }}
    >
      <button
        type="button"
        role="menuitem"
        className="block w-full px-3 py-1.5 text-left hover:bg-bg"
        onClick={() => {
          cycleTheme();
          setContextMenu(null);
        }}
      >
        Change theme
      </button>
      <button
        type="button"
        role="menuitem"
        className="block w-full px-3 py-1.5 text-left hover:bg-bg"
        onClick={() => {
          openApp("terminal");
          setContextMenu(null);
        }}
      >
        Open terminal
      </button>
      <button
        type="button"
        role="menuitem"
        className="block w-full px-3 py-1.5 text-left hover:bg-bg"
        onClick={() => {
          toggleTiling();
          setContextMenu(null);
        }}
      >
        {tiling ? "Disable tiling" : "Toggle tiling mode"}
      </button>
    </div>
  );
}
