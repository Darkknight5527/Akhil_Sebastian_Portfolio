"use client";
import { useEffect, useState } from "react";
import { motion, useScroll } from "motion/react";
import { NAV } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [filled, setFilled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setFilled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.querySelector(n.href);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", filled ? "border-b border-line bg-bg/90 backdrop-blur-xl" : "bg-transparent")}>
      <motion.div className="absolute top-0 left-0 h-[2px] w-full origin-left bg-g" style={{ scaleX: scrollYProgress }} />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#home" className="font-mono text-xs font-bold tracking-[0.25em] text-g uppercase">AS — Portfolio</a>
        <ul className="hidden gap-7 md:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} className={cn("border-b pb-1 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors", active === n.href ? "border-g text-g" : "border-transparent text-muted hover:text-white")}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <button onClick={() => setOpen((o) => !o)} className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Menu" aria-expanded={open}>
          <span className={cn("h-px w-5 bg-g transition", open && "translate-y-[3.5px] rotate-45")} />
          <span className={cn("h-px w-5 bg-g transition", open && "-translate-y-[3.5px] -rotate-45")} />
        </button>
      </nav>
      {open && (
        <ul className="border-t border-line bg-bg/95 px-5 py-4 backdrop-blur-xl md:hidden">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)} className="block py-2.5 font-mono text-xs tracking-[0.15em] text-white/80 uppercase">{n.label}</a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
