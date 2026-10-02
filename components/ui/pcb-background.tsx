"use client";
import { useEffect, useRef } from "react";

/**
 * Neural PCB background — ported from the original portfolio.
 * Grid-spread nodes (ICs, vias, junctions) joined by elbow-routed traces,
 * with glowing signal pulses that travel, light up nodes, and fork.
 */
type Node = { x: number; y: number; r: number; type: "ic" | "via" | "junction"; glow: number; glowDecay: number };
type Edge = { from: number; to: number };
type Pulse = { edge: Edge; t: number; speed: number; size: number; brightness: number };

export function PcbBackground({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1;
    let nodes: Node[] = [], edges: Edge[] = [], pulses: Pulse[] = [];
    let adj: number[][] = [];
    let raf = 0, visible = true;

    const mkNode = (x: number, y: number): Node => {
      const t = Math.random();
      return { x, y, r: t > 0.85 ? 5 : t > 0.6 ? 3 : 2, type: t > 0.85 ? "ic" : t > 0.6 ? "via" : "junction", glow: 0, glowDecay: 0.025 + Math.random() * 0.025 };
    };

    const spawnPulse = () => {
      if (!edges.length) return;
      pulses.push({ edge: edges[(Math.random() * edges.length) | 0], t: Math.random(), speed: 0.004 + Math.random() * 0.012, size: 2.5 + Math.random() * 2.5, brightness: 0.7 + Math.random() * 0.3 });
    };

    const build = () => {
      const mobile = W < 769;
      nodes = []; edges = []; pulses = [];
      const cols = Math.max(2, Math.floor(W / (mobile ? 140 : 110)));
      const rows = Math.max(2, Math.floor(H / (mobile ? 140 : 110)));
      const cw = W / cols, ch = H / rows;
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) {
          nodes.push(mkNode(i * cw + cw * 0.15 + Math.random() * cw * 0.7, j * ch + ch * 0.15 + Math.random() * ch * 0.7));
          if (Math.random() > 0.55) nodes.push(mkNode(i * cw + cw * 0.15 + Math.random() * cw * 0.7, j * ch + ch * 0.15 + Math.random() * ch * 0.7));
        }
      const maxDist = Math.min(cw, ch) * 2.8;
      for (let i = 0; i < nodes.length; i++) {
        const near: { j: number; d: number }[] = [];
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[j].x - nodes[i].x, nodes[j].y - nodes[i].y);
          if (d < maxDist) near.push({ j, d });
        }
        near.sort((a, b) => a.d - b.d).slice(0, 2 + ((Math.random() * 3) | 0)).forEach(({ j }) => edges.push({ from: i, to: j }));
      }
      adj = nodes.map(() => []);
      edges.forEach((e, k) => { adj[e.from].push(k); adj[e.to].push(k); });
      const seed = Math.floor(cols * rows * (mobile ? 0.25 : 0.35));
      for (let i = 0; i < seed; i++) spawnPulse();
    };

    const resize = () => {
      const r = c.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const routePts = (a: Node, b: Node): [number, number][] => {
      if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y)) {
        const mx = a.x + (b.x - a.x) * 0.5;
        return [[a.x, a.y], [mx, a.y], [mx, b.y], [b.x, b.y]];
      }
      const my = a.y + (b.y - a.y) * 0.5;
      return [[a.x, a.y], [a.x, my], [b.x, my], [b.x, b.y]];
    };
    const routePos = (a: Node, b: Node, t: number): [number, number] => {
      const p = routePts(a, b);
      const s = Math.min(Math.floor(t * 3), 2), st = t * 3 - s;
      return [p[s][0] + (p[s + 1][0] - p[s][0]) * st, p[s][1] + (p[s + 1][1] - p[s][1]) * st];
    };

    const G = (a: number) => `rgba(0,229,122,${a})`;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = G(0.09);
      ctx.beginPath();
      for (const e of edges) {
        const p = routePts(nodes[e.from], nodes[e.to]);
        ctx.moveTo(p[0][0], p[0][1]);
        for (let k = 1; k < 4; k++) ctx.lineTo(p[k][0], p[k][1]);
      }
      ctx.stroke();

      for (const n of nodes) {
        const a = (n.type === "ic" ? 0.5 : n.type === "via" ? 0.4 : 0.25) + n.glow * 0.8;
        if (n.type === "ic") {
          const s = 7;
          ctx.strokeStyle = G(a); ctx.lineWidth = 0.9;
          ctx.strokeRect(n.x - s, n.y - s / 2, s * 2, s);
          ctx.strokeStyle = G(a * 0.7); ctx.lineWidth = 0.7;
          ctx.beginPath();
          for (let p = 0; p < 3; p++) {
            const px = n.x - s + p * (s * 2 / 2.5) + 2;
            ctx.moveTo(px, n.y - s / 2); ctx.lineTo(px, n.y - s / 2 - 4);
            ctx.moveTo(px, n.y + s / 2); ctx.lineTo(px, n.y + s / 2 + 4);
          }
          ctx.stroke();
        } else if (n.type === "via") {
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 2, 0, Math.PI * 2);
          ctx.strokeStyle = G(a); ctx.lineWidth = 0.8; ctx.stroke();
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r - 0.5, 0, Math.PI * 2);
          ctx.fillStyle = G(a * 0.6); ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = G(a); ctx.fill();
        }
        if (n.glow > 0.1) {
          ctx.beginPath(); ctx.arc(n.x, n.y, (n.r + 6) * (1 + n.glow * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = G(n.glow * 0.14); ctx.fill();
          n.glow = Math.max(0, n.glow - n.glowDecay);
        }
      }

      for (const p of pulses) {
        const a = nodes[p.edge.from], b = nodes[p.edge.to];
        for (let i = 7; i >= 1; i--) {
          const [tx, ty] = routePos(a, b, Math.max(0, p.t - i * 0.025));
          ctx.beginPath(); ctx.arc(tx, ty, p.size * (1 - i / 8) * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = G(p.brightness * (1 - i / 8) * 0.6); ctx.fill();
        }
        const [px, py] = routePos(a, b, p.t);
        ctx.beginPath(); ctx.arc(px, py, p.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = G(p.brightness * 0.15); ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,255,220,${p.brightness})`; ctx.fill();
      }
    };

    const update = () => {
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t < 1) continue;
        const dest = p.edge.to;
        nodes[dest].glow = 1;
        const out = adj[dest];
        if (out.length && Math.random() > 0.2) {
          const go = (k: number, sizeK: number, brK: number) => {
            const e = edges[k];
            pulses.push({ edge: e.from === dest ? e : { from: e.to, to: e.from }, t: 0, speed: 0.004 + Math.random() * 0.012, size: p.size * sizeK, brightness: Math.min(1, p.brightness * brK) });
          };
          go(out[(Math.random() * out.length) | 0], 0.8 + Math.random() * 0.4, 0.85 + Math.random() * 0.2);
          if (Math.random() > 0.5 && out.length > 1) go(out[(Math.random() * out.length) | 0], 0.7, 0.7);
        }
        pulses.splice(i, 1);
      }
      const minP = W < 769 ? 12 : 30, maxP = W < 769 ? 50 : 140;
      while (pulses.length < minP) spawnPulse();
      if (pulses.length > maxP) pulses.splice(0, pulses.length - maxP);
    };

    const loop = () => {
      if (visible) { update(); draw(); }
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduce) draw(); else loop();

    const ro = new ResizeObserver(() => resize());
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(c);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
