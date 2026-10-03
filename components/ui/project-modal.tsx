"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { asset, cn, EASE } from "@/lib/utils";
import type { Project } from "@/lib/data";
import { ModelViewer } from "./model-viewer";
import { ProjectArt } from "./project-art";

/** Detail panel for a project: photo gallery and/or 3D model, full description, links. */
export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [view, setView] = useState<"photo" | "3d">("photo");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!project) return;
    setImgIdx(0);
    setView(project.images?.length ? "photo" : project.model ? "3d" : "photo");
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const n = project.images?.length ?? 0;
    const html = document.documentElement;
    html.classList.add("lenis-stopped");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (view !== "photo" || n < 2) return;
      if (e.key === "ArrowRight") setImgIdx((i) => (i + 1) % n);
      if (e.key === "ArrowLeft") setImgIdx((i) => (i - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.classList.remove("lenis-stopped");
    };
  }, [project, view, onClose]);

  if (!mounted) return null;
  const p = project;
  const n = p?.images?.length ?? 0;

  return createPortal(
    <AnimatePresence>
      {p && (
        <motion.div
          key={p.id}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={p.title}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            style={{ "--c": p.color } as React.CSSProperties}
            className="relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-[26px] border border-white/10 bg-bg2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          >
            <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition hover:border-g hover:text-g">
              <IconX size={18} />
            </button>

            <div className="relative aspect-[4/3] max-h-[50svh] w-full shrink-0 bg-black sm:aspect-[16/10]">
              {view === "3d" && p.model ? (
                <ModelViewer src={p.model} alt={`${p.title} 3D model`} />
              ) : n ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(p.images![imgIdx])} alt={`${p.title} photo ${imgIdx + 1}`} className="h-full w-full object-contain" />
                  {n > 1 && (
                    <>
                      <button aria-label="Previous photo" onClick={() => setImgIdx((i) => (i - 1 + n) % n)} className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:text-g"><IconChevronLeft size={20} /></button>
                      <button aria-label="Next photo" onClick={() => setImgIdx((i) => (i + 1) % n)} className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:text-g"><IconChevronRight size={20} /></button>
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {p.images!.map((_, i) => (
                          <button key={i} aria-label={`Photo ${i + 1}`} onClick={() => setImgIdx(i)} className={cn("h-1.5 rounded-full transition-all", i === imgIdx ? "w-5 bg-g" : "w-1.5 bg-white/40")} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : p.art ? (
                <div className="grid-bg absolute inset-0"><ProjectArt kind={p.art} color={p.color} /></div>
              ) : null}
              {n > 0 && p.model ? (
                <div className="absolute top-3 left-3 flex overflow-hidden rounded-full border border-white/15 bg-black/70 text-[13px]">
                  {(["photo", "3d"] as const).map((v) => (
                    <button key={v} onClick={() => setView(v)} className={cn("px-3.5 py-1.5 font-medium", view === v ? "bg-g text-bg" : "text-white/70")}>
                      {v === "photo" ? "Photos" : "3D model"}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="overflow-y-auto p-6 sm:p-7">
              <p className="text-[13px] font-medium" style={{ color: p.color }}>{p.badge} · {p.date}</p>
              <h3 className="mt-1 text-[30px] leading-tight font-semibold tracking-tight">{p.title}</h3>
              <p className="text-[15px] text-white/50">{p.subtitle}</p>
              <p className="mt-4 text-[16px] leading-relaxed text-white/75">{p.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-white/75">{t}</span>
                ))}
              </div>
              {p.links && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-g px-5 py-2.5 text-[14px] font-semibold text-bg transition hover:bg-white">
                      View on {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
