# Akhil Sebastian — Portfolio Website

[![Live Site](https://img.shields.io/badge/Live%20Site-darkknight5527.github.io-00e57a?style=for-the-badge&logo=github)](https://darkknight5527.github.io/Akhil_Sebastian_Portfolio/)
[![Made With](https://img.shields.io/badge/Made%20With-HTML%20%7C%20CSS%20%7C%20JS-blue?style=for-the-badge)]()
[![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=for-the-badge&logo=three.js)](https://threejs.org/)

Personal portfolio website for **Akhil Sebastian** — EEE graduate, ATE Test Engineer, and robotics enthusiast. Built as a single-file HTML website hosted on GitHub Pages.

---

## 🌐 Live URL

**[darkknight5527.github.io/Akhil_Sebastian_Portfolio](https://darkknight5527.github.io/Akhil_Sebastian_Portfolio/)**

---

## ✨ Features

- **Interactive 3D Models** — Three.js GLB viewers for the Hybrid Robot, IAM3D Quadcopter, and SAE Box Wing Aircraft. Drag to rotate, auto-oscillates ±30°, realigns after 3 seconds.
- **Tabbed Project Gallery** — Filter projects by: All / Robotics & Autonomy / Drone & Aerial / Hardware & PCB / Web & Software / ATE & Testing
- **Photo Slideshow + Lightbox** — 7-photo slideshow of the Hybrid Robot with fullscreen lightbox viewer, keyboard navigation (← → Esc), and dot controls.
- **Robot Easter Egg** — After 15 seconds of inactivity on the hero, a mischievous wireframe robot walks in, unplugs the screen (hero goes dark), grins, then sprints away. The hero dramatically revives piece by piece.
- **Scroll Reveal Animations** — Sections animate in as you scroll.
- **Neural PCB Background** — Animated canvas with grid-based nodes and signal pulses flowing through PCB traces.
- **Responsive** — Mobile-optimised with hamburger menu, stacked layouts, and reduced canvas intensity.
- **Google Analytics** — Integrated (G-CQ0ZYMLB0S).

---

## 📁 File Structure

```
Akhil_Sebastian_Portfolio/
├── index.html       ← Entire website (HTML + CSS + JS in one file)
├── drone.glb        ← Autonomous Hybrid Robot 3D model (~1.6MB, Draco compressed)
├── quad_25.glb      ← IAM3D 2024 Quadcopter 3D model (~880KB, Draco compressed)
├── agni.glb         ← SAE Box Wing Aircraft 3D model (~322KB, Draco compressed)
├── resume.pdf       ← Downloadable CV
└── README.md        ← This file
```

> All photos (robot slideshow, IAM3D 2025 drone) are **base64-embedded** directly inside `index.html` — no separate image files needed.

---

## 🏗️ Sections

| Section | Description |
|---------|-------------|
| **Hero** | Name, tagline, CTA buttons, stats bar, marquee strips, PCB canvas |
| **About** | Profile photo, bio, education (MACE 8.13 CGPA + Sainik School), fun facts |
| **Projects** | Tabbed cards with 3D models, photos, LinkedIn and GitHub links |
| **Experience** | Two-column timeline: Internships (left) + Leadership & Roles (right) |
| **Skills** | Six category cards + language proficiency bars |
| **Contact** | Contact form + Email / LinkedIn / GitHub / Phone cards |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 / CSS3 | Structure and styling |
| Vanilla JavaScript | Interactions, animations, 3D loaders |
| [Three.js r128](https://threejs.org/) | 3D model rendering |
| GLTFLoader + DRACOLoader | Loading and decompressing GLB models |
| Google Fonts | Bebas Neue, Space Mono, Inter |
| GitHub Pages | Hosting |
| Google Analytics | Visitor tracking |

---

## 🤖 3D Models

All models were compressed using `@gltf-transform/cli` (simplify → webp → draco):

| Model | Original | Compressed | Reduction |
|-------|----------|-----------|-----------|
| `drone.glb` (Hybrid Robot) | ~36MB | ~1.6MB | 96% |
| `quad_25.glb` (IAM3D Drone) | ~22MB | ~880KB | 96% |
| `agni.glb` (Box Wing Aircraft) | ~8.1MB | ~322KB | 96% |

---

## 🚀 Projects Featured

- **Autonomous Hybrid Robot (VX-01)** — B.Tech Thesis 2026. ROS2, Raspberry Pi 5, Pixhawk 6C, Dual GPS, LiDAR, OpenCV, Gazebo, Mission Planner.
- **IAM3D 2024** — 🏆 2nd Place Nationally. ASME EFx FISAT. 3D printed FPV quadcopter with electromagnetic payload. ANSYS + DFMEA.
- **IAM3D 2025** — 4th Place. Team Lead.
- **SAE Box Wing Aircraft (AGNI)** — Aerodynamic simulation to physical manufacturing. Solidworks, XFLR5, Ansys CFD.
- **8×8×8 LED Cube** — Custom PCB design. EasyEDA, Arduino.
- **MathWorks MiniDrone** — Simulink models and image processing control systems.
- **PrintForge** — Full-stack 3D printing services web platform.
- **AnoraLabs ATE** — Embedded hardware validation and protocol analysis.

---

## 📬 Contact

- **Email:** sskzm5527@gmail.com
- **LinkedIn:** [linkedin.com/in/akhilsebastian5527](https://www.linkedin.com/in/akhilsebastian5527)
- **GitHub:** [github.com/Darkknight5527](https://github.com/Darkknight5527)

---

*Built with embedded passion · Akhil Sebastian · 2026*
