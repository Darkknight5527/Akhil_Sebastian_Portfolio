"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/** Aceternity UI — Tracing Beam (a gradient line that follows scroll progress). */
export const TracingBeam = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  useEffect(() => {
    if (!contentRef.current) return;
    const ro = new ResizeObserver(() => setSvgHeight(contentRef.current?.offsetHeight ?? 0));
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), { stiffness: 500, damping: 90 });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), { stiffness: 500, damping: 90 });

  return (
    <motion.div ref={ref} className={cn("relative mx-auto h-full w-full", className)}>
      <div className="absolute top-3 -left-2 md:-left-10">
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{ boxShadow: "rgba(0,229,122,0.35) 0px 0px 12px" }}
          className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-g/40 bg-bg"
        >
          <div className="h-2 w-2 rounded-full bg-g" />
        </motion.div>
        <svg viewBox={`0 0 20 ${svgHeight}`} width="20" height={svgHeight} className="ml-4 block" aria-hidden="true">
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none" stroke="#1d2b22" strokeOpacity="0.9"
            transition={{ duration: 10 }}
          />
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none" stroke="url(#beam-gradient)" strokeWidth="1.5"
            className="motion-reduce:hidden" transition={{ duration: 10 }}
          />
          <defs>
            <motion.linearGradient id="beam-gradient" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={y1} y2={y2}>
              <stop stopColor="#00e57a" stopOpacity="0" />
              <stop stopColor="#00e57a" />
              <stop offset="0.325" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#0ea5e9" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};
