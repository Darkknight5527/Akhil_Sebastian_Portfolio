// All site content lives here so it can be edited without touching layout code.

export const LINKS = {
  email: "sskzm5527@gmail.com",
  linkedin: "https://www.linkedin.com/in/akhilsebastian5527",
  linkedinLabel: "linkedin.com/in/akhilsebastian5527",
  github: "https://github.com/Darkknight5527",
  githubLabel: "github.com/Darkknight5527",
  phone: "+918129107986",
  phoneLabel: "+91 8129107986",
};

export const NAV = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export const STATS = [
  { value: "8.13", label: "CGPA / 10" },
  { value: "5+", label: "Projects built" },
  { value: "2nd", label: "IAM3D National" },
  { value: "3×", label: "Internships" },
  { value: "180", label: "Days · ATE" },
];

export const MARQUEE = [
  "ROS2", "Gazebo", "Embedded Systems", "PCB Design", "Drone Design", "Autonomous Robotics",
  "OpenCV", "ATE", "Advantest V93K", "Solidworks", "Betaflight", "Sensor Fusion", "Raspberry Pi",
];

export const EDUCATION = [
  { degree: "B.Tech — EEE", school: "Mar Athanasius College of Engineering", years: "2022 – 2026", score: "8.13 CGPA" },
  { degree: "Senior & Secondary School", school: "Sainik School Kazhakootam, CBSE", years: "2014 – 2021", score: "96.8%" },
];

export const ABOUT = {
  bio: "I'm an Electrical and Electronics Engineering graduate who fell in love with machines that think, move, and adapt. From designing custom PCBs to building autonomous robots that navigate real terrain, I chase the intersection of hardware and intelligence. Currently I work as an ATE Test Engineer at Anora Instrumentation, on ATE, embedded debugging and protocol analysis on real industrial hardware.",
  currently: [
    "ATE Test Engineer at Anora Instrumentation — test development and debug on the Advantest V93000, circuit-level testing and protocol analysis",
    "Completed B.Tech thesis — autonomous hybrid robot for multi-terrain navigation using ROS2, OpenCV and sensor fusion",
  ],
  beyond: [
    { icon: "✈️", text: "Trained with an aerospace team from Germany" },
    { icon: "🏆", text: "2nd nationally in the IAM3D drone competition" },
    { icon: "🎌", text: "Learning Japanese — fascinated by robotics culture" },
    { icon: "⚡", text: "IEEE PES SBC Chair — led events & workshops" },
  ],
};

