"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export const CHAPTERS = [
  { id: "home", label: "Hello" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const ScrollCtx = createContext<{ jump: (id: string) => void; active: string }>({ jump: () => {}, active: "home" });
export const useJump = () => useContext(ScrollCtx);

/** Smooth scrolling (Lenis), a spring progress bar and the chapter rail on the right. */
export function PageShell({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [active, setActive] = useState("home");
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduce) return;
    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    let raf = requestAnimationFrame(function tick(t) {
      l.raf(t);
      raf = requestAnimationFrame(tick);
    });
    setLenis(l);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      setLenis(null);
    };
  }, [reduce]);

  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.4, offset: id === "home" ? 0 : -8 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <ScrollCtx.Provider value={{ jump, active }}>
      <motion.div style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-g2 to-g" />
      <nav className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex" aria-label="Chapters">
        {CHAPTERS.map((c) => {
          const on = active === c.id;
          return (
            <button key={c.id} onClick={() => jump(c.id)} className="group flex items-center gap-3" aria-current={on ? "true" : undefined} aria-label={c.label}>
              <span className="translate-x-2 rounded-md bg-black/60 px-2 py-0.5 text-[13px] text-white/75 opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                {c.label}
              </span>
              <span className={cn("block h-[2px] rounded-full transition-all duration-300", on ? "w-8 bg-g shadow-[0_0_10px_rgba(0,229,122,0.8)]" : "w-4 bg-white/25 group-hover:w-6 group-hover:bg-white/60")} />
            </button>
          );
        })}
      </nav>
      {children}
    </ScrollCtx.Provider>
  );
}
