import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { getSession } from "next-auth/react";
import { auth } from "@/auth";

// import { auth } from "@/auth";
// const session = await auth();

let accessToken: string | null = null;

const requestAccessToken = async () => {
  if (accessToken) return;
  requestAccessToken;
  const session = await auth();
  console.log("session");
  console.log(accessToken);

  if (session && session.access_token) {
    accessToken = session.access_token;
  } else {
    accessToken = "public";
  }
};

const resetTokenLink = onError(({ networkError }) => {
  if (networkError && (networkError as any).statusCode === 401) {
    accessToken = null;
  }
});

const createHttpLink = (headers?: any) => {
  return new HttpLink({
    uri: `${process.env.HTTP_API_HOST}/v1/graphql`,
    credentials: "include",
    headers, // Auth token is fetched on the server side
    fetch,
  });
};

const createWSLink = () => {
  return new WebSocketLink(
    new SubscriptionClient(`${process.env.WS_API_HOST}/v1/graphql`, {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        await requestAccessToken(); // Happens on the client
        return {
          headers: {
            authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        };
      },
    })
  );
};

export const createApolloClient = (initialState: any, headers?: any) => {
  const ssrMode = typeof window === "undefined";

  const httpLink = createHttpLink(headers);
  const wsLink = !ssrMode ? createWSLink() : null;
  const splitLink = !ssrMode
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink!,
        httpLink
      )
    : httpLink;

  const link = ApolloLink.from([resetTokenLink, splitLink]);

  // console.log("ApolloLink client");
  // console.log(ssrMode);
  // console.log(link);

  return new ApolloClient({
    ssrMode,
    link,
    cache: new InMemoryCache().restore(initialState),
  });
};
