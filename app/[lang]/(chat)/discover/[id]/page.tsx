import { auth } from "@/auth";
import LibraryFileList from "@/components/LibraryFileList";
import LibraryHeader from "@/components/LibraryHeader";
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
  const library = await fetchLibraryData(params.id);

  console.log("library", library);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full bg-white shadow">
        <div className="w-full px-2">
          <LibraryHeader library={library?.knowledge_base_by_pk} />
        </div>
      </div>
      <div className="mx-auto flex h-full w-full flex-col items-center justify-center bg-gray-50 px-2">
        <LibraryFileList initialFiles={files} knowledgeBaseId={params.id} />
      </div>
      {/* <Suspense fallback={<div className="text-center">Loading...</div>}> */}

      {/* </Suspense> */}
    </div>
  );
}
