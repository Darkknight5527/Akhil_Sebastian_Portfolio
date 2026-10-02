"use client";
import { motion } from "motion/react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Button } from "@/components/ui/moving-border";
import { PcbBackground } from "@/components/ui/pcb-background";
import { LINKS, MARQUEE, STATS } from "@/lib/data";
import { asset } from "@/lib/utils";
import { Marquee } from "./SectionHeading";

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-24">
      {/* PCB traces with running signal pulses */}
      <PcbBackground className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,8,5,0.55)_0%,rgba(3,8,5,0.15)_45%,rgba(3,8,5,0.95)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,8,5,0.75)_0%,rgba(3,8,5,0.35)_45%,transparent_75%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="font-mono text-xs tracking-[0.35em] text-g uppercase">
          EEE Engineer · ATE Test Engineer
        </motion.p>

        <h1 className="sr-only">Akhil Sebastian</h1>
        <div className="mx-auto mt-4 max-w-3xl sm:-mt-2">
          <TextHoverEffect text="AKHIL" viewBox="0 0 300 80" />
        </div>
        <div className="mx-auto -mt-1 max-w-4xl sm:-mt-6">
          <TextHoverEffect text="SEBASTIAN" viewBox="0 0 480 80" sweepDelay={350} />
        </div>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-4 font-mono text-sm tracking-[0.2em] text-white/75 uppercase">
          Robotics · Embedded Systems · Semiconductor Test
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button as="a" href="#projects" borderRadius="999px" duration={3500} containerClassName="h-12 w-44" className="font-mono text-xs font-bold tracking-widest text-g uppercase">
            View Projects
          </Button>
          <a href={asset("/resume.pdf")} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center rounded-full bg-g px-7 font-mono text-xs font-bold tracking-widest text-bg uppercase transition hover:bg-white">
            Resume ↓
          </a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center rounded-full border border-white/15 bg-bg/60 px-6 font-mono text-xs tracking-widest text-white/80 uppercase backdrop-blur transition hover:border-g hover:text-g">
            GitHub
          </a>
          <a href="#contact" className="flex h-12 items-center rounded-full border border-white/15 bg-bg/60 px-6 font-mono text-xs tracking-widest text-white/80 uppercase backdrop-blur transition hover:border-g hover:text-g">
            Contact
          </a>
        </motion.div>

        <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-5">
          {STATS.map((s) => (
            <div key={s.label} className="bg-bg/90 px-4 py-4 backdrop-blur last:col-span-2 sm:last:col-span-1">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-bebas text-3xl text-g">{s.value}</dd>
              <dd className="font-mono text-[10px] tracking-wider text-muted uppercase">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <div className="relative z-10 mt-16 bg-bg/70 backdrop-blur-sm">
        <Marquee items={MARQUEE} />
      </div>
    </section>
  );
}
