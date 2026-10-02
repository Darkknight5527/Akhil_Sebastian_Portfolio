"use client";
import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";

/**
 * Aceternity UI — Text Hover Effect, tuned for visibility:
 * thicker strokes, a glowing gradient + soft fill under the cursor,
 * and a slow automatic sweep when nobody is hovering (so touch screens see it too).
 */
export const TextHoverEffect = ({
  text,
  duration = 0.12,
  viewBox = "0 0 300 100",
  className,
  sweepDelay = 0,
}: {
  text: string;
  duration?: number;
  viewBox?: string;
  className?: string;
  sweepDelay?: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");
  const [hovered, setHovered] = useState(false);
  const [mask, setMask] = useState({ cx: "-20%", cy: "50%" });

  // Idle sweep: glide the reveal across the word every few seconds.
  useEffect(() => {
    if (hovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMask({ cx: "50%", cy: "50%" });
      return;
    }
    let raf = 0;
    const start = performance.now() + sweepDelay;
    const period = 5200;
    const tick = (now: number) => {
      const t = Math.max(0, now - start) % period;
      const p = Math.min(1, t / 2600); // sweep for 2.6s, then rest off-screen
      setMask({ cx: `${-20 + p * 140}%`, cy: `${50 + Math.sin(p * Math.PI) * 10}%` });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered, sweepDelay]);

  const onMove = (e: React.MouseEvent) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    setMask({ cx: `${((e.clientX - r.left) / r.width) * 100}%`, cy: `${((e.clientY - r.top) / r.height) * 100}%` });
  };

  const common = {
    x: "50%",
    y: "50%",
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    className: "font-bebas",
    style: { fontSize: 88 },
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMove}
      className={`select-none overflow-visible ${className ?? ""}`}
      aria-label={text}
      role="img"
    >
      <defs>
        <linearGradient id={`tg-${uid}`} gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00e57a" />
          <stop offset="35%" stopColor="#b6ffdc" />
          <stop offset="65%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#00e57a" />
        </linearGradient>
        <motion.radialGradient
          id={`rm-${uid}`}
          gradientUnits="userSpaceOnUse"
          r={hovered ? "30%" : "24%"}
          initial={false}
          animate={mask}
          transition={{ duration: hovered ? duration : 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="55%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={`m-${uid}`}>
          <rect x="-50%" y="-50%" width="200%" height="200%" fill={`url(#rm-${uid})`} />
        </mask>
        <filter id={`glow-${uid}`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base outline, drawn in on load */}
      <motion.text
        {...common}
        fill="transparent"
        stroke="#00e57a"
        strokeOpacity={0.45}
        strokeWidth={0.7}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      {/* Revealed under the cursor / sweep: soft fill + bright glowing stroke */}
      <g mask={`url(#m-${uid})`}>
        <text {...common} fill={`url(#tg-${uid})`} fillOpacity={0.22} stroke="none">{text}</text>
        <text {...common} fill="transparent" stroke={`url(#tg-${uid})`} strokeWidth={1.6} filter={`url(#glow-${uid})`}>{text}</text>
      </g>
    </svg>
  );
};
