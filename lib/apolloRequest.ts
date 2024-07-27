import { auth } from "@/auth";
import { ApolloError, DocumentNode, OperationVariables } from "@apollo/client";
import { initializeApollo } from "./apolloClient";

export class MutationError extends Error {
  constructor(
    public originalError: unknown,
    message?: string,
  ) {
    super(message || "An error occurred during the mutation");
    this.name = "MutationError";
  }
}

export class QueryError extends Error {
  constructor(
    public originalError: unknown,
    message?: string,
  ) {
    super(message || "An error occurred during the query");
    this.name = "QueryError";
  }
}

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
>(query: DocumentNode, variables?: TVariables): Promise<TData> {
  const headers = await getSessionHeaders();
  const client = initializeApollo({}, headers);

  try {
    const { data, errors } = await client.query<TData, TVariables>({
      query,
      variables,
    });

    if (errors && errors.length > 0) {
      throw new ApolloError({ graphQLErrors: errors });
    }

    if (data === undefined || data === null) {
      throw new Error("Query returned no data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);

    if (error instanceof ApolloError) {
      throw error; // 直接抛出 Apollo 错误
    } else {
      throw new QueryError(error);
    }
  }
}

export async function performMutation<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(mutation: DocumentNode, variables?: TVariables): Promise<TData> {
  const headers = await getSessionHeaders();
  const client = initializeApollo({}, headers);

  try {
    const { data, errors } = await client.mutate<TData, TVariables>({
      mutation,
      variables,
    });

    if (errors && errors.length > 0) {
      throw new ApolloError({ graphQLErrors: errors });
    }

    if (data === undefined || data === null) {
      throw new Error("Mutation returned no data");
    }

    return data;
  } catch (error) {
    console.error("Error performing mutation:", error);

    if (error instanceof ApolloError) {
      throw error; // 直接抛出 Apollo 错误
    } else {
      throw new MutationError(error);
    }
  }
}
