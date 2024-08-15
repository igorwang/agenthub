import { auth } from "@/auth";
import LibraryHeader from "@/components/Library/LibraryHeader";
import LibraryBreadcrumbs from "@/components/Library/LibraryHeader/library-bread";
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
        <div className="sticky w-full justify-normal px-2">
          <LibraryHeader library={library?.knowledge_base_by_pk} />
        </div>
      </div>
      <div className="flex h-full w-full flex-col gap-2 overflow-auto bg-gray-50 px-2">
        <div className="sticky top-0 z-10 flex justify-center bg-gray-50 px-2 py-2">
          <LibraryBreadcrumbs libraryId={params.id} />
        </div>
        <div className="flex h-full w-full">{children}</div>
      </div>
    </div>
  );
}
