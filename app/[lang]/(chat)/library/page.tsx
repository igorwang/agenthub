import { auth } from "@/auth";
import {
  KnowledgeBaseListDocument,
  KnowledgeBaseListQuery,
  KnowledgeBaseListQueryVariables,
  Order_By,
} from "@/graphql/generated/types";
import { fetchData } from "@/lib/apolloRequest";
import { Spinner } from "@nextui-org/react";
import { redirect } from "next/navigation";

async function fetchLibraryData() {
  const session = await auth();
  if (!session?.user) return null;

  const variables: KnowledgeBaseListQueryVariables = {
    order_by: { updated_at: Order_By.DescNullsLast },
    where: { creator_id: { _eq: session.user.id } },
    limit: 1,
  };

  return await fetchData<KnowledgeBaseListQuery, KnowledgeBaseListQueryVariables>(
    KnowledgeBaseListDocument,
    variables,
  );
}

export default async function LibraryPage() {
  const data = await fetchLibraryData();
  console.log("LibraryPage", data);

  if (data?.knowledge_base[0]?.id) {
    redirect(`/library/${data.knowledge_base[0].id}`);
  }

  if (!data || data.knowledge_base.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p className="mb-4 text-lg text-gray-600">
          You have not created any knowledge bases yet
        </p>
        <p className="text-md text-gray-500">
          Please create a new knowledge base to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Spinner size="lg" />
      <span className="ml-2">Loading...</span>
    </div>
  );
}
