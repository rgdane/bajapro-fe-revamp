// Base URL backend Go Fiber untuk request server-side (route handler/proxy).
// `BACKEND_BASE_URL` (tanpa prefix NEXT_PUBLIC_) dibaca saat runtime, jadi bisa
// diatur lewat environment Docker Compose tanpa perlu rebuild image.
export const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api/v1";
