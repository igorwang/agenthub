import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { fontSans } from "@/config/fonts";
import { Providers } from "@/app/providers";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import {
  Avatar,
  Button,
  ScrollShadow,
  Spacer,
  Tooltip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import SideBar from "@/components/Sidebar";

import { AcmeLogo } from "@/components/ui/icons";
import { SessionProvider } from "next-auth/react";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SessionProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "white" }}>
            {/* <StoreProvder> */}
              <div className="flex flex-row h-dvh w-dvw">
                <SideBar></SideBar>
                {children}
              </div>
            {/* </StoreProvder> */}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
