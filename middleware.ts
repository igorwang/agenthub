// At the same level as pages or app
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const PUBLIC_FILE = /\.(.*)$/;

const protectedRoutes = ["/chat", "/search", "/library", "/search"]; // Add any other protected routes here

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

  const { pathname, origin } = request.nextUrl;

  const excludePaths = ["/_next", "/static", "/api", "/favicon.ico", "/public"];

  const shouldExclude = excludePaths.some((path) => pathname.startsWith(path));

  if (!shouldExclude) {
    const pathnameHasLocale = locales.some(
      (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`,
    );

    if (!pathnameHasLocale) {
      // Redirect if there is no locale
      request.nextUrl.pathname = `/${locale}${pathname}`;
      return NextResponse.redirect(request.nextUrl);
    }
  }

  // Remove locale from pathname before checking protected routes
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

  return NextResponse.next();
}
