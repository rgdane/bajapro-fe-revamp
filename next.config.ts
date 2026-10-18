import type { NextConfig } from "next";

// Origin backend tanpa suffix /api/v1, untuk menyajikan file upload.
const backendOrigin = (
  process.env.BACKEND_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api/v1"
).replace(/\/api\/v1\/?$/, "");

const nextConfig: NextConfig = {
  // Wajib untuk image produksi (Dockerfile memakai .next/standalone).
  output: "standalone",
  async rewrites() {
    return [
      // Gambar hasil upload disimpan di backend; teruskan lewat origin FE.
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
