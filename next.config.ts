import type { NextConfig } from "next";

// Where the site is served from. The Pages deploy builds this branch into /next/ for comparison.
const basePath = process.env.NEXT_BASE_PATH ?? "/Akhil_Sebastian_Portfolio";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
