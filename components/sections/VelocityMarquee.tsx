"use client";
import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "motion/react";
import { MARQUEE_A, MARQUEE_B } from "@/lib/data";

/** Two rows of huge text running in opposite directions; speed and direction follow scroll velocity. */
export function VelocityMarquee() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, (v) => v / 400);
  return (
    <section aria-label="Toolkit" className="relative overflow-hidden py-[12vh]">
      <Row items={MARQUEE_A} dir={-1} factor={factor} reduce={!!reduce} />
      <Row items={MARQUEE_B} dir={1} factor={factor} reduce={!!reduce} outline />
    </section>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Row({ items, dir, factor, reduce, outline }: { items: string[]; dir: number; factor: MotionValue<number>; reduce: boolean; outline?: boolean }) {
  const base = useMotionValue(0);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const d = useRef(dir);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = d.current * 2.2 * (delta / 1000);
    const f = factor.get();
    if (f < 0) d.current = -dir;
    else if (f > 0) d.current = dir;
    move += d.current * move * Math.min(6, Math.abs(f));
    base.set(base.get() + move);
  });
  const row = [...items, ...items];
  return (
    <div className="flex overflow-hidden py-1 whitespace-nowrap" aria-hidden={outline ? true : undefined}>
      <motion.div style={{ x }} className="flex shrink-0">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {row.map((t, i) => (
              <span key={i} className={`flex items-center px-6 text-[clamp(40px,7vw,104px)] leading-[1.1] font-semibold tracking-[-0.03em] ${outline ? "text-outline" : "text-white"}`}>
                {t}
                <span className="ml-12 inline-block h-3 w-3 rotate-45 bg-g shadow-[0_0_12px_rgba(0,229,122,0.8)]" aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