export type ProjectCategory = "Robotics & Autonomy" | "Drone & Aerial" | "Hardware & PCB" | "Web & Software" | "ATE & Testing";

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  date: string;
  category: ProjectCategory;
  description: string;
  tags: string[];
  images?: string[];
  model?: { src: string; sizeMB: number };
  icon: string;
  links?: { label: string; href: string }[];
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "hybrid-robot",
    title: "Autonomous Hybrid Robot",
    subtitle: "Multi-terrain Navigation · VX-01",
    badge: "B.Tech Thesis",
    date: "2026",
    category: "Robotics & Autonomy",
    featured: true,
    description:
      "Designed and developed a fully autonomous hybrid robot capable of navigating multiple terrains using sensor fusion, computer vision, and adaptive locomotion. Integrates a Pixhawk 6C flight controller with dual GPS for precision positioning, a full ROS2 navigation stack with LiDAR-ultrasonic fusion, and real-time path planning on Raspberry Pi 5. Mission Planner used for autonomous waypoint programming and failsafe configuration.",
    tags: ["ROS2", "Raspberry Pi 5", "Pixhawk 6C", "Mission Planner", "Dual GPS", "OpenCV", "Gazebo", "LiDAR", "Python"],
    images: [0, 1, 2, 3, 4, 5, 6].map((i) => `/images/robot-${i}.jpg`),
    model: { src: "/models/drone.glb", sizeMB: 36 },
    icon: "🤖",
    links: [
      { label: "GitHub", href: "https://github.com/Darkknight5527/VX-01" },
      { label: "LinkedIn", href: "https://www.linkedin.com/posts/akhilsebastian5527_robotics-ros2-autonomoussystems-ugcPost-7464615490557210624-U2Gm/" },
    ],
  },
  {
    id: "iam3d-2024",
    title: "3D Printed Cargo Drone",
    subtitle: "ASME IAM3D 2024",
    badge: "🏆 2nd Place · National",
    date: "Sep 2024",
    category: "Drone & Aerial",
    description:
      "Designed and assembled an FPV quadcopter with a 3D printed frame, modular architecture and a custom electromagnetic payload mechanism. Performed ANSYS structural analysis, thrust calculations and a full DFMEA. Secured 2nd place nationally at ASME EFx FISAT 2024.",
    tags: ["Solidworks", "Betaflight", "ANSYS", "SpeedyBee FC", "3D Printing", "DFMEA"],
    model: { src: "/models/quad_25.glb", sizeMB: 22 },
    icon: "🚁",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/posts/akhilsebastian5527_iam3d-efxcompetition-fpvdrone-activity-7248295469443940352-t7Ep/" },
    ],
  },
  {
    id: "iam3d-2025",
    title: "3D Printed Drone",
    subtitle: "ASME IAM3D 2025",
    badge: "4th Place · Team Lead",
    date: "2025",
    category: "Drone & Aerial",
    description:
      "Led the team for a second IAM3D competition. Directed drone design, assembly and flight controller configuration. Secured 4th place nationally.",
    tags: ["Team Lead", "Solidworks", "Betaflight", "3D Printing", "iNav"],
    images: ["/images/iam3d-2025.jpg"],
    icon: "🛸",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/posts/akhilsebastian5527_asmemace-efxindia2025-iam3d-activity-7315641575416504320-hY_3/" },
    ],
  },
  {
    id: "agni",
    title: "Box Wing Aircraft — AGNI",
    subtitle: "SAE Drone Design Challenge",
    badge: "SAE · 2025",
    date: "Mar 2025",
    category: "Drone & Aerial",
    description:
      "Designed, simulated and manufactured a functional box wing aircraft. Full workflow from aerodynamic simulation to physical manufacturing.",
    tags: ["Solidworks", "XFLR5", "Ansys CFD", "3D Printing"],
    model: { src: "/models/agni.glb", sizeMB: 0.3 },
    icon: "✈️",
  },
  {
    id: "led-cube",
    title: "8×8×8 LED Cube",
    subtitle: "Custom PCB Design",
    badge: "Hardware",
    date: "Apr 2024",
    category: "Hardware & PCB",
    description:
      "Designed and assembled an interactive 512-LED cube with a custom PCB for matrix control and animation display. Full end-to-end hardware design.",
    tags: ["EasyEDA", "Arduino IDE", "PCB Design", "Soldering"],
    icon: "🧊",
  },
  {
    id: "minidrone",
    title: "MiniDrone Control",
    subtitle: "MathWorks Competition",
    badge: "MathWorks",
    date: "Jul 2025",
    category: "Drone & Aerial",
    description:
      "Designed Simulink models and control systems for autonomous drone navigation using image processing and MATLAB.",
    tags: ["MATLAB", "Simulink", "Image Processing", "Control Systems"],
    icon: "🎯",
  },
  {
    id: "printforge",
    title: "PrintForge",
    subtitle: "3D Printing Services Platform",
    badge: "Web",
    date: "2025",
    category: "Web & Software",
    description:
      "Web platform for a 3D printing services business — order management, pricing calculator and service showcase. Built end-to-end from design to deployment.",
    tags: ["HTML", "CSS", "JavaScript", "Web Design"],
    icon: "🖨️",
  },
  {
    id: "ate",
    title: "Embedded Hardware Validation",
    subtitle: "Anora Instrumentation · ATE",
    badge: "Industry",
    date: "Feb 2026",
    category: "ATE & Testing",
    description:
      "ATE development and debug on the Advantest V93K platform. Parametric testing, functional test program development, and pattern-based validation using STIL, VCD and WGL formats.",
    tags: ["Advantest V93K", "ATE", "Protocol Analysis", "Circuit Testing", "Debugging"],
    icon: "🔬",
  },
];

