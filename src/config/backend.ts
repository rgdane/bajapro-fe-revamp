// Base URL backend Go Fiber untuk request server-side (route handler/proxy).
export const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
