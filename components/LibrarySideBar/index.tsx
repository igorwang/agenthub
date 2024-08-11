import { auth } from "@/auth";
import LibrarySideBar from "@/components/LibrarySideBar/library-sidebar";
import {
  KnowledgeBaseListDocument,
  KnowledgeBaseListQuery,
  KnowledgeBaseListQueryVariables,
  Order_By,
} from "@/graphql/generated/types";
import { fetchData } from "@/lib/apolloRequest";
import { Suspense } from "react";

async function fetchLibraryData() {
  const session = await auth();
  if (!session?.user) return null;

  const variables: KnowledgeBaseListQueryVariables = {
    order_by: { updated_at: Order_By.DescNullsLast },
    where: { creator_id: { _eq: session.user.id } },
  };

  return await fetchData<KnowledgeBaseListQuery, KnowledgeBaseListQueryVariables>(
    KnowledgeBaseListDocument,
    variables,
  );
}

export default async function LibrarySideBarContainer() {
  const data = await fetchLibraryData();

  if (!data) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LibrarySideBar items={data.knowledge_base || []} />
    </Suspense>
  );
}
