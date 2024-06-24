import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getSession } from "next-auth/react";
import { SubscriptionClient } from "subscriptions-transport-ws";

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
  if (
    networkError &&
    "statusCode" in networkError &&
    networkError.statusCode === 401
  ) {
    accessToken = null;
  }
});

const createHttpLink = (headers: Record<string, string> | null) => {
  console.log(`createHttpLink: ${JSON.stringify(headers, null, 2)}`);
  const httpLink = new HttpLink({
    uri: `${process.env.HTTP_API_HOST}`,
    credentials: "include",
    headers: { ...headers },
    fetch,
  });
  return httpLink;
};

const createWSLink = (): WebSocketLink => {
  const subscriptionClient = new SubscriptionClient(
    `${process.env.WS_API_HOST}`,
    {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        await requestAccessToken();
        return {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        };
      },
    },
  );

  subscriptionClient.onConnected(() => {
    console.log("WebSocket connection established");
  });

  return new WebSocketLink(subscriptionClient);
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
  console.log(`ssrMode: ${ssrMode}`);
  if (ssrMode) {
    link = createHttpLink(headers);
  } else {
    link = createWSLink();
  }

  return new ApolloClient({
    ssrMode,
    link: retryLink.concat(link),
    cache: new InMemoryCache().restore(initialState),
  });
}

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export function initializeApollo(
  initialState: InitialState,
  headers: Record<string, string>,
) {
  const _apolloClient =
    apolloClient ?? createApolloClient(initialState, headers);

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === "undefined") return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}
