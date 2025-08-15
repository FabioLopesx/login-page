import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/login", "/cadastro", "/favicon.ico"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignora assets internos e APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    PUBLIC_PATHS.has(pathname)
  ) {
    return NextResponse.next();
  }

  // Proteger "/:slug"
  const match = pathname.match(/^\/([^/]+)$/);
  if (!match) {
    return NextResponse.next();
  }

  // Exigir cookie de sessão
  const token = req.cookies.get("token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["(/^/([^/]+)(?:/update-password)?$/)"],
};
