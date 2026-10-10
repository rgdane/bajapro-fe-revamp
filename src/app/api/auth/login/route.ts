import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL } from "@/config/backend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Body request tidak valid" },
      { status: 400 },
    );
  }

  const res = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
    cache: "no-store",
  });

  const payload = (await res.json().catch(() => null)) as
    | {
        success?: boolean;
        data?: {
          user?: unknown;
          access_token?: string;
          refresh_token?: string;
        };
        error?: string;
      }
    | null;

  if (!res.ok || !payload?.success) {
    return NextResponse.json(
      { success: false, error: payload?.error ?? "Email atau password salah" },
      { status: res.status || 401 },
    );
  }

  const response = NextResponse.json({
    success: true,
    user: payload.data?.user,
  });

  const { access_token, refresh_token } = payload.data ?? {};
  if (access_token) {
    response.cookies.set("access_token", access_token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 jam, selaras backend
    });
  }
  if (refresh_token) {
    response.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });
  }

  return response;
}
