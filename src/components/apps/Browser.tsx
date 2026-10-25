"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

export function Browser({ payload }: { payload?: string }) {
  const initial = payload ?? "https://upco.live";
  const [url, setUrl] = useState(initial);
  const [src, setSrc] = useState(initial);
  const [iframeBlocked, setIframeBlocked] = useState(false);

  useEffect(() => {
    if (payload) {
      setUrl(payload);
      setSrc(payload);
      setIframeBlocked(false);
    }
  }, [payload]);

  function openExternal(targetUrl: string) {
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex h-full flex-col">
      <form
        className="flex items-center gap-2 border-b border-border p-2 text-xs"
        onSubmit={(e) => {
          e.preventDefault();
          setIframeBlocked(false);
          setSrc(url);
        }}
      >
        <input
          className="min-w-0 flex-1 border border-border bg-surface/85 px-2 py-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="URL"
        />
        <button type="submit" className="border border-border px-2 py-1 hover:border-accent">
          Go
        </button>
        <a
          className="inline-flex items-center gap-1 border border-accent px-2 py-1 text-accent"
          href={src}
          target="_blank"
          rel="noreferrer"
        >
          <span>Open in new tab</span>
          <ExternalLink className="size-3" aria-hidden />
        </a>
      </form>
      {iframeBlocked ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-sm">
          <p className="text-muted">
            This site prevents embedding in an iframe. Opening in a new tab instead.
          </p>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-accent px-3 py-1.5 text-accent"
          >
            <span>Open {src}</span>
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      ) : (
        <iframe
          key={src}
          title="Embedded site"
          src={src}
          className="min-h-0 flex-1 bg-surface"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          onError={() => {
            setIframeBlocked(true);
            openExternal(src);
          }}
        />
      )}
      <div className="flex items-center justify-between border-t border-border bg-surface/80 px-3 py-1.5 text-xs text-muted">
        <span className="truncate">Blank or refused to connect?</span>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 text-accent underline"
          onClick={() => openExternal(src)}
        >
          <span>Fallback: open in new tab</span>
          <ExternalLink className="size-3" aria-hidden />
        </button>
      </div>
    </div>
  );
}
