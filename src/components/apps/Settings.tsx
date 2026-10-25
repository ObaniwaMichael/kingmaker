"use client";

import { THEME_LABELS, THEMES, WALLPAPER_LABELS, WALLPAPERS, type WallpaperName } from "@/lib/themes";
import { useDesktop } from "@/store/desktop";

export function Settings() {
  const theme = useDesktop((s) => s.theme);
  const setTheme = useDesktop((s) => s.setTheme);
  const wallpaper = useDesktop((s) => s.wallpaper);
  const setWallpaper = useDesktop((s) => s.setWallpaper);
  const fontSize = useDesktop((s) => s.fontSize);
  const setFontSize = useDesktop((s) => s.setFontSize);
  const reduceMotion = useDesktop((s) => s.reduceMotion);
  const setReduceMotion = useDesktop((s) => s.setReduceMotion);

  function chooseWallpaper(w: WallpaperName) {
    try {
      localStorage.setItem("km-wallpaper", w);
    } catch {
      /* ignore */
    }
    setWallpaper(w);
  }

  return (
    <div className="space-y-5 overflow-auto p-4 text-sm">
      <section>
        <h3 className="mb-2 text-xs uppercase text-muted">Theme</h3>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={theme === t}
              className={`border px-2 py-1 ${
                theme === t ? "border-accent text-accent" : "border-border"
              }`}
              onClick={() => setTheme(t)}
            >
              {THEME_LABELS[t]}
            </button>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-xs uppercase text-muted">Wallpaper</h3>
        <div className="grid grid-cols-3 gap-2">
          {WALLPAPERS.map((w) => (
            <button
              key={w}
              type="button"
              aria-pressed={wallpaper === w}
              className={`flex flex-col items-start gap-1.5 border p-2 text-left text-xs ${
                wallpaper === w ? "border-accent text-accent" : "border-border"
              }`}
              onClick={() => chooseWallpaper(w)}
            >
              <div
                aria-hidden="true"
                className={`relative flex h-12 w-full flex-col items-center justify-center overflow-hidden border border-border ${
                  w === "programmer" ? "bg-bg" : `wallpaper-${w}`
                }`}
              >
                {w === "programmer" ? (
                  <>
                    <span className="text-[7px] tracking-widest text-fg">I am a</span>
                    <span className="programmer-gradient-text text-[9px] font-light tracking-widest">
                      PROGRAMMER
                    </span>
                  </>
                ) : null}
              </div>
              <span>{WALLPAPER_LABELS[w]}</span>
            </button>
          ))}
        </div>
      </section>
      <label className="block">
        <span className="text-xs uppercase text-muted">Font size ({fontSize}px)</span>
        <input
          type="range"
          min={12}
          max={18}
          value={fontSize}
          className="mt-2 w-full"
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} />
        Reduce motion
      </label>
    </div>
  );
}
