"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { useDesktop } from "@/store/desktop";

const LINES = [
  "Starting version 255.4-fullstackos",
  "Reached target Graphical Interface.",
  "[  OK  ] Started Network Manager.",
  "[  OK  ] Started User Login Management.",
  `[  OK  ] Started Session for ${profile.handle}.`,
  `login: ${profile.handle}`,
];

const GREETING = "Hello, World!";

export function Boot({ onDone }: { onDone: () => void }) {
  const reduce = useDesktop((s) => s.reduceMotion);
  const [n, setN] = useState(LINES.length);
  const [typedLen, setTypedLen] = useState(GREETING.length);

  useEffect(() => {
    setN(reduce ? LINES.length : 1);
    setTypedLen(reduce ? GREETING.length : 0);
  }, [reduce]);

  useEffect(() => {
    if (n < LINES.length) {
      const t = window.setTimeout(() => setN((v) => v + 1), 220);
      return () => window.clearTimeout(t);
    }
    if (typedLen < GREETING.length) {
      const t = window.setTimeout(() => setTypedLen((v) => v + 1), 35);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(onDone, reduce ? 0 : 380);
    return () => window.clearTimeout(t);
  }, [n, typedLen, onDone, reduce]);

  return (
    <button
      type="button"
      className="fixed inset-0 z-[80] flex flex-col justify-end bg-bg p-6 text-left font-mono text-sm text-fg"
      onClick={onDone}
      aria-label="Boot log, click to skip"
    >
      {LINES.slice(0, n).map((line) => (
        <div key={line} className="leading-6">
          {line}
        </div>
      ))}
      {n >= LINES.length ? (
        <div className="leading-6 text-accent">
          {GREETING.slice(0, typedLen)}
        </div>
      ) : null}
    </button>
  );
}
