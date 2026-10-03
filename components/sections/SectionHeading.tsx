"use client";
import { motion } from "motion/react";
import { EASE } from "@/lib/utils";

export function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[15px] font-medium text-g">{children}</p>;
}

/** Section opener: small green kicker + a big, tight headline. */
export function SectionHeading({ kicker, title, sub }: { kicker: string; title: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="mb-12"
    >
      <Kicker>{kicker}</Kicker>
      <h2 className="max-w-[22ch] text-[clamp(32px,4.2vw,58px)] leading-[1.05] font-semibold tracking-[-0.03em]">{title}</h2>
      {sub && <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-white/60">{sub}</p>}
    </motion.div>
  );
}
