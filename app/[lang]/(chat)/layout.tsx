import { Providers } from "@/app/providers";
import { fontSans } from "@/config/fonts";
import "@/styles/globals.css";
import clsx from "clsx";
import { Viewport } from "next";

import StoreProvider from "@/app/StoreProvider";
import SideBar from "@/components/Sidebar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "white" }}>
          <StoreProvider>
            <SessionProvider>
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
            </SessionProvider>
          </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
