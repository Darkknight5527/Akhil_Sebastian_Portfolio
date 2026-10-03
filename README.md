# Akhil Sebastian — Portfolio

Live: **https://darkknight5527.github.io/Akhil_Sebastian_Portfolio/**

Personal portfolio for Akhil Sebastian — EEE engineer working in semiconductor ATE (Advantest V93000), with a background in robotics, embedded systems and drones.

## Stack

- **Next.js 15** (App Router) exported as a fully static site (`output: "export"`)
- **Tailwind CSS v4**, **Motion** for animation, **Lenis** for smooth scrolling
- **Outfit** variable font (self-hosted via Fontsource)
- **@google/model-viewer** for the 3D models (Draco-compressed, decoder self-hosted in `public/draco`)

## What's on the page

| Section | Effect |
|---|---|
| Hero | Interactive PCB field: the cursor pulls signals towards it, a click fires a shockwave. Weight-shifting name that glows near the cursor, rotating "I ___" line, parallax on scroll |
| About | Paragraph that lights up word by word as you scroll, then education, languages and background |
| Projects | Sideways gallery driven by vertical scroll; image-only 3D tilt, cursor spotlight, looping art for projects without photos; detail panel with photos / 3D model |
| Experience | Two-column timeline with a scroll-following tracing beam |
| Skills | Silicon-die layout: probe sweep powers each block on, pulses run along the routing; hover/tap a block to see its skills |
| Toolkit | Two-row marquee whose speed follows scroll velocity |
| Everywhere | Chapter rail (right edge), progress bar, `prefers-reduced-motion` respected |

## Editing content

All text, links, projects, roles and skills live in [`lib/data.ts`](lib/data.ts). Change it there; the layout picks it up.

Static files live in `public/`:

```
public/
├── images/       profile photo, robot slideshow, IAM3D 2025 photo
├── models/       drone.glb, quad_25.glb, agni.glb
└── resume.pdf
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000/Akhil_Sebastian_Portfolio
npm run build      # static output in ./out
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `./out` to GitHub Pages.
One-time setting: **Repo → Settings → Pages → Source: GitHub Actions**.
