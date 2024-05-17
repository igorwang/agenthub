import { auth } from "@/auth";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getToken } from "next-auth/jwt";
import { SubscriptionClient } from "subscriptions-transport-ws";

let accessToken: string | null = null;

const requestAccessToken = async (): Promise<void> => {
  console.log("check token");

  if (accessToken) return;
  const session = await auth();
  console.log("session");
  if (session && session?.access_token) {
    accessToken = session.access_token;
  } else {
    accessToken = "public";
  }
  // const res = await fetch(`${process.env.APP_HOST}/api/auth/session`);
  // if (res.ok) {
  //   const json = await res.json();
  //   console.log(json);
  //   accessToken = json.access_token;
  // } else {
  //   accessToken = "public";
  // }
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
  const httpLink = new HttpLink({
    uri: `${process.env.HTTP_API_HOST}`,
    credentials: "include",
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : "",
      ...headers,
    },
    fetch,
  });
  return httpLink;
};

const createWSLink = (): WebSocketLink => {
  console.log(`createWSLink: ${accessToken}`);
  return new WebSocketLink(
    new SubscriptionClient(`${process.env.WS_API_HOST}`, {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        await requestAccessToken();
        
        // happens on the client
        return {
          headers: {
            authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        };
      },
    })
  );
};

interface InitialState {
  [key: string]: any;
}

export default function createApolloClient(
  initialState: InitialState,
  headers: Record<string, string> | null
) {
  
  const ssrMode = typeof window === "undefined";
  let link;
  if (ssrMode) {
    link = createHttpLink(headers);
  } else {
    link = createWSLink();
  }
  return new ApolloClient({
    ssrMode,
    link,
    cache: new InMemoryCache().restore(initialState),
  });
}
