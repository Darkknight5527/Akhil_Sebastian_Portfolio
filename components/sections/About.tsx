"use client";
import { motion } from "motion/react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ABOUT, EDUCATION } from "@/lib/data";
import { asset } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-28">
      <SectionHeading index="01" title="About Me" />
      <div className="grid items-start gap-12 lg:grid-cols-[380px_1fr]">
        <CardContainer>
          <CardBody className="group/card relative h-auto w-full max-w-sm rounded-2xl border border-line bg-bg2 p-5">
            <CardItem translateZ={60} className="w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/images/profile.jpg")} alt="Akhil Sebastian" className="aspect-[4/5] w-full rounded-xl object-cover" />
            </CardItem>
            <CardItem translateZ={40} className="mt-4 flex items-center gap-2 font-mono text-[11px] tracking-wider text-g uppercase">
              <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-g opacity-60" /><span className="h-2 w-2 rounded-full bg-g" /></span>
              Open to semiconductor test roles · 2026
            </CardItem>
            <div className="mt-4 space-y-3">
              {EDUCATION.map((e) => (
                <CardItem key={e.school} translateZ={25} className="w-full rounded-lg border border-white/5 bg-black/30 p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-white">{e.degree}</p>
                    <p className="font-bebas text-xl text-g">{e.score}</p>
                  </div>
                  <p className="text-xs text-muted">{e.school} · {e.years}</p>
                </CardItem>
              ))}
            </div>
          </CardBody>
        </CardContainer>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-lg leading-relaxed text-white/80">{ABOUT.bio}</p>

          <h3 className="mt-10 font-mono text-xs tracking-[0.25em] text-g uppercase">// Currently</h3>
          <ul className="mt-4 space-y-3">
            {ABOUT.currently.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-white/70"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-g" />{c}</li>
            ))}
          </ul>

          <h3 className="mt-10 font-mono text-xs tracking-[0.25em] text-g uppercase">// Beyond the lab</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ABOUT.beyond.map((b) => (
              <li key={b.text} className="flex items-center gap-3 rounded-lg border border-white/5 bg-bg2 p-3 text-sm text-white/70">
                <span className="text-xl">{b.icon}</span>{b.text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
