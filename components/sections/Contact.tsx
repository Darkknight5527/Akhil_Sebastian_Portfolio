"use client";
import { useState } from "react";
import { Button } from "@/components/ui/moving-border";
import { LINKS } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

const field =
  "w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-g";

export function Contact() {
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const subject = String(f.get("subject") ?? "").trim() || "Hello";
    const msg = String(f.get("message") ?? "").trim();
    if (!name || !email || !msg) return setError("Please fill in your name, email and message.");
    setError("");
    window.location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent(`${subject} — from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`)}`;
  };

  const cards = [
    { label: "Email", value: LINKS.email, href: `mailto:${LINKS.email}`, icon: "✉" },
    { label: "LinkedIn", value: LINKS.linkedinLabel, href: LINKS.linkedin, icon: "in" },
    { label: "GitHub", value: LINKS.githubLabel, href: LINKS.github, icon: "⌥" },
    { label: "Phone", value: LINKS.phoneLabel, href: `tel:${LINKS.phone}`, icon: "☏" },
  ];

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-28">
      <SectionHeading index="05" title="Let's build it." kicker="Whether it's a job opportunity, a collaboration, or a conversation about robotics and test engineering — my inbox is always open." />
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-bg2 p-6" noValidate>
          <h3 className="font-bebas text-2xl text-white">Send me a message</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="sr-only">Name</span><input name="name" placeholder="Name" className={field} autoComplete="name" /></label>
            <label className="block"><span className="sr-only">Email</span><input name="email" type="email" placeholder="Email" className={field} autoComplete="email" /></label>
          </div>
          <label className="block"><span className="sr-only">Subject</span><input name="subject" placeholder="Subject" className={field} /></label>
          <label className="block"><span className="sr-only">Message</span><textarea name="message" rows={5} placeholder="Message" className={field} /></label>
          {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
          <Button type="submit" borderRadius="0.75rem" duration={3000} containerClassName="h-12 w-full" className="font-mono text-xs font-bold tracking-widest text-g uppercase">
            Send Message →
          </Button>
          <p className="text-center text-[11px] text-muted">Opens your email app with the message filled in.</p>
        </form>

        <div className="space-y-3">
          {cards.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-white/6 bg-bg2 p-4 transition hover:border-g/40 hover:bg-g/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-g/10 font-mono text-sm font-bold text-g">{c.icon}</span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-widest text-muted uppercase">{c.label}</span>
                <span className="block truncate text-sm text-white">{c.value}</span>
              </span>
              <span className="ml-auto text-g">↗</span>
            </a>
          ))}
        </div>
      </div>
      <footer className="mt-24 border-t border-line pt-8 text-center font-mono text-[11px] tracking-wider text-muted">
        Built with embedded passion · Akhil Sebastian · 2026
      </footer>
    </section>
  );
}
