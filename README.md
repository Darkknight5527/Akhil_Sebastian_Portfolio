# Akhil Sebastian — Portfolio

Live: **https://darkknight5527.github.io/Akhil_Sebastian_Portfolio/**

Personal portfolio for Akhil Sebastian — EEE engineer working in semiconductor ATE (Advantest V93000), with a background in robotics, embedded systems and drones.

## Stack

- **Next.js 15** (App Router) exported as a fully static site (`output: "export"`)
- **Tailwind CSS v4**
- **Motion** (Framer Motion) for animation
- **Aceternity UI** components: Text Hover Effect, 3D Card, Expandable Card, Tracing Beam, Moving Border
- **@google/model-viewer** for the interactive 3D models (loaded only when a visitor asks for them)

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
