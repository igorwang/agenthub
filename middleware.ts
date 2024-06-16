// At the same level as pages or app
import { auth, signIn } from "./auth";
import React from "react";
import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match as matchLocale } from "@formatjs/intl-localematcher";

const protectedRoutes = ["/chat"]; // Add any other protected routes here

const locales = ["en", "tw", "zh"];
const defaultLocale = "en";

function getLocale(request: NextRequest) {
  const negotiator = new Negotiator({
    headers: {
      "accept-language": request.headers.get("accept-language") || "",
    },
  });
  const languages = negotiator.languages();
  return matchLocale(languages, locales, defaultLocale);
}

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const locale = getLocale(request);
  console.log(`locale: ${locale}`);

  const { pathname, origin } = request.nextUrl;

  const excludePaths = ["/_next", "/static", "/api", "/favicon.ico"];

  const shouldExclude = excludePaths.some((path) => pathname.startsWith(path));

  if (!shouldExclude) {
    const pathnameHasLocale = locales.some(
      (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
    );

    console.log("Pathname:", pathname);
    console.log("Locales:", locales);
    console.log("Pathname has locale:", pathnameHasLocale);

    if (!pathnameHasLocale) {
      // Redirect if there is no locale
      request.nextUrl.pathname = `/${locale}${pathname}`;
      return NextResponse.redirect(request.nextUrl);
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  return NextResponse.next();
}
