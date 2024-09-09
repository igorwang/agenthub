"use client";

import DeleteConfirmModal from "@/components/ui/delete-modal";
import { GetWorkflowListQuery, useGetWorkflowListQuery } from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface WorkflowListPageProps {
  initialWorkflowList: GetWorkflowListQuery["workflow"];
  currentPage: number;
}

function WorkflowListPage({ initialWorkflowList, currentPage }: WorkflowListPageProps) {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("Workflow");
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [page, setPage] = useState(currentPage);
  const [workflowList, setWorkflowList] = useState(initialWorkflowList);
  const { ref, inView } = useInView({
    // threshold: 0, // Trigger when the element becomes visible
    // triggerOnce: true, // Only trigger once
    // initialInView: false, // Start with inView as false
  });
  const { data, loading } = useGetWorkflowListQuery({
    variables: {
      where: {
        creator_id: {
          _eq: session?.data?.user?.id,
        },
      },
      limit: 10,
      offset: (page - 1) * 10,
    },
  });

  useEffect(() => {
    if (data) {
      setWorkflowList((prev) => [...prev, ...data.workflow]);
      setHasMore(data.workflow.length === 10); // 如果获取的数据少于10条，说明没有更多数据了
    }
  }, [data]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading]);

  const handleAddNewWorkflow = () => {
    console.log("add new workflow");
  };

  const handleDeleteWorkflow = (id: string) => {
    console.log("delete workflow", id);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-auto">
      <div className="grid h-full grid-cols-1 gap-4 py-2 sm:grid-cols-2 md:grid-cols-4">
        <Card
          className="flex max-w-[330px] cursor-pointer items-center justify-center transition-colors duration-300 hover:bg-gray-100"
          onClick={() => {
            handleAddNewWorkflow();
          }}>
          <CardBody className="flex flex-col items-center">
            <Icon
              icon="mdi:plus-circle-outline"
              width={48}
              height={48}
              className="mb-2"
            />
            <p className="text-lg font-semibold">{t("Add New Workflow")}</p>
          </CardBody>
        </Card>
        {workflowList.map((workflow) => (
          <div
            key={workflow.id}
            onClick={() => router.push(`/workflow/${workflow.id}`)}
            className="cursor-pointer">
            <Card className="group max-w-[330px]">
              <CardHeader className="flex gap-3">
                <Icon icon="mdi:workflow" width={24} height={24} />
                <p className="text-md font-bold">{workflow.name || t("Untitled")}</p>
              </CardHeader>
              <CardBody>
                <p className="line-clamp-3 text-sm text-gray-600">
                  {workflow.description || t("No description")}
                </p>
              </CardBody>
              <CardFooter className="flex items-center justify-between">
                <p className="text-small text-default-500">
                  {format(new Date(workflow.updated_at), "PPP")}
                </p>
                <div className="flex h-[20px] w-[20px] items-center justify-center">
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    isIconOnly
                    aria-label="Delete workflow"
                    className="hidden group-hover:flex data-[hover]:bg-transparent hover:bg-transparent active:bg-transparent"
                    onClick={() => {
                      setIsOpen(true);
                      setWorkflowId(workflow.id);
                    }}>
                    <Icon icon="mdi:delete" width={20} height={20} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
        {hasMore && (
          <div ref={ref} className="col-span-full flex justify-center p-4">
            {loading ? (
              <p>{t("Loading...")}</p>
            ) : (
              <Button onClick={loadMore}>{t("Load More")}</Button>
            )}
          </div>
        )}
        {workflowId && (
          <DeleteConfirmModal
            id={workflowId}
            title={t("Delete Workflow")}
            name={workflowList.find((w) => w.id === workflowId)?.name || t("Workflow")}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onAffirm={() => handleDeleteWorkflow(workflowId)}
          />
        )}
      </div>
    </div>
  );
}

export default WorkflowListPage;
