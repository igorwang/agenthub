import { auth } from "@/auth";
import LibraryForm from "@/components/Library/LibraryForm";
import {
  KnowledgeBaseDetailDocument,
  KnowledgeBaseDetailQuery,
  KnowledgeBaseDetailQueryVariables,
} from "@/graphql/generated/types";
import { fetchData } from "@/lib/apolloRequest";

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

export default async function LibrarySettingPage({ params }: { params: { id: string } }) {
  const library = await fetchLibraryData(params.id);

  return (
    <div className="mx-auto flex h-full w-full justify-center">
      <LibraryForm initLibrary={library?.knowledge_base_by_pk} />
    </div>
  );
}
