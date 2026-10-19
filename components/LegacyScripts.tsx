"use client";
import { useEffect } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// The original page's scripts, in their original order.
const SCRIPTS = [
  `${BASE}/legacy/contact.js`,
  `${BASE}/legacy/hero-field.js`, // home-page background (effects-model version)
  `${BASE}/legacy/name-effect.js`, // name effect (effects-model version)
  `${BASE}/legacy/scroll-beam.js`, // tracing-beam scroll indicator
  `${BASE}/legacy/lang-cards.js`, // languages row
  `${BASE}/legacy/send-border.js`, // running light round the Send button
  `${BASE}/legacy/project-cards.js`, // expandable project cards
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
  "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js",
  "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js",
  `${BASE}/legacy/sweeper-3d.js`, // 3D sweeper robot for the easter egg
  `${BASE}/legacy/main.js`,
];

function load(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

/**
 * Runs the original scripts after the page is on screen.
 * They were written to start on the window "load" event, which has already
 * happened by now — so while they load, any "load" listener runs straight away.
 */
export function LegacyScripts() {
  useEffect(() => {
    const w = window as unknown as { __legacyStarted?: boolean };
    if (w.__legacyStarted) return;
    w.__legacyStarted = true;

    const original = window.addEventListener;
    window.addEventListener = function (this: Window, type: string, fn: EventListenerOrEventListenerObject, opts?: boolean | AddEventListenerOptions) {
      if (type === "load" && document.readyState === "complete") {
        setTimeout(() => (typeof fn === "function" ? fn.call(window, new Event("load")) : fn.handleEvent(new Event("load"))), 0);
        return;
      }
      return original.call(this, type, fn, opts);
    } as typeof window.addEventListener;

    (async () => {
      try {
        for (const src of SCRIPTS) await load(src);
      } catch (e) {
        console.error(e);
      } finally {
        window.addEventListener = original;
      }
    })();
  }, []);
  return null;
}
