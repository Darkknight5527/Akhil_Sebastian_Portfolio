import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Prefix a public asset path with the GitHub Pages base path. */
export const asset = (p: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p.startsWith("/") ? p : `/${p}`}`;

/**
 * Map v from [a, b] onto [from, to], clamped. Use inside a *function* useTransform
 * (`useTransform(p, v => lerp(...))`) so Motion doesn't hand ranges to the
 * browser scroll timeline, which mis-maps them.
 */
export const lerp = (v: number, [a, b]: [number, number], [from, to]: [number, number]) =>
  from + (to - from) * Math.min(1, Math.max(0, (v - a) / (b - a)));

export const EASE = [0.22, 1, 0.36, 1] as const;
