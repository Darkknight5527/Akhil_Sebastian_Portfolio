"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { asset, cn } from "@/lib/utils";
import type { Project } from "@/lib/data";
import { ModelViewer } from "./model-viewer";

/** Aceternity UI — Expandable Card, adapted for project entries. */
export function ExpandableCards({ items }: { items: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [view, setView] = useState<"photo" | "3d">("photo");
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (!active?.images || view !== "photo") return;
      if (e.key === "ArrowRight") setImgIdx((i) => (i + 1) % active.images!.length);
      if (e.key === "ArrowLeft") setImgIdx((i) => (i - 1 + active.images!.length) % active.images!.length);
    };
    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, view]);

  useOutsideClick(ref, () => setActive(null));

  const open = (p: Project) => {
    setImgIdx(0);
    setView(p.images?.length ? "photo" : p.model ? "3d" : "photo");
    setActive(p);
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm" />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[110] grid place-items-center p-4">
            <motion.button
              key={`close-${active.id}-${id}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-bg text-white lg:hidden"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              ✕
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
              className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-bg2"
            >
              <motion.div layoutId={`media-${active.id}-${id}`} className="relative h-64 shrink-0 bg-black sm:h-80">
                {view === "3d" && active.model ? (
                  <ModelViewer src={active.model.src} sizeMB={active.model.sizeMB} alt={`${active.title} 3D model`} />
                ) : active.images?.length ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(active.images[imgIdx])} alt={`${active.title} photo ${imgIdx + 1}`} className="h-full w-full object-contain" />
                    {active.images.length > 1 && (
                      <>
                        <button aria-label="Previous photo" onClick={() => setImgIdx((i) => (i - 1 + active.images!.length) % active.images!.length)} className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1 text-xl text-white hover:text-g">‹</button>
                        <button aria-label="Next photo" onClick={() => setImgIdx((i) => (i + 1) % active.images!.length)} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1 text-xl text-white hover:text-g">›</button>
                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                          {active.images.map((_, i) => (
                            <button key={i} aria-label={`Photo ${i + 1}`} onClick={() => setImgIdx(i)} className={cn("h-1.5 rounded-full transition-all", i === imgIdx ? "w-5 bg-g" : "w-1.5 bg-white/40")} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Placeholder icon={active.icon} />
                )}
                {active.images?.length && active.model ? (
                  <div className="absolute top-3 left-3 flex overflow-hidden rounded-full border border-white/15 bg-black/70 font-mono text-[10px] tracking-widest uppercase">
                    {(["photo", "3d"] as const).map((v) => (
                      <button key={v} onClick={() => setView(v)} className={cn("px-3 py-1.5", view === v ? "bg-g text-bg" : "text-white/70")}>
                        {v === "photo" ? "Photos" : "3D"}
                      </button>
                    ))}
                  </div>
                ) : null}
              </motion.div>

              <div className="overflow-y-auto p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <motion.h3 layoutId={`title-${active.id}-${id}`} className="font-bebas text-3xl text-white">{active.title}</motion.h3>
                    <motion.p layoutId={`sub-${active.id}-${id}`} className="font-mono text-xs tracking-wider text-g uppercase">{active.subtitle}</motion.p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted">{active.date}</span>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="mt-4 text-sm leading-relaxed text-white/75">{active.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {active.tags.map((t) => (
                      <span key={t} className="rounded border border-line bg-g/5 px-2 py-1 font-mono text-[10px] text-g">{t}</span>
                    ))}
                  </div>
                  {active.links && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {active.links.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-g px-4 py-2 font-mono text-xs font-bold tracking-wider text-bg uppercase hover:bg-white">
                          View on {l.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <motion.li
            layoutId={`card-${p.id}-${id}`}
            key={p.id}
            onClick={() => open(p)}
            className={cn(
              "group cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-bg2 transition-colors hover:border-g/40",
              p.featured && "sm:col-span-2 lg:col-span-2",
            )}
          >
            <button className="block w-full text-left" aria-label={`Open ${p.title}`}>
              <motion.div layoutId={`media-${p.id}-${id}`} className={cn("relative overflow-hidden bg-black", p.featured ? "h-56 sm:h-72" : "h-44")}>
                {p.images?.length ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset(p.images[0])} alt="" className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                ) : (
                  <Placeholder icon={p.icon} />
                )}
                <span className="absolute top-3 left-3 rounded-full border border-g/30 bg-bg/80 px-2.5 py-1 font-mono text-[10px] tracking-wider text-g uppercase backdrop-blur">{p.badge}</span>
                {p.model && (
                  <span className="absolute top-3 right-3 rounded-full bg-bg/80 px-2 py-1 font-mono text-[10px] text-white/70 backdrop-blur">◈ 3D</span>
                )}
              </motion.div>
              <div className="p-5">
                <motion.h3 layoutId={`title-${p.id}-${id}`} className="font-bebas text-2xl text-white group-hover:text-g">{p.title}</motion.h3>
                <motion.p layoutId={`sub-${p.id}-${id}`} className="font-mono text-[11px] tracking-wider text-g/80 uppercase">{p.subtitle}</motion.p>
                <p className="mt-3 line-clamp-2 text-sm text-white/60">{p.description}</p>
                <p className="mt-3 font-mono text-[10px] tracking-widest text-muted uppercase">{p.date} · tap to expand</p>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>
    </>
  );
}

function Placeholder({ icon }: { icon: string }) {
  return (
    <div className="grid-bg flex h-full w-full items-center justify-center bg-gradient-to-br from-g/10 to-transparent">
      <span className="text-5xl opacity-80">{icon}</span>
    </div>
  );
}
