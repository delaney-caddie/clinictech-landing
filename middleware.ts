import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const session = request.cookies.get("admin_session")?.value;

  if (!session || !isValidSession(session, adminPassword)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
