"use client";
import { useEffect, useState } from "react";
import { asset } from "@/lib/utils";

/**
 * Lazy 3D model viewer. Models are large (up to ~36 MB), so nothing is
 * downloaded until the visitor asks for it. Draco-compressed GLBs work out of the box.
 */
export function ModelViewer({ src, sizeMB, alt }: { src: string; sizeMB: number; alt: string }) {
  const [active, setActive] = useState(sizeMB < 1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active) return;
    import("@google/model-viewer").then(() => setReady(true));
  }, [active]);

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="grid-bg flex h-full w-full flex-col items-center justify-center gap-2 font-mono text-xs tracking-widest text-g uppercase transition hover:bg-g/5"
      >
        <span className="text-3xl">◈</span>
        Load 3D model
        <span className="text-muted normal-case tracking-normal">≈ {sizeMB} MB · drag to rotate</span>
      </button>
    );
  }

  if (!ready) {
    return <div className="grid-bg flex h-full w-full items-center justify-center font-mono text-xs text-g">Loading model…</div>;
  }

  return (
    // @ts-expect-error — custom element registered by @google/model-viewer
    <model-viewer
      src={asset(src)}
      alt={alt}
      camera-controls=""
      auto-rotate=""
      auto-rotate-delay="3000"
      rotation-per-second="20deg"
      shadow-intensity="0.6"
      exposure="1.1"
      interaction-prompt="none"
      style={{ background: "radial-gradient(circle at 50% 60%, rgba(0,229,122,0.08), transparent 70%)" }}
    />
  );
}
