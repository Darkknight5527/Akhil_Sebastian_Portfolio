"use client";
import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { SKILLS } from "@/lib/data";
import { cn, EASE } from "@/lib/utils";
import { Kicker } from "./SectionHeading";

type Skill = (typeof SKILLS)[number];

// Die geometry (percent of the die): 6×6 grid inside a pad ring.
const PAD = 5;
const GAP = 2.4;
const CELL = (100 - 2 * PAD - 5 * GAP) / 6;
const edge = (i: number) => PAD + i * (CELL + GAP);
const chan = (i: number) => edge(i) - GAP / 2;
const SWEEP = 1.3;
const AREAS = `"emb emb emb rob rob rob" "emb emb emb rob rob rob" "dro dro ate ate des des" "dro dro ate ate des des" "lea lea lea lea lea lea" "lea lea lea lea lea lea"`;
const ROW: Record<string, number> = { emb: 0, rob: 0, dro: 2, ate: 2, des: 2, lea: 4 };
const KIND: Record<string, "sram" | "cells"> = { emb: "sram", rob: "cells", dro: "cells", des: "cells", lea: "sram" };
const color = (id: string) => SKILLS.find((s) => s.id === id)!.color;

const CHANNELS = [`M2.5 ${chan(2)} H97.5`, `M2.5 ${chan(4)} H97.5`, `M50 2.5 V${chan(2)}`, `M${chan(2)} ${chan(2)} V${chan(4)}`, `M${chan(4)} ${chan(2)} V${chan(4)}`];
const TRACES = [
  { d: `M${chan(2)} 50 V${chan(2)} H2.5`, c: color("emb"), dur: 4.2 },
  { d: `M50 ${chan(2)} V2.5`, c: color("ate"), dur: 3.4 },
  { d: `M${chan(4)} 50 V${chan(2)} H97.5`, c: color("rob"), dur: 4.8 },
  { d: `M${chan(2)} 50 V${chan(4)} H2.5`, c: color("dro"), dur: 3.9 },
  { d: `M${chan(4)} 50 V${chan(4)} H97.5`, c: color("des"), dur: 5.4 },
  { d: `M50 ${chan(4)} H97.5 V97.5`, c: color("lea"), dur: 6.2 },
];

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [active, setActive] = useState<string>("ate");
  const a = SKILLS.find((s) => s.id === active)!;

  return (
    <section ref={ref} id="skills" className="relative flex min-h-[100svh] items-center py-[8vh]">
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-10 px-5 sm:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <div>
          <Kicker>Skills</Kicker>
          <h2 className="text-[clamp(30px,4vw,56px)] leading-[1.05] font-semibold tracking-[-0.03em]">Everything I know, on one die.</h2>
          <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-white/60">
            Each block is an area I work in, with test and validation at the core. Point at a block (or tap it) to see what&apos;s inside.
          </p>
          <div className="mt-8 hidden lg:block"><Panel a={a} /></div>
        </div>
        <div className="flex flex-col items-center gap-8">
          {inView ? <Die active={active} onPick={setActive} /> : <div className="aspect-square w-full max-w-[560px]" />}
          <div className="w-full lg:hidden"><Panel a={a} /></div>
        </div>
      </div>
    </section>
  );
}

function Panel({ a }: { a: Skill }) {
  return (
    <div className="min-h-[150px] border-l-2 pl-5 transition-colors duration-300" style={{ borderColor: a.color }}>
      <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
        <div className="text-[20px] font-semibold" style={{ color: a.color }}>{a.name}</div>
        <div className="mt-1 text-[16px] text-white/60">{a.line}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {a.items.map((it) => (
            <span key={it} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-white/80">{it}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Die({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, (v) => -16 * v), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(px, (v) => 20 * v), { stiffness: 120, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    if (!reduce && e.pointerType === "mouse") { px.set(x - 0.5); py.set(y - 0.5); }
  };
  const onLeave = () => { px.set(0); py.set(0); };

  return (
    <div className="w-full max-w-[560px] [perspective:1400px] lg:w-[min(560px,calc(100svh-180px))]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, "--mx": "50%", "--my": "-30%" } as never}
        initial={reduce ? false : { opacity: 0, scale: 0.92, rotateZ: -4 }}
        animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
        transition={{ duration: 1, ease: EASE }}
        className="die relative aspect-square w-full rounded-[18px] [container-type:inline-size] [transform-style:preserve-3d]"
      >
        <div className="die-ring pointer-events-none absolute -inset-px rounded-[19px]" />
        <div className="absolute inset-0 overflow-hidden rounded-[18px] bg-[#0a0f0c]">
          <div className="die-metal absolute inset-0" />
          <div className="die-light pointer-events-none absolute inset-0" />
        </div>
        <Pads reduce={!!reduce} />
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="die-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {CHANNELS.map((d, i) => (
            <motion.path key={d} d={d} fill="none" stroke="#c99a5b" strokeOpacity="0.42" strokeWidth="0.45" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.9 }} />
          ))}
          {!reduce &&
            TRACES.map((t, i) => (
              <path key={i} d={t.d} pathLength={100} fill="none" stroke={t.c} strokeWidth="0.9" strokeLinecap="round" filter="url(#die-glow)" className="die-pulse" style={{ "--dur": `${t.dur}s`, "--delay": `${SWEEP + 0.2 + i * 0.37}s` } as React.CSSProperties} />
            ))}
        </svg>
        <div
          className="absolute grid"
          style={{ inset: `${PAD}%`, gap: `${(GAP / (100 - 2 * PAD)) * 100}%`, gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gridTemplateRows: "repeat(6, minmax(0, 1fr))", gridTemplateAreas: AREAS }}
        >
          {SKILLS.map((s) => (s.id === "ate" ? <Core key={s.id} s={s} on={active === s.id} onPick={onPick} reduce={!!reduce} /> : <Block key={s.id} s={s} on={active === s.id} onPick={onPick} reduce={!!reduce} />))}
        </div>
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 z-20 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #d9fff0 20%, #fff 50%, #d9fff0 80%, transparent)", boxShadow: "0 0 18px 4px rgba(120,255,200,.5)" }}
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ top: { duration: SWEEP, delay: 0.35, ease: "easeInOut" }, opacity: { duration: SWEEP, delay: 0.35, times: [0, 0.08, 0.9, 1] } }}
          />
        )}
        <div className="pointer-events-none absolute right-[6.5%] bottom-[1.2%] text-[max(7px,1.35cqw)] font-semibold tracking-[0.18em] text-[#c99a5b]/60">AS-01 · EEE · 2026</div>
      </motion.div>
    </div>
  );
}

