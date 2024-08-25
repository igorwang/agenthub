import { Providers } from "@/app/providers";
import { fontSans } from "@/config/fonts";
import "@/styles/globals.css";
import clsx from "clsx";
import { Viewport } from "next";

import StoreProvider from "@/app/StoreProvider";
import SideBar from "@/components/Sidebar";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";
// import { getMessages } from "next-intl/server";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  params: { lang },
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  // const messages = await getMessages();
  const messages = await getMessages();

  return (
    <html lang={lang} suppressHydrationWarning={true}>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "white" }}>
          <StoreProvider>
            <SessionProvider>
              <NextIntlClientProvider messages={messages}>
                <div className="h-dvh w-dvw">
                  <div className={"flex h-full flex-row"}>
                    <SideBar />
                    <div className="h-full w-full">
                      {children}
                      <Toaster
                        toastOptions={{
                          classNames: {
                            error: "text-red-400",
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </NextIntlClientProvider>
            </SessionProvider>
          </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
