"use client";
import { motion } from "motion/react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { INTERNSHIPS, LEADERSHIP, type Role } from "@/lib/data";
import { EASE } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

function Entry({ r, big }: { r: Role; big?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="rounded-2xl border border-white/[0.08] bg-bg2 p-5 transition-colors hover:border-g/30 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h4 className={big ? "text-[22px] font-semibold tracking-tight" : "text-[19px] font-semibold tracking-tight"}>{r.title}</h4>
        <span className="text-[13px] text-white/45 tabular-nums">{r.when}</span>
      </div>
      <p className="mt-0.5 text-[15px] font-medium text-g">{r.org}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-white/65">{r.description}</p>
      {r.tags && (
        <div className="mt-4 flex flex-wrap gap-2">
          {r.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-white/75">{t}</span>
          ))}
        </div>
      )}
    </motion.article>
  );
}

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-[1320px] px-5 py-28 sm:px-10">
      <SectionHeading kicker="Experience" title="Where I've learned by doing." />
      <TracingBeam className="pl-10 md:pl-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h3 className="mb-5 text-[15px] font-medium text-white/50">Work & internships</h3>
            <div className="space-y-5">{INTERNSHIPS.map((r) => <Entry key={r.title} r={r} big />)}</div>
          </div>
          <div>
            <h3 className="mb-5 text-[15px] font-medium text-white/50">Leadership & roles</h3>
            <div className="space-y-4">{LEADERSHIP.map((r) => <Entry key={r.title + r.org} r={r} />)}</div>
          </div>
        </div>
      </TracingBeam>
    </section>
  );
}
