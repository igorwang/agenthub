import { auth } from "@/auth";
import LibraryFileList from "@/components/LibraryFileList";
import {
  FilesListDocument,
  FilesListQuery,
  FilesListQueryVariables,
  KnowledgeBaseDetailDocument,
  KnowledgeBaseDetailQuery,
  KnowledgeBaseDetailQueryVariables,
  Order_By,
} from "@/graphql/generated/types";
import { fetchData } from "@/lib/apolloRequest";
import { Suspense } from "react";

async function fetchFileListData(id: string) {
  const session = await auth();
  if (!session?.user) return null;

  const variables: FilesListQueryVariables = {
    order_by: { updated_at: Order_By.DescNullsLast },
    limit: 10,
    where: { creator_id: { _eq: session.user.id }, knowledge_base_id: { _eq: id } },
  };

  return await fetchData<FilesListQuery, FilesListQueryVariables>(
    FilesListDocument,
    variables,
  );
}

async function fetchLibraryData(id: string) {
  const session = await auth();
  if (!session?.user) return null;

  const variables: KnowledgeBaseDetailQueryVariables = {
    id: id,
  };

  return await fetchData<KnowledgeBaseDetailQuery, KnowledgeBaseDetailQueryVariables>(
    KnowledgeBaseDetailDocument,
    variables,
  );
}

export default async function LibraryMainPage({ params }: { params: { id: string } }) {
  const files = await fetchFileListData(params.id);

  return (
    <div className="mx-auto flex w-full flex-col items-center">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <LibraryFileList initialFiles={files} knowledgeBaseId={params.id} />
      </Suspense>
    </div>
  );
}
