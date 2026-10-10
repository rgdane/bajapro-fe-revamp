import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_BASE_URL } from "@/config/backend";

export const runtime = "nodejs";

export async function GET() {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const res = await fetch(`${BACKEND_BASE_URL}/auth/profile`, {
    headers: { cookie: `access_token=${token}` },
    cache: "no-store",
  });

  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload?.success) {
    return NextResponse.json(
      { success: false, error: payload?.error ?? "Unauthorized" },
      { status: res.status || 401 },
    );
  }

  return NextResponse.json({ success: true, data: payload.data });
}
