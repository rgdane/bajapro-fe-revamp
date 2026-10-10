import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_BASE_URL } from "@/config/backend";

export const runtime = "nodejs";

export async function POST() {
  const token = (await cookies()).get("access_token")?.value;

  if (token) {
    try {
      await fetch(`${BACKEND_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { cookie: `access_token=${token}` },
        cache: "no-store",
      });
    } catch {
      // Abaikan kegagalan logout backend; cookie frontend tetap dibersihkan.
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("access_token", "", { maxAge: 0, path: "/" });
  response.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
  return response;
}
