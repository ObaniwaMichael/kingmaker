"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { ThemeName, WallpaperName } from "@/lib/themes";
import { THEMES, WALLPAPERS } from "@/lib/themes";

export type AppId =
  | "terminal"
  | "files"
  | "projects"
  | "pictures"
  | "about"
  | "browser"
  | "contact"
  | "settings"
  | "monitor";

export type Win = {
  id: string;
  app: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  workspace: number;
  payload?: string;
};

type DesktopState = {
  windows: Win[];
  activeId: string | null;
  workspace: number;
  tiling: boolean;
  theme: ThemeName;
  wallpaper: WallpaperName;
  fontSize: number;
  reduceMotion: boolean;
  skipDesktop: boolean;
  booted: boolean;
  zTop: number;
  contextMenu: { x: number; y: number } | null;
  powerOpen: boolean;
  activitiesOpen: boolean;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setBooted: (v: boolean) => void;
  setSkipDesktop: (v: boolean) => void;
  setTheme: (t: ThemeName) => void;
  cycleTheme: () => void;
  setWallpaper: (w: WallpaperName) => void;
  setFontSize: (n: number) => void;
  setReduceMotion: (v: boolean) => void;
  setWorkspace: (n: number) => void;
  toggleTiling: () => void;
  setContextMenu: (pos: { x: number; y: number } | null) => void;
  setPowerOpen: (v: boolean) => void;
  setActivitiesOpen: (v: boolean) => void;
  openApp: (app: AppId, payload?: string, title?: string) => void;
  closeWin: (id: string) => void;
  closeActive: () => void;
  focusWin: (id: string) => void;
  minimizeWin: (id: string) => void;
  maximizeWin: (id: string) => void;
  moveWin: (id: string, x: number, y: number) => void;
  resizeWin: (id: string, w: number, h: number, x: number, y: number) => void;
  snapWin: (id: string, edge: "left" | "right") => void;
  cycleWindows: () => void;
  applyTiling: () => void;
};

const TITLES: Record<AppId, string> = {
  terminal: "Terminal",
  files: "Files",
  projects: "Projects",
  pictures: "Pictures",
  about: "about.md",
  browser: "Browser",
  contact: "Contact",
  settings: "Settings",
  monitor: "System Monitor",
};

const DEFAULTS: Record<AppId, { w: number; h: number }> = {
  terminal: { w: 720, h: 460 },
  files: { w: 680, h: 440 },
  projects: { w: 760, h: 520 },
  pictures: { w: 680, h: 460 },
  about: { w: 640, h: 480 },
  browser: { w: 800, h: 520 },
  contact: { w: 520, h: 420 },
  settings: { w: 480, h: 460 },
  monitor: { w: 520, h: 400 },
};

const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      /* ignore */
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

function cascade(count: number) {
  const n = count % 8;
  return { x: 88 + n * 28, y: 52 + n * 24 };
}

function layoutTiled(windows: Win[], workspace: number): Win[] {
  const vis = windows.filter((w) => w.workspace === workspace && !w.minimized);
  if (vis.length === 0) return windows;
  const top = 36;
  const left = 64;
  const width = Math.max(320, window.innerWidth - left);
  const height = Math.max(200, window.innerHeight - top);
  if (vis.length === 1) {
    const id = vis[0].id;
    return windows.map((w) =>
      w.id === id
        ? { ...w, x: left, y: top, w: width, h: height, maximized: false }
        : w,
    );
  }
  const masterW = Math.floor(width * 0.58);
  const stackW = width - masterW;
  const stackH = Math.floor(height / (vis.length - 1));
  return windows.map((w) => {
    const i = vis.findIndex((v) => v.id === w.id);
    if (i < 0) return w;
    if (i === 0) {
      return { ...w, x: left, y: top, w: masterW, h: height, maximized: false };
    }
    return {
      ...w,
      x: left + masterW,
      y: top + (i - 1) * stackH,
      w: stackW,
      h: stackH,
      maximized: false,
    };
  });
}

