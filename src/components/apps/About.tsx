"use client";

import { profile } from "@/data/profile";

export function About() {
  const lines = [
    `# ${profile.name}`,
    "",
    ...profile.about.flatMap((p, i) => (i === 0 ? [p] : ["", p])),
  ];
  return (
    <div className="flex h-full overflow-hidden bg-transparent font-prose text-sm">
      <ol className="w-10 shrink-0 border-r border-border bg-surface/75 py-3 text-right text-xs text-muted">
        {lines.map((_, i) => (
          <li key={i} className="h-6 pr-2 leading-6">
            {i + 1}
          </li>
        ))}
      </ol>
      <pre className="flex-1 overflow-auto p-3 font-prose leading-6 whitespace-pre-wrap">
        {lines.join("\n")}
      </pre>
    </div>
  );
}
