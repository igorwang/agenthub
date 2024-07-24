import { auth } from "@/auth";
import LibraryHeader from "@/components/LibraryHeader";
import LibraryBreadcrumbs from "@/components/LibraryHeader/library-bread";
import {
  KnowledgeBaseDetailDocument,
  KnowledgeBaseDetailQuery,
  KnowledgeBaseDetailQueryVariables,
} from "@/graphql/generated/types";
import { fetchData } from "@/lib/apolloRequest";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library",
  description: "Library...",
};

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

export default async function LibraryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const library = await fetchLibraryData(params.id);

  return (
    <div className="flex h-full w-full max-w-full flex-col">
      <div className="w-full bg-white shadow">
        <div className="w-full justify-normal px-2">
          <LibraryHeader library={library?.knowledge_base_by_pk} />
        </div>
      </div>
      <div className="relative flex h-full w-full flex-col gap-2 bg-gray-50 px-2">
        <div className="flex justify-center">
          <LibraryBreadcrumbs libraryId={params.id} />
        </div>
        <div className="flex h-full w-full">{children}</div>
      </div>
    </div>
  );
}
