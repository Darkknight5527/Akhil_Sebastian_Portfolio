"use client";
import { motion } from "motion/react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { LANGUAGES, SKILLS } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-5 py-28">
      <SectionHeading index="04" title="Skills" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((s) => (
          <CardContainer key={s.name} containerClassName="h-full" className="h-full w-full">
            <CardBody className="h-full w-full rounded-2xl border border-white/6 bg-bg2 p-6 transition-colors hover:border-g/40">
              <CardItem translateZ={50} className="text-3xl">{s.icon}</CardItem>
              <CardItem translateZ={40} as="h3" className="font-bebas mt-3 text-2xl text-white">{s.name}</CardItem>
              <CardItem translateZ={25} className="mt-4 flex flex-wrap gap-2">
                {s.items.map((i) => (
                  <span key={i} className="rounded border border-line bg-g/5 px-2 py-1 font-mono text-[10px] text-g/90">{i}</span>
                ))}
              </CardItem>
            </CardBody>
          </CardContainer>
        ))}
      </div>

      <h3 className="mt-16 mb-6 font-mono text-xs tracking-[0.25em] text-g uppercase">// Languages</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        {LANGUAGES.map((l) => (
          <div key={l.name}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-white">{l.name}</span>
              <span className="font-mono text-xs text-muted">{l.level}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/8">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${l.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-g" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
