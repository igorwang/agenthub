import { auth } from "@/auth";
import LibraryFileList from "@/components/LibraryFileList";
import {
  FilesListDocument,
  FilesListQuery,
  FilesListQueryVariables,
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

export default async function LibraryMainPage({ params }: { params: { id: string } }) {
  const files = await fetchFileListData(params.id);
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-12">
      <Suspense fallback={<div>Loading...</div>}>
        <LibraryFileList initialFiles={files} knowledgeBaseId={params.id} />
      </Suspense>
    </div>
  );
}
