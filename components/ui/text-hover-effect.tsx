"use client";
import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";

/** Aceternity UI — Text Hover Effect (outlined SVG text revealed by a cursor-following gradient). */
export const TextHoverEffect = ({
  text,
  duration,
  viewBox = "0 0 300 100",
  className,
}: {
  text: string;
  duration?: number;
  viewBox?: string;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const r = svgRef.current.getBoundingClientRect();
      setMaskPosition({
        cx: `${((cursor.x - r.left) / r.width) * 100}%`,
        cy: `${((cursor.y - r.top) / r.height) * 100}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={`select-none ${className ?? ""}`}
      aria-label={text}
      role="img"
    >
      <defs>
        <linearGradient id={`tg-${uid}`} gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#00e57a" />
              <stop offset="35%" stopColor="#7dffc0" />
              <stop offset="65%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#00e57a" />
            </>
          )}
        </linearGradient>
        <motion.radialGradient
          id={`rm-${uid}`}
          gradientUnits="userSpaceOnUse"
          r="22%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={`m-${uid}`}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#rm-${uid})`} />
        </mask>
      </defs>
      <text
        x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" strokeWidth="0.4"
        className="font-bebas fill-transparent stroke-white/15 text-7xl"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" strokeWidth="0.4"
        className="font-bebas fill-transparent stroke-g/70 text-7xl"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>
      <text
        x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        stroke={`url(#tg-${uid})`} strokeWidth="0.4" mask={`url(#m-${uid})`}
        className="font-bebas fill-transparent text-7xl"
      >
        {text}
      </text>
    </svg>
  );
};
