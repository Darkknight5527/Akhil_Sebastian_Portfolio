"use client";
import { useEffect, useState } from "react";
import { CHAPTERS, useJump } from "./PageShell";
import { cn } from "@/lib/utils";

// Nav labels (the right-edge chapter rail calls the first one "Hello").
const LINKS = CHAPTERS.map((c) => ({ ...c, label: c.id === "home" ? "Home" : c.label }));

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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        filled || open ? "border-g/15 bg-bg/85 backdrop-blur-xl" : "border-transparent bg-gradient-to-b from-bg/80 to-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-5 sm:px-10">
        <a href="#home" onClick={go("home")} className="text-[22px] leading-none font-bold tracking-[-0.02em] sm:text-[24px]">
          Akhil <span className="text-g">Sebastian</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((c) => {
            const on = active === c.id;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  onClick={go(c.id)}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-[16px] font-medium transition-colors",
                    on ? "bg-g/15 text-g" : "text-white/70 hover:bg-white/[0.06] hover:text-white",
                  )}
                >
                  {c.label}
                </a>
              </li>
            );
          })}
        </ul>
        <button onClick={() => setOpen((o) => !o)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Menu" aria-expanded={open}>
          <span className={cn("h-0.5 w-6 rounded bg-white transition", open && "translate-y-[4px] rotate-45")} />
          <span className={cn("h-0.5 w-6 rounded bg-white transition", open && "-translate-y-[4px] -rotate-45")} />
        </button>
      </nav>
      {open && (
        <ul className="px-5 pb-4 md:hidden">
          {LINKS.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} onClick={go(c.id)} className={cn("block py-3 text-[18px] font-medium", active === c.id ? "text-g" : "text-white/80")}>
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
