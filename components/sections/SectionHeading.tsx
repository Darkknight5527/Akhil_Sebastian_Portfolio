"use client";
import { motion } from "motion/react";

export function SectionHeading({ index, title, kicker }: { index: string; title: string; kicker?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <p className="font-mono text-xs tracking-[0.3em] text-g">{index} //</p>
      <h2 className="font-bebas mt-2 text-5xl text-white sm:text-6xl">{title}</h2>
      {kicker && <p className="mt-3 max-w-xl text-sm text-muted">{kicker}</p>}
    </motion.div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-line py-3 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8">
            {t}<span className="text-g">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
