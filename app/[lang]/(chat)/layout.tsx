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
import PromptInputWithFaq from "@/components/Conversation/prompt-input-with-faq";
import StoreProvider from "@/app/StoreProvider";

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
        <Providers themeProps={{ attribute: "class", defaultTheme: "white" }}>
          <StoreProvider>
            <SessionProvider>
              <div className="h-dvh w-dvw">
                {children}
                <Toaster />
              </div>
            </SessionProvider>
          </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
