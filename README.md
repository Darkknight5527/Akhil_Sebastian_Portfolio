# Akhil Sebastian — Portfolio Website

> Personal portfolio of Akhil Sebastian, EEE Graduate & Robotics/Embedded Systems Engineer.
> Built with vanilla HTML, CSS & JavaScript. Hosted on GitHub Pages.

🌐 **Live site:** [darkknight5527.github.io](https://darkknight5527.github.io)

---

## About

This portfolio showcases my projects, experience, and skills in Robotics, Embedded Systems, and Automated Test Engineering. It features a fully interactive 3D drone model, a neural electronics background animation, and scroll-driven reveal animations.

---

## Features

- **Neural Electronics Background** — live signal pulses firing through a PCB trace network on the hero section
- **3D Drone Model** — interactive GLB model of a Hexa Drone, drag to rotate, auto-realigns after 3 seconds
- **PCB Trace Connectors** — SVG circuit traces connecting each section like a real PCB route
- **Scroll Reveal Animations** — elements animate in as you scroll
- **Rotating Wireframe Models** — Three.js wireframe chip and robot arm per section
- **Dual Marquee Strips** — scrolling tech stack banners
- **Mobile Responsive** — hamburger nav, stacked layouts, reduced canvas intensity on small screens
- **Google Analytics** — visitor tracking integrated
- **Contact Form** — mailto-based form, no backend needed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (custom, no framework) |
| Animations | Vanilla JavaScript, Canvas API |
| 3D Models | Three.js r128, GLTFLoader, DRACOLoader |
| Fonts | Bebas Neue, Space Mono, Inter (Google Fonts) |
| Hosting | GitHub Pages |
| Analytics | Google Analytics (GA4) |

---

## Sections

| # | Section | Description |
|---|---------|-------------|
| 01 | Hero | Name, tagline, neural electronics background, CTA buttons |
| 02 | About | Photo, bio, education, current status |
| 03 | Projects | Featured 3D drone project + 3 project cards |
| 04 | Experience | Internships timeline + Leadership roles timeline |
| 05 | Skills | Category cards + rotating MCU chip + language bars |
| 06 | Contact | Message form + contact info cards |

---

## Project Structure

```
/
├── index.html          # Main portfolio file (all HTML, CSS, JS in one file)
├── resume.pdf          # Downloadable resume (update this file to refresh resume)
├── drone.glb           # Compressed 3D drone model (1.6MB, Draco compressed)
└── README.md           # This file
```

---

## Updating Content

**Resume** — just replace `resume.pdf` with your new PDF. Keep the filename the same.

**Drone model** — replace `drone.glb` with a new GLB file. Keep it under 5MB. Use [gltf-transform](https://gltf.report/) to compress if needed.

**Content changes** — edit `index.html` directly. All sections are clearly commented.

---

## Local Development

No build step needed. Just open `index.html` in a browser:

```bash
# Clone the repo
git clone https://github.com/Darkknight5527/darkknight5527.github.io

# Open in browser
open index.html
# or just double-click index.html
```

---

## Deployment

This site is deployed via **GitHub Pages**. Every push to `main` automatically updates the live site within ~1 minute.

```bash
git add .
git commit -m "your update message"
git push
```

---

## Contact

**Akhil Sebastian**
- 📧 sskzm5527@gmail.com
- 💼 [linkedin.com/in/akhilsebastian5527](https://www.linkedin.com/in/akhilsebastian5527)
- 🐙 [github.com/Darkknight5527](https://github.com/Darkknight5527)
- 📱 +91 8129107986

---

*Built with embedded passion · 2026*
