"use client";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ProjectArt } from "@/components/ui/project-art";
import { ProjectModal } from "@/components/ui/project-modal";
import { PROJECTS, type Project } from "@/lib/data";
import { asset, cn, lerp } from "@/lib/utils";
import { Kicker } from "./SectionHeading";

/** Sideways gallery: vertical scroll moves the card track horizontally. */
export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [dist, setDist] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => lerp(v, [0.05, 0.95], [0, -dist]));
  const sx = useSpring(x, { stiffness: 120, damping: 30, mass: 0.4 });

  useLayoutEffect(() => {
    const measure = () => setDist(Math.max(0, (track.current?.scrollWidth || 0) - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={ref} id="projects" className="relative" style={{ height: reduce ? "auto" : `calc(100svh + ${dist}px)` }}>
      <div className={reduce ? "py-24" : "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden"}>
        <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-end justify-between gap-4 px-5 sm:px-10">
          <div>
            <Kicker>Projects</Kicker>
            <h2 className="max-w-[22ch] text-[clamp(30px,4vw,56px)] leading-[1.05] font-semibold tracking-[-0.03em]">Things I&apos;ve built, flown and tested.</h2>
          </div>
          {!reduce && <p className="hidden text-[15px] text-white/45 sm:block">Keep scrolling →</p>}
        </div>
        <motion.div ref={track} style={reduce ? undefined : { x: sx }} className={cn("mt-8 flex gap-5 px-5 sm:px-10 lg:mt-10", reduce ? "flex-wrap" : "w-max")}>
          {PROJECTS.map((p) => (
            <GalleryCard key={p.id} p={p} onOpen={() => setOpen(p)} />
          ))}
          <div className="w-[8vw] shrink-0" />
        </motion.div>
      </div>
      <ProjectModal project={open} onClose={close} />
    </section>
  );
}

function GalleryCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const img = p.images?.[0] ?? p.thumb;

  return (
    <article
      ref={ref}
      onPointerMove={move}
      style={{ "--c": p.color } as React.CSSProperties}
      className={cn(
        "gal-card group relative flex h-[min(62svh,500px)] shrink-0 flex-col rounded-[26px] border border-white/10 bg-bg2 p-5",
        p.featured ? "w-[min(86vw,620px)]" : "w-[min(82vw,400px)]",
      )}
    >
      <div className="gal-spot pointer-events-none absolute inset-0 rounded-[26px]" />

      {/* 3D tilt on the image only, so the text and buttons stay put */}
      <CardContainer containerClassName="relative min-h-0 w-full flex-1" className="h-full w-full">
        <CardBody className="h-full w-full">
          <CardItem as="button" translateZ={50} onClick={onOpen} aria-label={`Open ${p.title}`} className="relative block h-full w-full cursor-pointer overflow-hidden rounded-2xl shadow-[0_24px_40px_-20px_rgba(0,0,0,0.8)]">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset(img)} alt="" className="h-full w-full object-cover object-[50%_28%]" />
            ) : (
              <span className="grid-bg absolute inset-0 rounded-2xl border border-white/[0.06] bg-black/30">
                <ProjectArt kind={p.art!} color={p.color} />
              </span>
            )}
          </CardItem>
        </CardBody>
      </CardContainer>

      <div className="relative pt-5">
        <p className="text-[13px] font-medium" style={{ color: p.color }}>{p.badge} · {p.date}</p>
        <h3 className="mt-1 text-[24px] leading-tight font-semibold tracking-tight">{p.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-white/60">{p.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="truncate text-[13px] text-white/40">{p.model ? "Photos · 3D model" : p.subtitle}</span>
          <button onClick={onOpen} className="shrink-0 rounded-full bg-white/[0.06] px-4 py-2 text-[14px] font-medium text-white/85 transition hover:bg-g hover:text-bg">
            Explore →
          </button>
        </div>
      </div>
    </article>
  );
}