function Pads({ reduce }: { reduce: boolean }) {
  const per = 15;
  const pads: { key: string; pos: React.CSSProperties; n: number }[] = [];
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < per; i++) {
      if (side === 2 && i < 5) continue;
      const t = 7 + (i * 86) / (per - 1);
      const pos = side === 0 ? { left: `${t}%`, top: "2.5%" } : side === 1 ? { left: "97.5%", top: `${t}%` } : side === 2 ? { left: `${100 - t}%`, top: "97.5%" } : { left: "2.5%", top: `${100 - t}%` };
      pads.push({ key: `${side}-${i}`, pos, n: side * per + i });
    }
  }
  return pads.map((p) => (
    <motion.span
      key={p.key}
      className="absolute h-[1.7%] w-[1.7%] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[#c99a5b]"
      style={p.pos}
      initial={reduce ? false : { opacity: 0.12 }}
      animate={{ opacity: [0.12, 1, 0.55] }}
      transition={{ delay: 0.2 + p.n * 0.018, duration: 0.7 }}
    />
  ));
}

const powerOn = (id: string) => 0.35 + SWEEP * (edge(ROW[id]) / 100) + 0.05;

function Block({ s, on, onPick, reduce }: { s: Skill; on: boolean; onPick: (id: string) => void; reduce: boolean }) {
  return (
    <motion.button
      onClick={() => onPick(s.id)}
      onPointerEnter={(e) => e.pointerType === "mouse" && onPick(s.id)}
      onFocus={() => onPick(s.id)}
      style={{ gridArea: s.id, "--c": s.color } as React.CSSProperties}
      initial={reduce ? false : { opacity: 0.08, filter: "brightness(0.3) saturate(0)" }}
      animate={{ opacity: 1, filter: "brightness(1) saturate(1)" }}
      transition={{ delay: powerOn(s.id), duration: 0.55, ease: "easeOut" }}
      className={cn("die-block group relative overflow-hidden rounded-[6px] text-left outline-none", KIND[s.id] === "sram" ? "is-sram" : "is-cells", on && "is-on")}
      aria-label={s.name}
      aria-pressed={on}
    >
      <span className="die-block-fill absolute inset-0" />
      <span className="relative flex h-full flex-col justify-between p-[max(6px,2.2cqw)]">
        <span className="text-[max(10px,2.15cqw)] leading-tight font-semibold" style={{ color: s.color }}>{s.name}</span>
        <span className="block text-[max(13px,3.4cqw)] leading-[1.05] font-bold tracking-tight text-white">{s.line}</span>
      </span>
    </motion.button>
  );
}

function Core({ s, on, onPick, reduce }: { s: Skill; on: boolean; onPick: (id: string) => void; reduce: boolean }) {
  const R = 42;
  const C = 2 * Math.PI * R;
  return (
    <motion.button
      onClick={() => onPick(s.id)}
      onPointerEnter={(e) => e.pointerType === "mouse" && onPick(s.id)}
      onFocus={() => onPick(s.id)}
      style={{ gridArea: s.id }}
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35 + SWEEP * 0.45, duration: 0.7, ease: EASE }}
      className={cn("die-core relative grid place-items-center rounded-[8px] outline-none", on && "ring-1 ring-g/60")}
      aria-label={s.name}
      aria-pressed={on}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-[8%] h-[84%] w-[84%] -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="3" />
        <motion.circle cx="50" cy="50" r={R} fill="none" stroke="#00e57a" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} initial={reduce ? false : { strokeDashoffset: C }} animate={{ strokeDashoffset: 0 }} transition={{ delay: 0.35 + SWEEP, duration: 1.4, ease: EASE }} />
      </svg>
      <span className="relative text-center">
        <span className="block text-[max(11px,2.4cqw)] font-semibold text-white/55">ATE core</span>
        <span className="block text-[max(18px,5cqw)] leading-none font-bold tracking-tight">V93K</span>
        <motion.span className="mt-[0.6cqw] block text-[max(10px,2.1cqw)] font-semibold tracking-[0.2em] text-g" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + SWEEP + 1.4 }}>
          PASS
        </motion.span>
      </span>
    </motion.button>
  );
}
