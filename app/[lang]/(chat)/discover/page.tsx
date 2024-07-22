import { auth } from "@/auth";
import LibrarySideBar from "@/components/LibrarySideBar";
import {
  KnowledgeBaseListDocument,
  KnowledgeBaseListQuery,
  KnowledgeBaseListQueryVariables,
  Order_By,
} from "@/graphql/generated/types";
import { fetchData } from "@/lib/apolloRequest";
import { Suspense } from "react";

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user) return null;

  const variables: KnowledgeBaseListQueryVariables = {
    order_by: { updated_at: Order_By.DescNullsLast },
    where: { creator_id: { _eq: session.user.id } },
  };

  const data = await fetchData<KnowledgeBaseListQuery, KnowledgeBaseListQueryVariables>(
    KnowledgeBaseListDocument,
    variables,
  );

  return (
    <div className="flex h-full w-full flex-row">
      <Suspense fallback={<div>Loading...</div>}>
        <LibrarySideBar items={data?.knowledge_base || []} />
      </Suspense>
      <div>Library</div>
    </div>
  );
}
