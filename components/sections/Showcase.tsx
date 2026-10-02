"use client";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { asset } from "@/lib/utils";

export function Showcase() {
  return (
    <section aria-label="Showcase" className="relative w-full overflow-hidden">
      <MacbookScroll
        src={asset("/images/robot-3.jpg")}
        alt="ROS2 path planning for the VX-01 hybrid robot"
        imageClassName="object-[center_30%]"
        title={
          <span className="block">
            <span className="block font-mono text-xs tracking-[0.35em] text-g uppercase">From PCB to production test</span>
            <span className="font-bebas mt-3 block text-5xl leading-none text-white sm:text-6xl">
              Hardware that thinks. <br /> Tests that don&apos;t lie.
            </span>
          </span>
        }
        badge={<span className="rounded-md bg-g px-2 py-1 font-mono text-[10px] font-bold text-bg">VX-01 · ROS2</span>}
      />
    </section>
  );
}
