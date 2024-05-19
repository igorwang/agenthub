"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { ApolloProvider, NormalizedCacheObject } from "@apollo/client";
import {createApolloClient} from "../lib/apolloClient";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const apolloClient = React.useMemo(() => createApolloClient({}, {}), []);

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        {/* <ApolloNextAppProvider makeClient={makeClient}> */}
        <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
        {/* </ApolloNextAppProvider> */}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
