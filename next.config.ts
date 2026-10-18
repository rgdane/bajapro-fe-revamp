import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wajib untuk image produksi (Dockerfile memakai .next/standalone).
  output: "standalone",
};

export default nextConfig;
