# Akhil Sebastian — Portfolio (Next.js version, work in progress)

This branch is a **Next.js copy of the live HTML site**, used as the base for
adding new effects one at a time. The live site is the plain `index.html` on `main`.

- Preview: https://darkknight5527.github.io/Akhil_Sebastian_Portfolio/next/
- Side-by-side with the live site: https://darkknight5527.github.io/Akhil_Sebastian_Portfolio/compare.html

## How it's built

| Piece | What it is |
|---|---|
| `components/legacy/*.ts` | The original page markup, one file per section (nav, hero, about, projects, experience, skills, contact, overlays) |
| `app/legacy.css` | The original `<style>` block, unchanged |
| `public/legacy/*.js` | The original scripts, unchanged, loaded in the original order by `components/LegacyScripts.tsx` |
| `public/images`, `public/*.glb`, `public/resume.pdf` | Photos (previously embedded as base64), 3D models and CV |

To upgrade a section, replace its `<Part>` in `app/page.tsx` with a React component;
the rest of the page stays exactly as it was.

The deploy workflow on `main` builds this branch into `/next/`. After pushing here,
re-run "Deploy site" from the Actions tab (or push to `main`).
