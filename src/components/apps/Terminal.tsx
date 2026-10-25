"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, FileText, Folder } from "lucide-react";
import { profile } from "@/data/profile";
import { complete, runCommand, type Line, type LineIcon } from "@/lib/commands";
import { HOME_PATH } from "@/lib/fs";
import { useDesktop } from "@/store/desktop";

type Row = { prompt?: string; lines: Line[] };

function LinePrefixIcon({ icon, isLink }: { icon?: LineIcon; isLink?: boolean }) {
  const kind = icon ?? (isLink ? "link" : undefined);
  if (kind === "folder") {
    return <Folder className="size-3.5 shrink-0 text-accent" aria-hidden />;
  }
  if (kind === "file") {
    return <FileText className="size-3.5 shrink-0 text-accent-2" aria-hidden />;
  }
  if (kind === "link") {
    return <ExternalLink className="size-3.5 shrink-0 text-cyan" aria-hidden />;
  }
  return null;
}

export function Terminal({ winId }: { winId?: string }) {
  const openApp = useDesktop((s) => s.openApp);
  const setTheme = useDesktop((s) => s.setTheme);
  const closeWin = useDesktop((s) => s.closeWin);
  const reduce = useDesktop((s) => s.reduceMotion);
  const [cwd, setCwd] = useState(HOME_PATH);
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const [value, setValue] = useState("");
  const [rows, setRows] = useState<Row[]>([
    { lines: [{ kind: "text", text: `Welcome. Type help — ${profile.tagline}` }] },
  ]);
  const [typed, setTyped] = useState("");
  const pending = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const prompt = useMemo(() => {
    const short = cwd.replace(HOME_PATH, "~");
    return `${profile.handle}@${profile.hostname}:${short}$`;
  }, [cwd]);

  useEffect(() => {
    if (reduce) {
      setTyped(pending.current);
      pending.current = "";
      return;
    }
    if (!pending.current) return;
    let i = 0;
    const full = pending.current;
    const id = window.setInterval(() => {
      i += 2;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(id);
        pending.current = "";
      }
    }, 8);
    return () => window.clearInterval(id);
  }, [rows, reduce]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [typed, rows]);

  function submit(raw: string) {
    const result = runCommand(raw, {
      cwd,
      history,
      setCwd,
      setTheme,
      openApp,
      close: () => {
        if (winId) closeWin(winId);
      },
    });
    if (raw.trim()) setHistory((h) => [...h, raw.trim()]);
    setHIndex(-1);
    setValue("");
    if (result.clear) {
      setRows([]);
      setTyped("");
      pending.current = "";
      return;
    }
    const next: Row = { prompt: `${prompt} ${raw}`, lines: result.lines };
    pending.current = result.lines.map((l) => l.text).join("\n");
    setTyped(reduce ? pending.current : "");
    setRows((r) => [...r, next]);
  }

  return (
    <div
      ref={scroller}
      className="h-full overflow-auto bg-transparent p-3 text-sm leading-6"
      onClick={() => inputRef.current?.focus()}
    >
      {rows.map((row, i) => {
        const last = i === rows.length - 1;
        return (
          <div key={`${i}-${row.prompt ?? "b"}`}>
            {row.prompt ? <div className="text-muted">{row.prompt}</div> : null}
            {row.lines.map((line, j) => {
              const shown = last ? typed.split("\n")[j] ?? "" : line.text;
              if (line.kind === "link") {
                return (
                  <div key={j} className="flex items-center gap-1.5">
                    <LinePrefixIcon icon={line.icon} isLink />
                    <a
                      className="text-accent underline hover:text-cyan"
                      href={line.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {shown || line.text}
                    </a>
                  </div>
                );
              }
              return (
                <div
                  key={j}
                  className={
                    line.icon
                      ? "flex items-center gap-1.5 whitespace-pre-wrap"
                      : "whitespace-pre-wrap"
                  }
                >
                  <LinePrefixIcon icon={line.icon} />
                  <span>{shown}</span>
                </div>
              );
            })}
          </div>
        );
      })}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <label className="shrink-0 text-accent-2" htmlFor={`term-${winId ?? "main"}`}>
          {prompt}
        </label>
        <input
          id={`term-${winId ?? "main"}`}
          ref={inputRef}
          className="min-w-0 flex-1 bg-transparent outline-none"
          value={value}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              setValue(complete(value, cwd));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              if (!history.length) return;
              const next = hIndex < 0 ? history.length - 1 : Math.max(0, hIndex - 1);
              setHIndex(next);
              setValue(history[next] ?? "");
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (hIndex < 0) return;
              const next = hIndex + 1;
              if (next >= history.length) {
                setHIndex(-1);
                setValue("");
              } else {
                setHIndex(next);
                setValue(history[next] ?? "");
              }
            }
          }}
        />
      </form>
    </div>
  );
}
