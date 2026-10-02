"use client";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/utils";

type MV = HTMLElement & { cameraOrbit: string; interactionPrompt: string };

/**
 * 3D model viewer: swings gently ±30° around the front view instead of spinning 360°.
 * When the visitor drags it, the swing pauses; 3 s after they let go it realigns to the front.
 */
export function ModelViewer({ src, alt, phi = 72 }: { src: string; alt: string; phi?: number }) {
  const ref = useRef<MV>(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // model-viewer reads this global at import time, so set it first (self-hosted decoder, no Google CDN).
    const w = window as unknown as { ModelViewerElement?: Record<string, unknown> };
    w.ModelViewerElement = { ...(w.ModelViewerElement ?? {}), dracoDecoderLocation: asset("/draco/") };
    import("@google/model-viewer").then(() => setReady(true));
  }, []);

  useEffect(() => {
    const mv = ref.current;
    if (!ready || !mv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let pausedUntil = 0;
    let dragging = false;
    let phase = 0;
    let last = performance.now();

    const onLoad = () => setLoaded(true);
    const down = () => { dragging = true; };
    const up = () => { if (dragging) { dragging = false; pausedUntil = performance.now() + 3000; } };

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!dragging && now > pausedUntil && !reduce) {
        phase += dt * 0.0006; // ≈ one full swing every ~10 s
        mv.cameraOrbit = `${(Math.sin(phase) * 30).toFixed(2)}deg ${phi}deg auto`;
      }
      raf = requestAnimationFrame(tick);
    };
    mv.addEventListener("load", onLoad);
    mv.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      mv.removeEventListener("load", onLoad);
      mv.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [ready, phi]);

  return (
    <div className="relative h-full w-full">
      {ready && (
        // @ts-expect-error — custom element registered by @google/model-viewer
        <model-viewer
          ref={ref}
          src={asset(src)}
          alt={alt}
          camera-controls=""
          camera-orbit={`0deg ${phi}deg auto`}
          interpolation-decay="120"
          disable-zoom=""
          shadow-intensity="0.7"
          exposure="1.25"
          environment-image="neutral"
          interaction-prompt="none"
          style={{ background: "radial-gradient(circle at 50% 60%, rgba(0,229,122,0.10), transparent 70%)" }}
        />
      )}
      {!loaded && (
        <div className="grid-bg pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-xs tracking-widest text-g uppercase">
          Loading model…
        </div>
      )}
      {loaded && (
        <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] tracking-widest text-g/80 uppercase">● Drag to rotate</span>
      )}
    </div>
  );
}
