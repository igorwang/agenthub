import { Providers } from "@/app/providers";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: {
    default: "Auth",
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "white" }}>
          <NextIntlClientProvider messages={messages}>
            <div className="relative flex h-screen flex-col">
              {/* <Navbar /> */}
              <main className="container mx-auto max-w-7xl flex-grow px-6 pt-16">
                {children}
              </main>
              {/* <footer className="flex w-full items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                title="nextui.org homepage">
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">Techower</p>
              </Link>
            </footer> */}
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
