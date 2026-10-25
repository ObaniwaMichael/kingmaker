"use client";

import { profile } from "@/data/profile";
import { useDesktop } from "@/store/desktop";

const WORD_COLOR_CLASSES = [
  "text-accent-2",
  "text-accent",
  "text-indigo",
  "text-cyan",
] as const;

export function Wallpaper({ mobile }: { mobile?: boolean }) {
  const wallpaper = useDesktop((s) => s.wallpaper);
  const windows = useDesktop((s) => s.windows);
  const workspace = useDesktop((s) => s.workspace);
  const reduceMotion = useDesktop((s) => s.reduceMotion);

  const hasOpenWindows = windows.some(
    (w) => w.workspace === workspace && !w.minimized,
  );
  const fadeClass = hasOpenWindows ? "opacity-45" : "opacity-100";
  const motionClass = reduceMotion
    ? ""
    : "wallpaper-fade-in transition-opacity duration-300";

  if (wallpaper !== "programmer") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-0 overflow-hidden wallpaper-${wallpaper}`}
      >
        <div className={`h-full w-full ${motionClass} ${fadeClass}`} />
      </div>
    );
  }

  const w = profile.wallpaper;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg font-mono select-none"
    >
      <div className="programmer-dot-grid absolute inset-0" />
      <div
        className={`relative flex w-full flex-col items-center justify-center px-4 text-center ${
          mobile ? "h-1/2 pt-8" : "h-full"
        } ${motionClass} ${fadeClass}`}
      >
        <p className="text-[clamp(1.1rem,2.3vw,2.1rem)] font-light tracking-[0.22em] text-fg">
          {w.intro}
        </p>
        <p className="programmer-gradient-text mt-1 text-[clamp(1.9rem,6.8vw,5.6rem)] font-light tracking-[0.14em] leading-none">
          {w.headline}
        </p>
        <div className="mt-[clamp(0.9rem,2.4vw,2rem)] space-y-1 text-[clamp(0.78rem,1.4vw,1.18rem)] leading-relaxed tracking-wide">
          <p>
            <span className="text-accent-2">{w.commentSlash}</span>
            <span className="text-muted">{w.commentLead}</span>
            <span className="text-accent-2">{w.commentHighlight1}</span>
            <span className="text-muted">{w.commentComma}</span>
          </p>
          <p>
            <span className="text-muted">{w.commentBuild}</span>
            <span className="text-accent">{w.commentHighlight2}</span>
            <span className="text-muted">{w.commentDot}</span>
          </p>
        </div>
        <p className="mt-[clamp(0.85rem,2.2vw,1.8rem)] text-[clamp(0.76rem,1.3vw,1.08rem)] tracking-wider">
          <span className="text-muted">&lt;/</span>
          <span className="text-accent-2">{w.tagName}</span>
          <span className="text-muted">&gt;</span>
        </p>
        <p className="mt-[clamp(0.75rem,1.9vw,1.5rem)] text-[clamp(0.7rem,1.15vw,0.98rem)] tracking-wider">
          <span className="text-muted">{"{ "}</span>
          {w.words.map((word, idx) => (
            <span key={word}>
              <span className={WORD_COLOR_CLASSES[idx % WORD_COLOR_CLASSES.length]}>
                {word}
              </span>
              {idx < w.words.length - 1 ? (
                <span className="text-muted">{" • "}</span>
              ) : null}
            </span>
          ))}
          <span className="text-muted">{" }"}</span>
        </p>
      </div>
    </div>
  );
}
