"use client";

import { FormEvent, useState } from "react";
import { contact } from "@/data/contact";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  const [mailto, setMailto] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    setStatus("sending");
    setMailto(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; mailto?: boolean; href?: string };
      if (json.ok) {
        setStatus("ok");
        setMsg("Message sent.");
        form.reset();
        return;
      }
      if (json.mailto && json.href) {
        setMailto(json.href);
        setStatus("err");
        setMsg("Mail service not configured. Use mailto instead.");
        return;
      }
      setStatus("err");
      setMsg(json.error ?? "Failed");
    } catch {
      setStatus("err");
      setMsg("Network error");
    }
  }

  return (
    <form className="flex h-full flex-col gap-3 bg-transparent p-4 text-sm" onSubmit={onSubmit}>
      <p className="text-accent-2">raidreaper@portfolio:~/contact$</p>
      <label className="flex flex-col gap-1">
        name
        <input name="name" required minLength={2} className="border border-border bg-surface/85 px-2 py-1" />
      </label>
      <label className="flex flex-col gap-1">
        email
        <input name="email" type="email" required className="border border-border bg-surface/85 px-2 py-1" />
      </label>
      <label className="flex flex-col gap-1">
        message
        <textarea name="message" required minLength={10} rows={5} className="border border-border bg-surface/85 px-2 py-1" />
      </label>
      <button type="submit" disabled={status === "sending"} className="self-start border border-accent px-3 py-1 text-accent">
        {status === "sending" ? "./send.sh…" : "./send.sh"}
      </button>
      {msg ? <p className={status === "ok" ? "text-accent" : "text-danger"}>{msg}</p> : null}
      {mailto ? (
        <a className="text-accent underline" href={mailto}>
          Open mail client
        </a>
      ) : (
        <a className="text-muted underline" href={`mailto:${contact.email}`}>
          or mailto:{contact.email}
        </a>
      )}
    </form>
  );
}
