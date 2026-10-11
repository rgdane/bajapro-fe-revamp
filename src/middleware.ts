import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = ["/login", "/register", "/waiting-approval"];

// Halaman yang boleh diakses tanpa login (landing + halaman auth).
function isPublicPath(pathname: string): boolean {
  return pathname === "/" || AUTH_PATHS.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isPublic = isPublicPath(pathname);

  // Belum login dan mengakses halaman terlindungi -> ke /login
  if (!token && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Sudah login tapi membuka halaman auth atau landing -> ke halaman utama
  if (token && (isAuthPage || pathname === "/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/manage-user/user";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Jalankan untuk semua route kecuali API, aset Next, dan file statis.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
