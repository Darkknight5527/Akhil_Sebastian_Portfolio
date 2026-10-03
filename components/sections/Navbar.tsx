"use client";
import { useEffect, useState } from "react";
import { CHAPTERS, useJump } from "./PageShell";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [filled, setFilled] = useState(false);
  const [open, setOpen] = useState(false);
  const { jump, active } = useJump();

  useEffect(() => {
    const onScroll = () => setFilled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    jump(id);
  };

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-300", filled || open ? "border-b border-white/[0.06] bg-bg/80 backdrop-blur-xl" : "bg-transparent")}>
      <nav className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 sm:px-10">
        <a href="#home" onClick={go("home")} className="text-[17px] font-bold tracking-tight">
          Akhil<span className="text-g">.</span>
        </a>
        <ul className="hidden gap-8 md:flex">
          {CHAPTERS.slice(1).map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} onClick={go(c.id)} className={cn("text-[15px] transition-colors", active === c.id ? "text-white" : "text-white/55 hover:text-white")}>
                {c.label}
              </a>
            </li>
          ))}
        </ul>
        <button onClick={() => setOpen((o) => !o)} className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Menu" aria-expanded={open}>
          <span className={cn("h-px w-5 bg-white transition", open && "translate-y-[3.5px] rotate-45")} />
          <span className={cn("h-px w-5 bg-white transition", open && "-translate-y-[3.5px] -rotate-45")} />
        </button>
      </nav>
      {open && (
        <ul className="px-5 pb-4 md:hidden">
          {CHAPTERS.slice(1).map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} onClick={go(c.id)} className="block py-3 text-[17px] text-white/80">{c.label}</a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
