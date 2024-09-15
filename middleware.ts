import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import createIntlMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const locales = ["en", "hk", "zh"];
const defaultLocale = "en";

const PUBLIC_FILE = /\.(.*)$/;
const protectedRoutes = ["/chat", "/search", "/library", "/discover", "/user-management"];

function getLocale(request: NextRequest): string {
  const negotiator = new Negotiator({
    headers: {
      "accept-language": request.headers.get("accept-language") || "",
    },
  });
  const languages = negotiator.languages();
  return matchLocale(languages, locales, defaultLocale);
}

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const userLanguage = cookies().get("userLanguage")?.value;

  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("/static") ||
    pathname.includes("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const session = await auth();

  // Handle protected routes
  const pathnameWithoutLocale = locales.reduce((path, loc) => {
    if (path.startsWith(`/${loc}/`)) {
      return path.replace(`/${loc}`, "");
    } else if (path === `/${loc}`) {
      return "/";
    }
    return path;
  }, pathname);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route),
  );

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(`${origin}/auth/login?redirectUri=${pathname}`);
  }

  // Apply intl middleware
  const response = intlMiddleware(request);

  // If the locale is missing, add it based on the negotiated locale
  const pathnameHasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`,
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${userLanguage || locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
