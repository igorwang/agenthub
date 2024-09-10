import { auth } from "@/auth";
import WorkflowListPage from "@/components/WorkflowListPage";
import {
  GetWorkflowListDocument,
  GetWorkflowListQuery,
  GetWorkflowListQueryVariables,
  Order_By,
  Workflow_Type_Enum,
} from "@/graphql/generated/types";
import { fetchData } from "@/lib/apolloRequest";
import { Spinner } from "@nextui-org/react";
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
      workflow_type: {
        _eq: Workflow_Type_Enum.Tool,
      },
    },
    limit: ITEMS_PER_PAGE,
    offset: (page - 1) * ITEMS_PER_PAGE,
    order_by: {
      updated_at: Order_By.Desc,
    },
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
        <div className="flex h-full items-center justify-center">
          <Spinner>{t("Loading")}...</Spinner>
        </div>
      }>
      <div className="flex h-screen flex-col">
        <div className="flex-shrink-0 px-2 py-4 text-left">
          <h1 className="text-2xl font-bold">{t("Workflow List")}</h1>
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="custom-scrollbar h-full overflow-y-auto px-4">
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
