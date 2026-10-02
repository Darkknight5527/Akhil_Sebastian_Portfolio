"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { asset, cn } from "@/lib/utils";
import type { Project } from "@/lib/data";
import { ModelViewer } from "./model-viewer";

/** Detail panel for a project: photo gallery and/or 3D model, full description, links. */
export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [view, setView] = useState<"photo" | "3d">("photo");

  useEffect(() => {
    if (!project) return;
    setImgIdx(0);
    setView(project.images?.length ? "photo" : project.model ? "3d" : "photo");
  }, [project]);

  useEffect(() => {
    document.body.style.overflow = project ? "hidden" : "";
    if (!project) return;
    const n = project.images?.length ?? 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (view !== "photo" || n < 2) return;
      if (e.key === "ArrowRight") setImgIdx((i) => (i + 1) % n);
      if (e.key === "ArrowLeft") setImgIdx((i) => (i - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, view, onClose]);

  const p = project;
  const n = p?.images?.length ?? 0;

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={p.title}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-bg2 shadow-[0_0_60px_rgba(0,229,122,0.12)]"
          >
            <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition hover:border-g hover:text-g">✕</button>

            <div className="relative aspect-[4/3] max-h-[52vh] w-full shrink-0 bg-black sm:aspect-[16/10]">
              {view === "3d" && p.model ? (
                <ModelViewer src={p.model} alt={`${p.title} 3D model`} />
              ) : n ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(p.images![imgIdx])} alt={`${p.title} photo ${imgIdx + 1}`} className="h-full w-full object-contain" />
                  {n > 1 && (
                    <>
                      <button aria-label="Previous photo" onClick={() => setImgIdx((i) => (i - 1 + n) % n)} className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1 text-xl text-white hover:text-g">‹</button>
                      <button aria-label="Next photo" onClick={() => setImgIdx((i) => (i + 1) % n)} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1 text-xl text-white hover:text-g">›</button>
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {p.images!.map((_, i) => (
                          <button key={i} aria-label={`Photo ${i + 1}`} onClick={() => setImgIdx(i)} className={cn("h-1.5 rounded-full transition-all", i === imgIdx ? "w-5 bg-g" : "w-1.5 bg-white/40")} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="grid-bg flex h-full w-full items-center justify-center text-6xl">{p.icon}</div>
              )}
              {n > 0 && p.model ? (
                <div className="absolute top-3 left-3 flex overflow-hidden rounded-full border border-white/15 bg-black/70 font-mono text-[10px] tracking-widest uppercase">
                  {(["photo", "3d"] as const).map((v) => (
                    <button key={v} onClick={() => setView(v)} className={cn("px-3 py-1.5", view === v ? "bg-g text-bg" : "text-white/70")}>
                      {v === "photo" ? "Photos" : "3D model"}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="overflow-y-auto p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bebas text-3xl text-white">{p.title}</h3>
                  <p className="font-mono text-xs tracking-wider text-g uppercase">{p.subtitle}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted">{p.date}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/75">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded border border-line bg-g/5 px-2 py-1 font-mono text-[10px] text-g">{t}</span>
                ))}
              </div>
              {p.links && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-g px-4 py-2 font-mono text-xs font-bold tracking-wider text-bg uppercase hover:bg-white">
                      View on {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
