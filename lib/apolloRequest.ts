import { auth } from "@/auth";
import { DocumentNode, OperationVariables } from "@apollo/client";
import { initializeApollo } from "./apolloClient";

async function getSessionHeaders(): Promise<{ Authorization: string }> {
  try {
    const session = await auth();
    return {
      Authorization: session?.access_token ? `Bearer ${session.access_token}` : "public",
    };
  } catch (error) {
    console.error("Error fetching session:", error);
    return { Authorization: "public" };
  }
}

export async function fetchData<
  TData,
  TVariables extends OperationVariables = OperationVariables,
>(query: DocumentNode, variables?: TVariables): Promise<TData | null> {
  const headers = await getSessionHeaders();
  const client = initializeApollo({}, headers);

  try {
    const { data } = await client.query<TData, TVariables>({
      query,
      variables,
    });
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function performMutation<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(mutation: DocumentNode, variables?: TVariables): Promise<TData | null> {
  const headers = await getSessionHeaders();

  try {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation.loc?.source.body,
        variables,
      }),
    });

    if (!response.ok) {
      console.error("Network response was not ok");
      return null;
    }

    const data: TData = await response.json();

    return data;
  } catch (error) {
    console.error("Error performing mutation:", error);
    return null;
  }
}
