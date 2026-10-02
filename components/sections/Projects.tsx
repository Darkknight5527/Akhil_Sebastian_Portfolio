"use client";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ProjectModal } from "@/components/ui/project-modal";
import { CATEGORIES, PROJECTS, type Project } from "@/lib/data";
import { asset, cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

function ProjectCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const media = p.images?.length ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset(p.images[0])} alt="" className="h-full w-full rounded-xl object-cover" />
  ) : (
    <div className="grid-bg flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-g/15 via-transparent to-transparent">
      <span className="text-5xl drop-shadow-[0_0_18px_rgba(0,229,122,0.4)]">{p.icon}</span>
    </div>
  );

  return (
    <CardContainer containerClassName="h-full" className="h-full w-full">
      <CardBody
        className={cn(
          "group/card relative flex h-full w-full flex-col rounded-2xl border border-white/8 bg-bg2 p-5 transition-colors hover:border-g/50 hover:shadow-[0_0_40px_rgba(0,229,122,0.12)]",
          p.featured && "lg:flex-row lg:gap-6",
        )}
      >
        <CardItem translateZ={90} rotateX={4} className={cn("relative w-full", p.featured ? "aspect-[4/3] lg:w-[55%] lg:shrink-0" : "aspect-[16/10]")}>
          {media}
          <span className="absolute top-3 left-3 rounded-full border border-g/30 bg-bg/85 px-2.5 py-1 font-mono text-[10px] tracking-wider text-g uppercase backdrop-blur">{p.badge}</span>
          {p.model && <span className="absolute top-3 right-3 rounded-full bg-bg/85 px-2 py-1 font-mono text-[10px] text-white/80 backdrop-blur">◈ 3D</span>}
        </CardItem>

        <div className={cn("flex flex-1 flex-col", p.featured ? "mt-5 lg:mt-0 lg:justify-center" : "mt-5")}>
          {p.featured && <CardItem translateZ={30} className="mb-3 rounded-full border border-g/30 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-g uppercase">★ Featured project</CardItem>}
          <CardItem translateZ={55} as="h3" className={cn("font-bebas text-white", p.featured ? "text-4xl" : "text-2xl")}>{p.title}</CardItem>
          <CardItem translateZ={45} className="font-mono text-[11px] tracking-wider text-g/85 uppercase">{p.subtitle}</CardItem>
          <CardItem translateZ={35} as="p" className={cn("mt-3 text-sm text-white/65", p.featured ? "line-clamp-5" : "line-clamp-2")}>{p.description}</CardItem>
          <div className="mt-auto flex items-center justify-between pt-5">
            <CardItem translateZ={20} className="font-mono text-[10px] tracking-widest text-muted uppercase">{p.date}</CardItem>
            <CardItem translateZ={40} as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onOpen(); }} className="rounded-full bg-g px-4 py-2 font-mono text-[10px] font-bold tracking-widest text-bg uppercase transition hover:bg-white">
              Explore →
            </CardItem>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}

export function Projects() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const items = useMemo(() => (cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === cat)), [cat]);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-28">
      <SectionHeading index="02" title="Projects" kicker="Move your cursor over a card to tilt it. Hit Explore for photos, details and interactive 3D models." />
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-[11px] tracking-wider uppercase transition",
              cat === c ? "border-g bg-g text-bg" : "border-white/10 text-white/60 hover:border-g/50 hover:text-white",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.ul layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((p) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(p)}
              className={cn("cursor-pointer", p.featured && cat === "All" && "sm:col-span-2 lg:col-span-3")}
            >
              <ProjectCard p={p} onOpen={() => setOpen(p)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <ProjectModal project={open} onClose={close} />
    </section>
  );
}
