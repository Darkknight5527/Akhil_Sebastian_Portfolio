"use client";
import { useMemo, useState } from "react";
import { ExpandableCards } from "@/components/ui/expandable-card";
import { CATEGORIES, PROJECTS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const items = useMemo(() => (cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === cat)), [cat]);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-28">
      <SectionHeading index="02" title="Projects" kicker="Tap any card for details, photos and interactive 3D models." />
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
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
      <ExpandableCards key={cat} items={items} />
    </section>
  );
}
