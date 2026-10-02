"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Aceternity UI — MacBook Scroll.
 * As the visitor scrolls, the lid opens and the screen scales up toward them.
 */
export function MacbookScroll({
  src,
  alt,
  title,
  badge,
  imageClassName,
}: {
  src: string;
  alt: string;
  title?: React.ReactNode;
  badge?: React.ReactNode;
  imageClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scaleX = useTransform(scrollYProgress, [0, 0.3], [1.2, isMobile ? 1 : 1.5]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [0.6, isMobile ? 1 : 1.5]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 900 : 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={ref}
      className="flex min-h-[130vh] shrink-0 scale-[0.6] transform flex-col items-center justify-start py-0 [perspective:800px] sm:scale-75 md:min-h-[200vh] md:scale-100 md:py-40"
    >
      <motion.h2 style={{ translateY: textTransform, opacity: textOpacity }} className="mb-20 text-center">
        {title}
      </motion.h2>
      <Lid src={src} alt={alt} scaleX={scaleX} scaleY={scaleY} rotate={rotate} translate={translate} imageClassName={imageClassName} />
      <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-[#1c1d1f] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="relative h-10 w-full">
          <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
        </div>
        <div className="relative flex">
          <div className="mx-auto h-full w-[10%] overflow-hidden"><SpeakerGrid /></div>
          <div className="mx-auto h-full w-[80%]"><Keypad /></div>
          <div className="mx-auto h-full w-[10%] overflow-hidden"><SpeakerGrid /></div>
        </div>
        <div className="mx-auto my-1 h-32 w-[40%] rounded-xl" style={{ boxShadow: "0px 0px 1px 1px #00000020 inset" }} />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
      </div>
    </div>
  );
}

function Lid({
  scaleX, scaleY, rotate, translate, src, alt, imageClassName,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src: string;
  alt: string;
  imageClassName?: string;
}) {
  return (
    <div className="relative [perspective:800px]">
      <div
        style={{ transform: "perspective(800px) rotateX(-25deg) translateZ(0px)", transformOrigin: "bottom", transformStyle: "preserve-3d" }}
        className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div style={{ boxShadow: "0px 2px 0px 2px #171717 inset" }} className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]">
          <span className="font-bebas text-3xl tracking-[0.3em] text-g/80">AS</span>
        </div>
      </div>
      <motion.div
        style={{ scaleX, scaleY, rotateX: rotate, translateY: translate, transformStyle: "preserve-3d", transformOrigin: "top" }}
        className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div className="absolute inset-0 rounded-lg bg-[#272729]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={cn("absolute inset-0 h-full w-full rounded-lg object-cover", imageClassName)} />
      </motion.div>
    </div>
  );
}

const KEY_ROWS: (string | [string, string])[][] = [
  ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "⏻"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", ["delete", "w-10"]],
  [["tab", "w-10"], "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  [["caps", "w-[2.8rem]"], "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", ["return", "w-[2.85rem]"]],
  [["shift", "w-[3.65rem]"], "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", ["shift", "w-[3.65rem]"]],
  ["fn", "ctrl", "opt", ["cmd", "w-8"], ["", "w-[8.2rem]"], ["cmd", "w-8"], "opt", "◀", "▲▼", "▶"],
];

function Keypad() {
  return (
    <div className="mx-1 h-full rounded-md bg-[#050505] p-1 [transform:translateZ(0)]">
      {KEY_ROWS.map((row, i) => (
        <div key={i} className="mb-[2px] flex w-full shrink-0 gap-[2px]">
          {row.map((k, j) => {
            const [label, w] = Array.isArray(k) ? k : [k, "w-6"];
            return (
              <div key={j} className={cn("rounded-[4px] bg-[#0a090d] p-[0.5px] shadow-[0px_-0.5px_2px_0_#0D0D0F_inset,-0.5px_0px_2px_0_#0D0D0F_inset]", i === 0 ? "h-4" : "h-6")}>
                <div className={cn("flex h-full items-center justify-center rounded-[3.5px] bg-[#0A090D] text-[5px] text-neutral-200", w)} style={{ boxShadow: "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset" }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function SpeakerGrid() {
  return (
    <div
      className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
      style={{ backgroundImage: "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)", backgroundSize: "3px 3px" }}
    />
  );
}
