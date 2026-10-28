"use client";

import { FormEvent, useState } from "react";
import { contact } from "@/data/contact";

function mailtoHref(name: string, message: string) {
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(message);
  return `mailto:${contact.email}?subject=${subject}&body=${body}`;
}

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [fallbackHref, setFallbackHref] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "").trim();
    setStatus("sending");
    setFallbackHref(null);

    if (website) {
      setStatus("ok");
      form.reset();
      return;
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setFallbackHref(mailtoHref(name, message));
      setStatus("err");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          message,
          subject: `Portfolio message from ${name}`,
          from_name: "Portfolio",
          replyto: email,
          botcheck: false,
        }),
      });
      const raw = await res.text();
      let json: { success?: boolean };
      try {
        json = JSON.parse(raw) as { success?: boolean };
      } catch {
        setFallbackHref(mailtoHref(name, message));
        setStatus("err");
        return;
      }
      if (json.success === true) {
        setStatus("ok");
        form.reset();
        return;
      }
      setFallbackHref(mailtoHref(name, message));
      setStatus("err");
    } catch {
      setFallbackHref(mailtoHref(name, message));
      setStatus("err");
    }
  }

  return (
    <form className="flex h-full flex-col gap-3 bg-transparent p-4 font-mono text-sm" onSubmit={onSubmit}>
      <p className="text-accent-2">raidreaper@portfolio:~/contact$</p>
      <label className="flex flex-col gap-1">
        name
        <input
          name="name"
          required
          minLength={2}
          maxLength={100}
          className="border border-border bg-surface/85 px-2 py-1"
        />
      </label>
      <label className="flex flex-col gap-1">
        email
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          className="border border-border bg-surface/85 px-2 py-1"
        />
      </label>
      <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="flex flex-col gap-1">
        message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          className="border border-border bg-surface/85 px-2 py-1"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start border border-accent px-3 py-1 text-accent disabled:opacity-50"
      >
        {status === "sending" ? "sending…" : "./send.sh"}
      </button>
      {status === "ok" ? <p className="text-accent">Message sent.</p> : null}
      {status === "err" && fallbackHref ? (
        <p className="text-danger">
          Message failed to send. Email me directly:{" "}
          <a className="text-accent underline" href={fallbackHref}>
            {contact.email}
          </a>
        </p>
      ) : null}
    </form>
  );
}
