"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ABOUT, ABOUT_SCROLL, EDUCATION, FACTS, LANGUAGES, LIT_WORDS } from "@/lib/data";
import { asset, EASE, lerp } from "@/lib/utils";
import { Kicker } from "./SectionHeading";

export function About() {
  return (
    <div id="about">
      <ScrollLit />
      <Details />
    </div>
  );
}

/** A paragraph that "writes itself": each word goes from 12% to 100% as you scroll. */
function ScrollLit() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = ABOUT_SCROLL.split(" ");

  return (
    <section ref={ref} aria-label="About me" className={reduce ? "relative py-28" : "relative h-[260vh]"}>
      <div className={reduce ? "" : "sticky top-0 flex h-[100svh] items-center"}>
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-10">
          <Kicker>About me</Kicker>
          <p className="max-w-[24ch] text-[clamp(30px,4.4vw,64px)] leading-[1.12] font-semibold tracking-[-0.025em]">
            {words.map((w, i) => (
              <Word key={i} p={scrollYProgress} range={[0.05 + (i / words.length) * 0.6, 0.05 + ((i + 1) / words.length) * 0.6]} reduce={!!reduce} lit={LIT_WORDS.includes(w)}>
                {w}
              </Word>
            ))}
          </p>
          <div className="mt-10 grid max-w-[900px] gap-6 sm:grid-cols-3">
            {FACTS.map((f, i) => (
              <Fact key={f.k} f={f} p={scrollYProgress} at={0.68 + i * 0.07} reduce={!!reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Word({ p, range, children, reduce, lit }: { p: MotionValue<number>; range: [number, number]; children: string; reduce: boolean; lit: boolean }) {
  const o = useTransform(p, (v) => lerp(v, range, [0.12, 1]));
  return (
    <motion.span style={reduce ? undefined : { opacity: o }} className={lit ? "text-g" : ""}>
      {children}{" "}
    </motion.span>
  );
}

function Fact({ f, p, at, reduce }: { f: { k: string; v: string }; p: MotionValue<number>; at: number; reduce: boolean }) {
  const o = useTransform(p, (v) => lerp(v, [at, at + 0.08], [0, 1]));
  const y = useTransform(p, (v) => lerp(v, [at, at + 0.08], [16, 0]));
  return (
    <motion.div style={reduce ? undefined : { opacity: o, y }} className="border-t border-white/15 pt-3">
      <div className="text-[19px] font-semibold text-g">{f.k}</div>
      <div className="mt-1 text-[16px] leading-snug text-white/65">{f.v}</div>
    </motion.div>
  );
}

const rise = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: EASE },
};

function Details() {
  return (
    <section aria-label="Background" className="mx-auto max-w-[1320px] px-5 pb-28 sm:px-10">
      <div className="grid items-start gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        <motion.div {...rise} className="mx-auto w-full max-w-[300px] lg:mx-0">
          <CardContainer>
            <CardBody className="w-full">
              <CardItem translateZ={60} className="w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/images/profile.jpg")} alt="Akhil Sebastian" className="aspect-square w-full rounded-2xl object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]" />
              </CardItem>
            </CardBody>
          </CardContainer>
          <p className="mt-5 flex items-center gap-2 text-[15px] text-g">
            <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-g opacity-60" /><span className="h-2 w-2 rounded-full bg-g" /></span>
            Open to semiconductor test roles
          </p>
        </motion.div>

        <div className="space-y-12">
          <motion.div {...rise}>
            <h3 className="mb-4 text-[15px] font-medium text-white/50">Education</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {EDUCATION.map((e) => (
                <div key={e.school} className="rounded-2xl border border-white/[0.08] bg-bg2 p-5">
                  <p className="text-[32px] leading-none font-semibold tracking-tight text-g">{e.score}</p>
                  <p className="mt-3 text-[17px] font-medium">{e.degree}</p>
                  <p className="mt-1 text-[15px] text-white/55">{e.school} · {e.years}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...rise} className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-[15px] font-medium text-white/50">Currently</h3>
              <ul className="space-y-4">
                {ABOUT.currently.map((c) => (
                  <li key={c} className="flex gap-3 text-[16px] leading-relaxed text-white/75"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-g" />{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-[15px] font-medium text-white/50">Beyond the lab</h3>
              <ul className="space-y-4">
                {ABOUT.beyond.map((b) => (
                  <li key={b} className="flex gap-3 text-[16px] leading-relaxed text-white/75"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-g" />{b}</li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div {...rise}>
            <h3 className="mb-4 text-[15px] font-medium text-white/50">Languages</h3>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {LANGUAGES.map((l, li) => (
                <div key={l.name} className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-bg2 p-5 transition-colors hover:border-g/40">
                  <span aria-hidden="true" className="pointer-events-none absolute -top-2 right-1 text-[64px] leading-none font-bold text-g/[0.08]">{l.glyph}</span>
                  <p className="text-[20px] font-semibold">{l.name}</p>
                  <div className="mt-1 flex items-baseline justify-between">
                    <p className="text-[14px] text-g">{l.level}</p>
                    <p className="text-[13px] text-white/45 tabular-nums">{l.pct}%</p>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]" role="progressbar" aria-label={`${l.name} proficiency`} aria-valuenow={l.pct} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: EASE, delay: 0.2 + li * 0.08 }}
                      className="h-full rounded-full bg-g shadow-[0_0_10px_rgba(0,229,122,0.6)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
