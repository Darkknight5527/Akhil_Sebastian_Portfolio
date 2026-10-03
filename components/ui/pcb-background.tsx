"use client";
import { useEffect, useRef } from "react";

/**
 * Interactive PCB field (based on the original portfolio background).
 * Grid-spread nodes (ICs, vias, junctions) joined by elbow-routed traces, with
 * signal pulses that travel, light up nodes and fork.
 * - The cursor acts like a charge: nearby nodes light up, traces route to it,
 *   and signals are steered towards it.
 * - Click fires a shockwave that lights every node it passes and launches pulses.
 * Pauses when off screen; static under prefers-reduced-motion.
 */
type Node = { x: number; y: number; r: number; type: "ic" | "via" | "junction"; glow: number; glowDecay: number };
type Edge = { from: number; to: number };
type Pulse = { edge: Edge; t: number; speed: number; size: number; brightness: number };
type Shock = { x: number; y: number; r: number; life: number };

export function PcbField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0;
    let nodes: Node[] = [], edges: Edge[] = [], pulses: Pulse[] = [], adj: number[][] = [];
    const shocks: Shock[] = [];
    const mouse = { x: -9999, y: -9999, on: false };
    let raf = 0, running = false;

    const mkNode = (x: number, y: number): Node => {
      const t = Math.random();
      return { x, y, r: t > 0.85 ? 5 : t > 0.6 ? 3 : 2, type: t > 0.85 ? "ic" : t > 0.6 ? "via" : "junction", glow: 0, glowDecay: 0.025 + Math.random() * 0.025 };
    };
    const launch = (e: Edge, t = 0, boost = 1) =>
      pulses.push({ edge: e, t, speed: (0.004 + Math.random() * 0.012) * boost, size: 2.5 + Math.random() * 2.5, brightness: 0.7 + Math.random() * 0.3 });
    const spawnPulse = () => edges.length && launch(edges[(Math.random() * edges.length) | 0], Math.random());
    const dir = (k: number, from: number): Edge => (edges[k].from === from ? edges[k] : { from, to: edges[k].from });

    const build = () => {
      const mobile = W < 769;
      nodes = []; edges = []; pulses = [];
      const cols = Math.max(2, Math.floor(W / (mobile ? 130 : 105)));
      const rows = Math.max(2, Math.floor(H / (mobile ? 130 : 105)));
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
      for (let i = 0; i < Math.floor(cols * rows * (mobile ? 0.25 : 0.35)); i++) spawnPulse();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.clientWidth; H = c.clientHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduce) draw();
    };

    const routePts = (ax: number, ay: number, bx: number, by: number): [number, number][] => {
      if (Math.abs(bx - ax) > Math.abs(by - ay)) {
        const mx = ax + (bx - ax) * 0.5;
        return [[ax, ay], [mx, ay], [mx, by], [bx, by]];
      }
      const my = ay + (by - ay) * 0.5;
      return [[ax, ay], [ax, my], [bx, my], [bx, by]];
    };
    const routePos = (a: Node, b: Node, t: number): [number, number] => {
      const p = routePts(a.x, a.y, b.x, b.y);
      const s = Math.min(Math.floor(t * 3), 2), st = t * 3 - s;
      return [p[s][0] + (p[s + 1][0] - p[s][0]) * st, p[s][1] + (p[s + 1][1] - p[s][1]) * st];
    };
    const G = (a: number) => `rgba(0,229,122,${a})`;
    const md = (n: { x: number; y: number }) => (mouse.on ? Math.hypot(n.x - mouse.x, n.y - mouse.y) : 1e9);

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.lineWidth = 0.8;
      ctx!.strokeStyle = G(0.09);
      ctx!.beginPath();
      for (const e of edges) {
        const a = nodes[e.from], b = nodes[e.to];
        const p = routePts(a.x, a.y, b.x, b.y);
        ctx!.moveTo(p[0][0], p[0][1]);
        for (let k = 1; k < 4; k++) ctx!.lineTo(p[k][0], p[k][1]);
      }
      ctx!.stroke();

      // Cursor "charge": route traces from the cursor to the nearest nodes.
      if (mouse.on) {
        const near = nodes.map((n, i) => ({ i, d: md(n) })).filter((o) => o.d < 170).sort((a, b) => a.d - b.d).slice(0, 7);
        for (const { i, d } of near) {
          const n = nodes[i];
          const p = routePts(mouse.x, mouse.y, n.x, n.y);
          ctx!.strokeStyle = G((1 - d / 170) * 0.65);
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(p[0][0], p[0][1]);
          for (let k = 1; k < 4; k++) ctx!.lineTo(p[k][0], p[k][1]);
          ctx!.stroke();
        }
        const g = ctx!.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 110);
        g.addColorStop(0, "rgba(0,229,122,0.16)");
        g.addColorStop(1, "rgba(0,229,122,0)");
        ctx!.fillStyle = g;
        ctx!.fillRect(mouse.x - 110, mouse.y - 110, 220, 220);
        ctx!.beginPath(); ctx!.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(190,255,225,0.9)"; ctx!.fill();
      }

      for (const n of nodes) {
        const a = (n.type === "ic" ? 0.5 : n.type === "via" ? 0.4 : 0.25) + n.glow * 0.8;
        if (n.type === "ic") {
          const s = 7;
          ctx!.strokeStyle = G(a); ctx!.lineWidth = 0.9;
          ctx!.strokeRect(n.x - s, n.y - s / 2, s * 2, s);
          ctx!.strokeStyle = G(a * 0.7); ctx!.lineWidth = 0.7;
          ctx!.beginPath();
          for (let p = 0; p < 3; p++) {
            const px = n.x - s + p * (s * 2 / 2.5) + 2;
            ctx!.moveTo(px, n.y - s / 2); ctx!.lineTo(px, n.y - s / 2 - 4);
            ctx!.moveTo(px, n.y + s / 2); ctx!.lineTo(px, n.y + s / 2 + 4);
          }
          ctx!.stroke();
        } else if (n.type === "via") {
          ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r + 2, 0, Math.PI * 2);
          ctx!.strokeStyle = G(a); ctx!.lineWidth = 0.8; ctx!.stroke();
          ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r - 0.5, 0, Math.PI * 2);
          ctx!.fillStyle = G(a * 0.6); ctx!.fill();
        } else {
          ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx!.fillStyle = G(a); ctx!.fill();
        }
        if (n.glow > 0.1) {
          ctx!.beginPath(); ctx!.arc(n.x, n.y, (n.r + 6) * (1 + n.glow * 0.5), 0, Math.PI * 2);
          ctx!.fillStyle = G(n.glow * 0.14); ctx!.fill();
        }
      }

      for (const p of pulses) {
        const a = nodes[p.edge.from], b = nodes[p.edge.to];
        for (let i = 7; i >= 1; i--) {
          const [tx, ty] = routePos(a, b, Math.max(0, p.t - i * 0.025));
          ctx!.beginPath(); ctx!.arc(tx, ty, p.size * (1 - i / 8) * 0.7, 0, Math.PI * 2);
          ctx!.fillStyle = G(p.brightness * (1 - i / 8) * 0.6); ctx!.fill();
        }
        const [px, py] = routePos(a, b, p.t);
        ctx!.beginPath(); ctx!.arc(px, py, p.size * 2.2, 0, Math.PI * 2);
        ctx!.fillStyle = G(p.brightness * 0.15); ctx!.fill();
        ctx!.beginPath(); ctx!.arc(px, py, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(180,255,220,${p.brightness})`; ctx!.fill();
      }

      for (const s of shocks) {
        ctx!.lineWidth = 1.4;
        ctx!.strokeStyle = G(s.life * 0.55);
        ctx!.beginPath(); ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx!.stroke();
        ctx!.lineWidth = 0.8;
        ctx!.strokeStyle = G(s.life * 0.25);
        ctx!.beginPath(); ctx!.arc(s.x, s.y, s.r * 0.82, 0, Math.PI * 2); ctx!.stroke();
      }
    }

    function update() {
      // nodes near the cursor light up
      for (const n of nodes) {
        const d = md(n);
        if (d < 180) n.glow = Math.max(n.glow, (1 - d / 180) * 0.9);
        n.glow = Math.max(0, n.glow - n.glowDecay);
      }

      // shockwaves light nodes as they pass and launch pulses outward
      for (const s of shocks) {
        const prev = s.r;
        s.r += 7;
        s.life *= 0.955;
        nodes.forEach((n, i) => {
          const d = Math.hypot(n.x - s.x, n.y - s.y);
          if (d >= prev && d < s.r) {
            n.glow = 1;
            if (Math.random() < 0.3 * s.life && adj[i].length) {
              const out = adj[i].map((k) => dir(k, i)).sort((e1, e2) => Math.hypot(nodes[e2.to].x - s.x, nodes[e2.to].y - s.y) - Math.hypot(nodes[e1.to].x - s.x, nodes[e1.to].y - s.y));
              launch(out[0], 0, 1.6);
            }
          }
        });
      }
      while (shocks.length && shocks[0].life < 0.05) shocks.shift();

      // the cursor keeps drawing fresh signals towards itself
      if (mouse.on && Math.random() < 0.25) {
        const cand = nodes.map((n, i) => ({ i, d: md(n) })).filter((o) => o.d > 60 && o.d < 280);
        if (cand.length) {
          const { i } = cand[(Math.random() * cand.length) | 0];
          const best = adj[i].map((k) => dir(k, i)).sort((e1, e2) => md(nodes[e1.to]) - md(nodes[e2.to]))[0];
          if (best) launch(best, 0, 1.4);
        }
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const [px, py] = routePos(nodes[p.edge.from], nodes[p.edge.to], p.t);
        const near = mouse.on && Math.hypot(px - mouse.x, py - mouse.y) < 220;
        p.t += p.speed * (near ? 1.8 : 1);
        if (p.t < 1) continue;
        const dest = p.edge.to;
        nodes[dest].glow = 1;
        const out = adj[dest];
        if (out.length && Math.random() > 0.2) {
          const options = out.map((k) => dir(k, dest));
          // steer towards the cursor when it's close
          let next = options[(Math.random() * options.length) | 0];
          if (mouse.on && md(nodes[dest]) < 340 && Math.random() < 0.75) next = options.sort((e1, e2) => md(nodes[e1.to]) - md(nodes[e2.to]))[0];
          pulses.push({ edge: next, t: 0, speed: 0.004 + Math.random() * 0.012, size: p.size * (0.8 + Math.random() * 0.4), brightness: Math.min(1, p.brightness * (0.85 + Math.random() * 0.2)) });
          if (Math.random() > 0.5 && options.length > 1) {
            const e2 = options[(Math.random() * options.length) | 0];
            pulses.push({ edge: e2, t: 0, speed: 0.004 + Math.random() * 0.01, size: p.size * 0.7, brightness: p.brightness * 0.7 });
          }
        }
        pulses.splice(i, 1);
      }
      const minP = W < 769 ? 12 : 30, maxP = W < 769 ? 60 : 180;
      while (pulses.length < minP) spawnPulse();
      if (pulses.length > maxP) pulses.splice(0, pulses.length - maxP);
    }

    function loop() {
      if (!running) return;
      update();
      draw();
      raf = requestAnimationFrame(loop);
    }

    const inside = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom ? r : null;
    };
    const onMove = (e: PointerEvent) => {
      const r = inside(e);
      if (!r || e.pointerType === "touch") { mouse.on = false; return; }
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    };
    const onLeave = () => { mouse.on = false; };
    const onDown = (e: PointerEvent) => {
      const r = inside(e);
      if (!r || (e.target as HTMLElement).closest("a,button")) return;
      shocks.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, life: 1 });
    };

    const io = new IntersectionObserver(([en]) => {
      const vis = en.isIntersecting && !document.hidden;
      if (vis && !running && !reduce) { running = true; loop(); }
      else if (!vis) { running = false; cancelAnimationFrame(raf); }
    });

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(c);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerdown", onDown);
      io.observe(c);
    }
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
