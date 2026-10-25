"use client";

import { skills } from "@/data/skills";

export function Monitor() {
  const procs = skills.flatMap((g) => g.items.map((i) => ({ name: i.name, cpu: i.level })));
  const ram = Math.round(procs.reduce((a, p) => a + p.cpu, 0) / procs.length);

  return (
    <div className="space-y-4 overflow-auto p-4 text-xs">
      <p className="text-muted">fullstackos · processes mapped from skills</p>
      <div>
        <div className="mb-1 flex justify-between">
          <span>RAM</span>
          <span>{ram}%</span>
        </div>
        <div className="h-2 border border-border">
          <div className="h-full bg-accent-2" style={{ width: `${ram}%`, transform: "none" }} />
        </div>
      </div>
      {procs.map((p) => (
        <div key={p.name}>
          <div className="mb-1 flex justify-between">
            <span>{p.name}</span>
            <span>{p.cpu}%</span>
          </div>
          <div className="h-2 border border-border">
            <div className="h-full bg-accent" style={{ width: `${p.cpu}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
