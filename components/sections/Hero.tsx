"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/moving-border";
import { PcbField } from "@/components/ui/pcb-background";
import { LINKS, ROLES } from "@/lib/data";
import { asset, EASE } from "@/lib/utils";
import { useJump } from "./PageShell";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { jump } = useJump();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, (v) => -140 * v);
  const fade = useTransform(scrollYProgress, (v) => Math.max(0, 1 - v / 0.7));

  return (
    <section ref={ref} id="home" className="relative h-[100svh] min-h-[600px] overflow-hidden">
      <PcbField className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_75%,rgba(4,7,5,0.55)_0%,rgba(4,7,5,0.15)_45%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

      <motion.div style={reduce ? undefined : { y: lift, opacity: fade }} className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1320px] flex-col justify-end px-5 pb-[13vh] sm:px-10">
        <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mb-3 text-[17px] text-white/55 sm:text-[19px]">
          Hi, I&apos;m
        </motion.p>
        <KineticName text="Akhil Sebastian" reduce={!!reduce} />
        <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-5 flex flex-wrap items-baseline gap-x-2 text-[20px] text-white/70 sm:text-[26px]">
          <span>I</span>
          <RoleTicker reduce={!!reduce} />
        </motion.div>
        <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }} className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3">
          <Button as="a" href="#projects" onClick={(e: React.MouseEvent) => { e.preventDefault(); jump("projects"); }} borderRadius="999px" duration={3500} containerClassName="h-12 w-44" className="text-[15px] font-semibold text-g">
            View projects
          </Button>
          <a href={asset("/resume.pdf")} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center rounded-full bg-g px-6 text-[15px] font-semibold text-bg transition hover:bg-white">
            Resume
          </a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center rounded-full border border-white/15 bg-bg/50 px-6 text-[15px] text-white/80 backdrop-blur transition hover:border-g hover:text-white">
            GitHub
          </a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); jump("contact"); }} className="flex h-12 items-center rounded-full border border-white/15 bg-bg/50 px-6 text-[15px] text-white/80 backdrop-blur transition hover:border-g hover:text-white">
            Contact
          </a>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[12px] text-white/40 sm:flex">
        <span>Scroll · click the board</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-4 animate-[cue_1.8s_ease-in-out_infinite] bg-gradient-to-b from-transparent to-g" />
        </span>
      </div>
    </section>
  );
}

/**
 * Name in a variable-weight face. Letters enter one by one; each letter thickens,
 * lifts and glows green as the cursor nears — a single glow field across the whole name.
 * With no cursor (touch, or idle), a virtual cursor sweeps across every few seconds.
 */
function KineticName({ text, reduce }: { text: string; reduce: boolean }) {
  const wrap = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = wrap.current;
    if (!el) return;
    const letters = [...el.querySelectorAll<HTMLElement>("[data-l]")];
    let raf = 0;
    let target: { x: number; y: number } | null = null;
    let lastMove = -1e9;
    const start = performance.now();

    const apply = (now: number) => {
      // idle sweep after 2.5 s without a cursor
      let t = target;
      if (!t && now - lastMove > 2500 && now - start > 2200) {
        const r = el.getBoundingClientRect();
        const cyc = ((now - start) % 6500) / 3200;
        if (cyc <= 1) t = { x: r.left - 120 + cyc * (r.width + 240), y: r.top + r.height * (0.3 + cyc * 0.4) };
      }
      for (const l of letters) {
        let k = 0;
        if (t) {
          const r = l.getBoundingClientRect();
          const d = Math.hypot(t.x - (r.left + r.width / 2), t.y - (r.top + r.height / 2));
          k = Math.max(0, 1 - d / 320);
        }
        l.style.fontVariationSettings = `"wght" ${Math.round(520 + 380 * k)}`;
        l.style.transform = `translateY(${(-10 * k).toFixed(1)}px)`;
        l.style.color = `color-mix(in srgb, #00e57a ${Math.round(k * 100)}%, #ffffff)`;
        l.style.textShadow = k > 0.02 ? `0 0 ${Math.round(28 * k)}px rgba(0,229,122,${(0.75 * k).toFixed(2)})` : "none";
      }
      raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      target = { x: e.clientX, y: e.clientY };
      lastMove = performance.now();
    };
    const onLeave = () => { target = null; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(apply);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <h1 ref={wrap} aria-label={text} className="text-[clamp(56px,11.5vw,168px)] leading-[0.9] tracking-[-0.045em]">
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="mr-[0.22em] inline-block whitespace-nowrap last:mr-0">
          {[...word].map((ch, i) => (
            <motion.span
              key={i}
              data-l
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, y: "0.6em", filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3 + (wi * 6 + i) * 0.045, duration: 0.9, ease: EASE }}
              className="inline-block transition-[font-variation-settings,transform,color,text-shadow] duration-300 ease-out"
              style={{ fontVariationSettings: '"wght" 520' }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}

function RoleTicker({ reduce }: { reduce: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % ROLES.length), 2600);
    return () => clearInterval(t);
  }, [reduce]);
  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="font-medium text-g2"
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
