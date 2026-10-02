"use client";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { ExpandableRoles } from "@/components/ui/expandable-card";
import { INTERNSHIPS, LEADERSHIP } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-5 py-28">
      <SectionHeading index="03" title="Experience" kicker="Tap a role to expand it." />
      <TracingBeam className="pl-10 md:pl-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-5 font-mono text-xs tracking-[0.25em] text-g uppercase">// Work & Internships</h3>
            <ExpandableRoles items={INTERNSHIPS} />
          </div>
          <div>
            <h3 className="mb-5 font-mono text-xs tracking-[0.25em] text-g uppercase">// Leadership & Roles</h3>
            <ExpandableRoles items={LEADERSHIP} />
          </div>
        </div>
      </TracingBeam>
    </section>
  );
}
