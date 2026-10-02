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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {LANGUAGES.map((l, li) => (
          <motion.div
            key={l.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: li * 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-white/6 bg-bg2 p-5 transition-colors hover:border-g/40"
          >
            <span aria-hidden="true" className="pointer-events-none absolute -top-3 -right-1 font-bebas text-7xl leading-none text-g/[0.07]">{l.glyph}</span>
            <p className="font-bebas text-2xl text-white">{l.name}</p>
            <p className="font-mono text-[10px] tracking-[0.2em] text-g uppercase">{l.level}</p>
            {/* signal-strength meter */}
            <div className="mt-4 flex h-6 items-end gap-1" role="img" aria-label={`${l.level}: ${l.bars} of 5`}>
              {[1, 2, 3, 4, 5].map((b) => (
                <motion.span
                  key={b}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.2 + li * 0.08 + b * 0.06 }}
                  style={{ height: `${b * 20}%` }}
                  className={`block w-2.5 origin-bottom rounded-sm ${b <= l.bars ? "bg-g shadow-[0_0_8px_rgba(0,229,122,0.6)]" : "bg-white/10"}`}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
