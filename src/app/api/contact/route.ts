import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contact } from "@/data/contact";

function validEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const data = body as { name?: string; email?: string; message?: string };
  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const message = (data.message ?? "").trim();
  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Name is too short" }, { status: 400 });
  }
  if (!validEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ ok: false, error: "Message is too short" }, { status: 400 });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({
      ok: false,
      mailto: true,
      href: `mailto:${contact.email}?subject=${encodeURIComponent("Portfolio contact from " + name)}&body=${encodeURIComponent(message + "\n\n" + email)}`,
    });
  }
  try {
    const resend = new Resend(key);
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: contact.email,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `${message}\n\nFrom: ${name} <${email}>`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 500 });
  }
}
