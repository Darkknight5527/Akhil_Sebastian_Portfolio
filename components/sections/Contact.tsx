"use client";
import { useState } from "react";
import { IconArrowUpRight, IconBrandGithub, IconBrandLinkedin, IconMail, IconPhone } from "@tabler/icons-react";
import { Button } from "@/components/ui/moving-border";
import { LINKS } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

const field =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[16px] text-white placeholder:text-white/35 outline-none transition focus:border-g";

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
    { label: "Email", value: LINKS.email, href: `mailto:${LINKS.email}`, icon: IconMail },
    { label: "LinkedIn", value: LINKS.linkedinLabel, href: LINKS.linkedin, icon: IconBrandLinkedin },
    { label: "GitHub", value: LINKS.githubLabel, href: LINKS.github, icon: IconBrandGithub },
    { label: "Phone", value: LINKS.phoneLabel, href: `tel:${LINKS.phone}`, icon: IconPhone },
  ];

  return (
    <section id="contact" className="mx-auto max-w-[1320px] px-5 py-28 sm:px-10">
      <SectionHeading
        kicker="Contact"
        title="Let's build something."
        sub="Whether it's a job opportunity, a collaboration, or a conversation about robotics and test engineering, my inbox is always open."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-[26px] border border-white/10 bg-bg2 p-6 sm:p-7" noValidate>
          <h3 className="text-[22px] font-semibold tracking-tight">Send me a message</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="sr-only">Name</span><input name="name" placeholder="Name" className={field} autoComplete="name" /></label>
            <label className="block"><span className="sr-only">Email</span><input name="email" type="email" placeholder="Email" className={field} autoComplete="email" /></label>
          </div>
          <label className="block"><span className="sr-only">Subject</span><input name="subject" placeholder="Subject" className={field} /></label>
          <label className="block"><span className="sr-only">Message</span><textarea name="message" rows={5} placeholder="Message" className={field} /></label>
          {error && <p className="text-[14px] text-red-400" role="alert">{error}</p>}
          <Button type="submit" borderRadius="0.9rem" duration={3000} containerClassName="h-12 w-full" className="text-[15px] font-semibold text-g">
            Send message →
          </Button>
          <p className="text-center text-[13px] text-white/40">Opens your email app with the message filled in.</p>
        </form>

        <div className="space-y-3">
          {cards.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-bg2 p-4 transition hover:border-g/40 hover:bg-g/[0.04]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-g/10 text-g"><c.icon size={22} stroke={1.6} /></span>
              <span className="min-w-0">
                <span className="block text-[13px] text-white/45">{c.label}</span>
                <span className="block truncate text-[16px] text-white">{c.value}</span>
              </span>
              <IconArrowUpRight size={18} className="ml-auto shrink-0 text-white/30 transition group-hover:text-g" />
            </a>
          ))}
        </div>
      </div>
      <footer className="mt-24 border-t border-white/[0.06] pt-8 text-center text-[13px] text-white/35">
        Built with embedded passion · Akhil Sebastian · 2026
      </footer>
    </section>
  );
}
