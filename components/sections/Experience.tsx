"use client";
import { motion } from "motion/react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { INTERNSHIPS, LEADERSHIP, type Role } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

function Entry({ r, big }: { r: Role; big?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-white/6 bg-bg2 p-5 transition-colors hover:border-g/30"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className={big ? "font-bebas text-2xl text-white" : "font-bebas text-xl text-white"}>{r.title}</h4>
        <span className="font-mono text-[10px] tracking-wider text-muted uppercase">{r.when}</span>
      </div>
      <p className="font-mono text-[11px] tracking-wider text-g uppercase">{r.org}</p>
      <p className="mt-3 text-sm leading-relaxed text-white/65">{r.description}</p>
      {r.tags && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {r.tags.map((t) => (
            <span key={t} className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-g/90">{t}</span>
          ))}
        </div>
      )}
    </motion.article>
  );
}

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-5 py-28">
      <SectionHeading index="03" title="Experience" />
      <TracingBeam className="pl-10 md:pl-6">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h3 className="mb-5 font-mono text-xs tracking-[0.25em] text-g uppercase">// Work & Internships</h3>
            <div className="space-y-5">{INTERNSHIPS.map((r) => <Entry key={r.title} r={r} big />)}</div>
          </div>
          <div>
            <h3 className="mb-5 font-mono text-xs tracking-[0.25em] text-g uppercase">// Leadership & Roles</h3>
            <div className="space-y-4">{LEADERSHIP.map((r) => <Entry key={r.title + r.org} r={r} />)}</div>
          </div>
        </div>
      </TracingBeam>
    </section>
  );
}
