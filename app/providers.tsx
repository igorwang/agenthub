"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { createApolloClient } from "./lib/apolloClient";

import { useMemo } from "react";
import { ApolloProvider } from "@apollo/client";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const apolloClient = useMemo(() => createApolloClient({}), []);

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
