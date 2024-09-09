import { auth } from "@/auth";
import WorkflowListPage from "@/components/WorkflowListPage";
import {
  GetWorkflowListDocument,
  GetWorkflowListQuery,
  GetWorkflowListQueryVariables,
} from "@/graphql/generated/types";
import { fetchData } from "@/lib/apolloRequest";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

const ITEMS_PER_PAGE = 10;

async function getWorkflowListData(page: number) {
  const session = await auth();
  if (!session?.user) return null;

  const variables: GetWorkflowListQueryVariables = {
    where: {
      creator_id: {
        _eq: session.user.id,
      },
    },
    limit: ITEMS_PER_PAGE,
    offset: (page - 1) * ITEMS_PER_PAGE,
  };

  return await fetchData<GetWorkflowListQuery, GetWorkflowListQueryVariables>(
    GetWorkflowListDocument,
    variables,
  );
}

export default async function WorkflowPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = await getTranslations();
  const page = Number(searchParams.page) || 1;
  const workflowListData = await getWorkflowListData(page);

  //   const hasMore = workflowListData?.workflow.length === ITEMS_PER_PAGE;

  return (
    <Suspense
      fallback={
        <div className="flex h-screen flex-col items-center justify-center">
          <div className="mb-4 h-16 w-3/4 animate-pulse rounded-md bg-gray-200"></div>
          <div className="grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-md bg-gray-200"></div>
            ))}
          </div>
        </div>
      }>
      <div className="flex h-screen flex-col">
        <div className="flex-shrink-0 px-2 py-4 text-left">
          <h1 className="text-2xl font-bold">{t("Workflow List")}</h1>
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="h-full overflow-y-auto px-4">
            <WorkflowListPage
              initialWorkflowList={workflowListData?.workflow || []}
              currentPage={page}
              // hasMore={hasMore}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
