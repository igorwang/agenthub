// At the same level as pages or app
import { auth, signIn } from "./auth";
import React from "react";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/chat"]; // Add any other protected routes here

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const { pathname, origin } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!session && isProtectedRoute) {

    return NextResponse.redirect(`${origin}/auth/login`);
  }
  return NextResponse.next();
}
// export { auth as middleware } from "@/auth"
