import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

let accessToken: string | null = null;
const requestAccessToken = async (): Promise<void> => {
  if (accessToken) return;
  const session = await getSession();

  if (session && session?.access_token) {
    accessToken = session.access_token;
  } else {
    accessToken = "public";
  }
};

const resetTokenLink = onError(({ networkError }) => {
  if (networkError && "statusCode" in networkError && networkError.statusCode === 401) {
    accessToken = null;
  }
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const createHttpLink = (headers: Record<string, string> | null) => {
  const httpLink = new HttpLink({
    uri: `${process.env.HTTP_API_HOST}`,
    credentials: "include",
    headers: { ...headers },
    fetch,
  });
  return httpLink;
};

const createWSLink = (): GraphQLWsLink => {
  const link = createClient({
    url: `${process.env.WS_API_HOST}`,
    lazy: true,
    retryAttempts: 3,
    connectionParams: async () => {
      await requestAccessToken();
      return {
        headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
      };
    },
    on: {
      opened: () => {
        console.log("WebSocket opened");
      },
      closed: (event: any) => {
        if (typeof window !== "undefined" && event?.code === 4403) {
          window.location.href = "/auth/login";
        }
        console.log("WebSocket closed", event);
      },
      error: (error) => {
        console.error("WebSocket error:", error);
      },
    },
  });

  return new GraphQLWsLink(link);
};

export interface InitialState {
  [key: string]: any;
}

export function createApolloClient(
  initialState: InitialState,
  headers: Record<string, string> | null,
) {
  const ssrMode = typeof window === "undefined";
  // retryLink sovled the 'start received before the connection is initialised' problem
  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: 3000,
      jitter: true,
    },
    attempts: {
      max: 5,
      retryIf: (error, _operation) => !!error,
    },
  });

  let link;
  if (ssrMode) {
    link = createHttpLink(headers);
  } else {
    link = createWSLink();
  }

  return new ApolloClient({
    ssrMode,
    link: from([errorLink, retryLink, link]),
    cache: new InMemoryCache().restore(initialState),
  });
}

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export function initializeApollo(
  initialState: InitialState,
  headers: Record<string, string>,
) {
  const _apolloClient = apolloClient ?? createApolloClient(initialState, headers);

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === "undefined") return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}