export const useDesktop = create<DesktopState>()(
  persist(
    (set, get) => ({
      windows: [],
      activeId: null,
      workspace: 1,
      tiling: false,
      theme: "midnight-code",
      wallpaper: "programmer",
      fontSize: 14,
      reduceMotion: false,
      skipDesktop: false,
      booted: false,
      zTop: 2,
      contextMenu: null,
      powerOpen: false,
      activitiesOpen: false,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setBooted: (v) => set({ booted: v }),
      setSkipDesktop: (v) => set({ skipDesktop: v }),
      setTheme: (t) => set({ theme: t }),
      cycleTheme: () => {
        const i = THEMES.indexOf(get().theme);
        set({ theme: THEMES[(i + 1) % THEMES.length] });
      },
      setWallpaper: (w) => {
        try {
          localStorage.setItem("km-wallpaper", w);
        } catch {
          /* ignore */
        }
        set({ wallpaper: w });
      },
      setFontSize: (n) => set({ fontSize: n }),
      setReduceMotion: (v) => set({ reduceMotion: v }),
      setWorkspace: (n) => set({ workspace: Math.min(4, Math.max(1, n)) }),
      toggleTiling: () => {
        const tiling = !get().tiling;
        set({ tiling });
        if (tiling) get().applyTiling();
      },
      setContextMenu: (pos) => set({ contextMenu: pos, powerOpen: false }),
      setPowerOpen: (v) => set({ powerOpen: v, contextMenu: v ? null : get().contextMenu }),
      setActivitiesOpen: (v) => set({ activitiesOpen: v, contextMenu: null, powerOpen: false }),
      openApp: (app, payload, title) => {
        const existing = get().windows.find(
          (w) => w.app === app && w.workspace === get().workspace,
        );
        if (existing) {
          const z = get().zTop + 1;
          set({
            zTop: z,
            activeId: existing.id,
            activitiesOpen: false,
            windows: get().windows.map((w) =>
              w.id === existing.id
                ? {
                    ...w,
                    minimized: false,
                    z,
                    payload: payload ?? w.payload,
                    title: title ?? (payload && app === "browser" ? payload : w.title),
                  }
                : w,
            ),
          });
          if (get().tiling) get().applyTiling();
          return;
        }
        const z = get().zTop + 1;
        const size = DEFAULTS[app];
        const pos = cascade(get().windows.length);
        const id = `${app}-${Date.now()}`;
        const win: Win = {
          id,
          app,
          title: title ?? (payload && app === "browser" ? payload : TITLES[app]),
          x: pos.x,
          y: pos.y,
          w: size.w,
          h: size.h,
          z,
          minimized: false,
          maximized: false,
          workspace: get().workspace,
          payload,
        };
        set({
          windows: [...get().windows, win],
          activeId: id,
          zTop: z,
          activitiesOpen: false,
        });
        if (get().tiling) get().applyTiling();
      },
      closeWin: (id) => {
        const rest = get().windows.filter((w) => w.id !== id);
        const next = [...rest].sort((a, b) => b.z - a.z)[0];
        set({ windows: rest, activeId: next?.id ?? null });
        if (get().tiling) get().applyTiling();
      },
      closeActive: () => {
        const id = get().activeId;
        if (id) get().closeWin(id);
      },
      focusWin: (id) => {
        const z = get().zTop + 1;
        set({
          activeId: id,
          zTop: z,
          activitiesOpen: false,
          windows: get().windows.map((w) =>
            w.id === id ? { ...w, z, minimized: false } : w,
          ),
        });
      },
      minimizeWin: (id) => {
        const rest = get().windows.filter((w) => w.id !== id || w.minimized);
        set({
          windows: get().windows.map((w) =>
            w.id === id ? { ...w, minimized: true } : w,
          ),
          activeId: get().activeId === id ? rest.sort((a, b) => b.z - a.z)[0]?.id ?? null : get().activeId,
        });
        if (get().tiling) get().applyTiling();
      },
      maximizeWin: (id) => {
        set({
          windows: get().windows.map((w) =>
            w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w,
          ),
        });
      },
      moveWin: (id, x, y) => {
        set({
          windows: get().windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
        });
      },
      resizeWin: (id, w, h, x, y) => {
        set({
          windows: get().windows.map((win) =>
            win.id === id ? { ...win, w, h, x, y } : win,
          ),
        });
      },
      snapWin: (id, edge) => {
        const top = 36;
        const left = 64;
        const width = Math.max(320, window.innerWidth - left);
        const height = Math.max(200, window.innerHeight - top);
        const half = Math.floor(width / 2);
        set({
          windows: get().windows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  maximized: false,
                  minimized: false,
                  x: edge === "left" ? left : left + half,
                  y: top,
                  w: half,
                  h: height,
                }
              : w,
          ),
        });
      },
      cycleWindows: () => {
        const vis = get()
          .windows.filter((w) => w.workspace === get().workspace && !w.minimized)
          .sort((a, b) => a.z - b.z);
        if (vis.length === 0) return;
        const idx = vis.findIndex((w) => w.id === get().activeId);
        const next = vis[(idx + 1) % vis.length];
        get().focusWin(next.id);
      },
      applyTiling: () => {
        if (typeof window === "undefined") return;
        set({ windows: layoutTiled(get().windows, get().workspace) });
      },
    }),
    {
      name: "km-desktop",
      version: 3,
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      migrate: (persistedState, version) => {
        const state = (persistedState as Partial<DesktopState>) ?? {};
        if (version < 3) {
          return {
            ...state,
            theme: "midnight-code",
            wallpaper: "programmer",
          };
        }
        return {
          ...state,
          theme: THEMES.includes(state.theme as ThemeName)
            ? (state.theme as ThemeName)
            : "midnight-code",
          wallpaper: WALLPAPERS.includes(state.wallpaper as WallpaperName)
            ? (state.wallpaper as WallpaperName)
            : "programmer",
        };
      },
      partialize: (s) => ({
        theme: s.theme,
        workspace: s.workspace,
        tiling: s.tiling,
        wallpaper: s.wallpaper,
        fontSize: s.fontSize,
        reduceMotion: s.reduceMotion,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