export const CATEGORIES: ("All" | ProjectCategory)[] = [
  "All", "Robotics & Autonomy", "Drone & Aerial", "Hardware & PCB", "Web & Software", "ATE & Testing",
];

export type Role = { title: string; org: string; when: string; description: string; tags?: string[] };

export const INTERNSHIPS: Role[] = [
  {
    title: "ATE Test Engineer",
    org: "Anora Instrumentation · India",
    when: "Feb 2026 – present",
    description:
      "ATE development and debug on the Advantest V93K platform. Parametric testing, functional test program development, and pattern-based validation using STIL, VCD and WGL formats. Circuit-level debugging and protocol analysis for industrial embedded products.",
    tags: ["Advantest V93K", "ATE", "Protocol Analysis", "Circuit Testing", "Hardware Validation"],
  },
  {
    title: "Aircraft Design & Testing Trainee",
    org: "Feynman Aerospace · Germany",
    when: "Jan 2025 · 30 days",
    description:
      "Design and performance evaluation of aircraft systems. Hands-on testing, component analysis, and exposure to industry-standard protocols for aircraft validation.",
    tags: ["Aircraft Design", "Testing", "Component Analysis"],
  },
  {
    title: "Robotics Project Trainee",
    org: "OpenDroids · USA",
    when: "Jan 2024 · 30 days",
    description:
      "Hardware integration and embedded systems programming for robotics projects. Team-based troubleshooting and design reviews using ROS2, Gazebo and embedded platforms.",
    tags: ["ROS2", "Gazebo", "Hardware Integration", "Embedded Systems"],
  },
];

export const LEADERSHIP: Role[] = [
  { title: "Chair", org: "IEEE PES SBC MACE", when: "Mar 2024 – Feb 2025", description: "Led and coordinated technical events and workshops for the Power & Energy Society student branch chapter." },
  { title: "Content Lead", org: "IEEE PES Kerala Chapter", when: "Apr 2024 – Mar 2025", description: "Created and curated technical content for the chapter." },
  { title: "Team Lead", org: "ASME IAM3D 2025", when: "Mar 2025", description: "Directed drone design, assembly and software setup. Secured 4th place nationally." },
  { title: "Co-Lead", org: "SAE Drone Design Challenge", when: "Oct 2024", description: "Co-led execution of the box wing aircraft project." },
  { title: "Project Lead", org: "Safety Devices for Women", when: "Aug 2024", description: "Managed the design and development of personal safety devices." },
  { title: "Participant", org: "MathWorks MiniDrone Competition", when: "Jul 2025", description: "Built Simulink models and control systems for drone navigation using image processing." },
];

export const SKILLS = [
  { name: "ATE & Validation", icon: "🔬", items: ["Advantest V93K", "SmarTest 8", "ATE", "Protocol Analysis", "Circuit-level Testing", "Debugging", "Hardware Validation", "STIL / VCD / WGL"] },
  { name: "Robotics & Autonomy", icon: "🤖", items: ["ROS2", "Gazebo", "OpenCV", "Path Planning", "Sensor Fusion", "LiDAR", "Autonomous Navigation", "Image Processing"] },
  { name: "Embedded Systems", icon: "🔌", items: ["Raspberry Pi 5", "Arduino", "PCB Design", "EasyEDA", "Motor Control", "Sensor Interfacing", "Embedded Programming", "Python"] },
  { name: "Drone & Flight Systems", icon: "🚁", items: ["Betaflight", "iNav", "Mission Planner", "SpeedyBee FC", "3D Printing", "MATLAB & Simulink", "Control Systems"] },
  { name: "Design & Simulation", icon: "📐", items: ["Solidworks", "Onshape", "XFLR5", "Ansys CFD", "3D Modelling"] },
  { name: "Leadership", icon: "🧭", items: ["Project Planning", "Team Leadership", "Documentation", "System Integration", "Troubleshooting", "Collaboration"] },
];

export const LANGUAGES = [
  { name: "Malayalam", level: "Native", pct: 100 },
  { name: "English", level: "Fluent", pct: 90 },
  { name: "Hindi", level: "Fluent", pct: 80 },
  { name: "Japanese", level: "Basic", pct: 25 },
];
