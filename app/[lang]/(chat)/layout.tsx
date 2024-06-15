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
import { Toaster } from "sonner";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function ChatLayout({
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
            <div className="flex flex-row h-dvh w-dvw">
              <SideBar></SideBar>
              {children}
              <Toaster />
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
