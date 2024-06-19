import { auth } from "@/auth";
import { DocumentNode } from "@apollo/client";
import { initializeApollo } from "./apolloClient";

async function getSessionHeaders(): Promise<{ Authorization: string }> {
  try {
    const session = await auth();
    return {
      Authorization: session?.access_token
        ? `Bearer ${session.access_token}`
        : "public",
    };
  } catch (error) {
    console.error("Error fetching session:", error);
    return { Authorization: "public" };
  }
}

export async function fetchData(query: DocumentNode) {
  const headers = await getSessionHeaders();

  const client = initializeApollo({}, headers);

  try {
    const { data } = await client.query({
      query,
    });
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function performMutation(
  mutation: DocumentNode,
  variables: object,
) {
  const headers = await getSessionHeaders();

  const client = initializeApollo({}, headers);

  try {
    const { data } = await client.mutate({
      mutation,
      variables,
    });

    return data;
  } catch (error) {
    console.error("Error performing mutation:", error);
    return null;
  }
}
