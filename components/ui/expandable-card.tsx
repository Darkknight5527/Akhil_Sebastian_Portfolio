"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { Role } from "@/lib/data";

/**
 * Aceternity UI — Expandable Card (list variant).
 * Each row morphs into a full card on click via shared layout animations.
 */
export function ExpandableRoles({ items }: { items: Role[] }) {
  const [active, setActive] = useState<Role | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.body.style.overflow = active ? "hidden" : "";
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const initials = (r: Role) => r.badge ?? r.org.split(/[\s·]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
  const key = (r: Role) => `${r.title}-${r.org}`.replace(/\W+/g, "-");

  return (
    <>
      <AnimatePresence>
        {active && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm" />}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[110] grid place-items-center p-4">
            <motion.div
              layoutId={`card-${key(active)}-${id}`}
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
              className="flex w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-line bg-bg2 shadow-[0_0_60px_rgba(0,229,122,0.15)]"
            >
              <motion.div layoutId={`badge-${key(active)}-${id}`} className="grid-bg relative flex h-40 items-center justify-center bg-gradient-to-br from-g/25 via-g/5 to-transparent">
                <span className="font-bebas text-7xl text-g drop-shadow-[0_0_20px_rgba(0,229,122,0.5)]">{initials(active)}</span>
              </motion.div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <motion.h4 layoutId={`title-${key(active)}-${id}`} className="font-bebas text-3xl text-white">{active.title}</motion.h4>
                    <motion.p layoutId={`org-${key(active)}-${id}`} className="font-mono text-xs tracking-wider text-g uppercase">{active.org}</motion.p>
                  </div>
                  <motion.button
                    layoutId={`btn-${key(active)}-${id}`}
                    onClick={() => setActive(null)}
                    className="shrink-0 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] tracking-widest text-white/80 uppercase hover:border-g hover:text-g"
                  >
                    Close
                  </motion.button>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="mt-2 font-mono text-[11px] tracking-wider text-muted uppercase">{active.when}</p>
                  <p className="mt-4 text-sm leading-relaxed text-white/75">{active.description}</p>
                  {active.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {active.tags.map((t) => (
                        <span key={t} className="rounded border border-line bg-g/5 px-2 py-1 font-mono text-[10px] text-g">{t}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ul className="space-y-3">
        {items.map((r) => (
          <motion.li
            layoutId={`card-${key(r)}-${id}`}
            key={key(r)}
            onClick={() => setActive(r)}
            className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/6 bg-bg2 p-4 transition-colors hover:border-g/40 hover:bg-g/[0.04]"
          >
            <motion.div layoutId={`badge-${key(r)}-${id}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-gradient-to-br from-g/20 to-transparent sm:h-14 sm:w-14">
              <span className="font-bebas text-2xl text-g">{initials(r)}</span>
            </motion.div>
            <div className="min-w-0 flex-1">
              <motion.h4 layoutId={`title-${key(r)}-${id}`} className="font-bebas text-xl leading-tight text-white group-hover:text-g">{r.title}</motion.h4>
              <motion.p layoutId={`org-${key(r)}-${id}`} className="font-mono text-[11px] tracking-wider text-g/80 uppercase">{r.org}</motion.p>
              <p className="mt-0.5 font-mono text-[10px] tracking-wider text-muted uppercase">{r.when}</p>
            </div>
            <motion.button
              layoutId={`btn-${key(r)}-${id}`}
              className="hidden shrink-0 rounded-full bg-white/5 px-4 py-2 font-mono text-[10px] tracking-widest text-white/80 uppercase transition group-hover:bg-g group-hover:text-bg sm:block"
            >
              Details
            </motion.button>
            <span aria-hidden="true" className="text-xl text-g sm:hidden">›</span>
          </motion.li>
        ))}
      </ul>
    </>
  );
}
