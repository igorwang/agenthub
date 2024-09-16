"use client";

import DeleteConfirmModal from "@/components/ui/delete-modal";
import {
  GetWorkflowListQuery,
  Order_By,
  useCreateNewWorkflowMutation,
  useDeleteWorkflowByIdMutation,
  useGetWorkflowListQuery,
  useUpdateWorkflowByIdMutation,
  Workflow_Type_Enum,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
} from "@nextui-org/react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

interface WorkflowListPageProps {
  initialWorkflowList: GetWorkflowListQuery["workflow"];
  currentPage: number;
}

function WorkflowList({ initialWorkflowList, currentPage }: WorkflowListPageProps) {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("");
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowList, setWorkflowList] = useState(initialWorkflowList);
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [createNewWorkflow, { loading: createNewWorkflowLoading }] =
    useCreateNewWorkflowMutation();
  const [deleteWorkflow, { loading: deleteWorkflowLoading }] =
    useDeleteWorkflowByIdMutation();
  const [updateWorkflow, { loading: updateWorkflowLoading }] =
    useUpdateWorkflowByIdMutation();

  const { data, loading } = useGetWorkflowListQuery({
    variables: {
      where: {
        creator_id: {
          _eq: session?.data?.user?.id,
        },
        workflow_type: {
          _eq: Workflow_Type_Enum.Tool,
        },
      },
      limit: 10,
      offset: (page - 1) * 10,
      order_by: {
        updated_at: Order_By.Desc,
      },
    },
  });

  const [ref, inView] = useInView();

  useEffect(() => {
    if (data) {
      setWorkflowList((prev) => {
        const newWorkflows = data.workflow.filter(
          (newWorkflow) =>
            !prev.some((existingWorkflow) => existingWorkflow.id === newWorkflow.id),
        );
        return [...prev, ...newWorkflows];
      });
      setHasMore(data.workflow.length === 10);
    }
  }, [data]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleAddNewWorkflow = async () => {
    try {
      const res = await createNewWorkflow({
        variables: {
          object: {
            name: t("New Workflow"),
            description: "New Workflow",
            workflow_type: Workflow_Type_Enum.Tool,
            creator_id: session?.data?.user?.id,
          },
        },
      });
      if (res.data) {
        toast.success(t("New workflow created successfully"));
        console.log("add new workflow", res);
        const newWorkflow = res.data.insert_workflow_one;
        if (newWorkflow) {
          setWorkflowList((prev) => [newWorkflow, ...prev]);
          router.refresh(); // 触发服务器端刷新
          // router.push(`/workflow/${newWorkflow.id}`, undefined);
        }
      }
    } catch (error) {
      toast.error(t("Error adding new workflow"));
      console.error("Error adding new workflow", error);
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    try {
      const res = await deleteWorkflow({
        variables: {
          id: id,
        },
      });
      if (res.data) {
        toast.success(t("Workflow deleted successfully"));
        setWorkflowList((prev) => prev.filter((workflow) => workflow.id !== id));
        router.refresh();
      }
    } catch (error) {
      toast.error(t("Error deleting workflow"));
      console.error("Error deleting workflow", error);
    }
    setIsOpen(false);
  };

  const handleUpdateWorkflow = async (id: string, name: string, description: string) => {
    try {
      const res = await updateWorkflow({
        variables: {
          id: id,
          _set: {
            name: name,
            description: description,
          },
        },
      });
      if (res.data) {
        toast.success(t("Workflow updated successfully"));
        setWorkflowList((prev) =>
          prev.map((workflow) =>
            workflow.id === id
              ? { ...workflow, name: name, description: description }
              : workflow,
          ),
        );
        router.refresh();
      }
    } catch (error) {
      toast.error(t("Error updating workflow"));
      console.error("Error updating workflow", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-auto">
      <div className="grid h-full grid-cols-1 gap-4 py-2 sm:grid-cols-2 md:grid-cols-4">
        <Card
          className="flex max-w-[330px] items-center justify-center transition-colors duration-300 hover:bg-gray-100"
          isPressable
          onPress={handleAddNewWorkflow}>
          <CardHeader className="flex gap-3"></CardHeader>
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
        {workflowList.map((workflow) =>
          editId === workflow.id ? (
            <Card key={workflow.id} className="group min-w-[220px] max-w-[330px]">
              <CardHeader className="flex gap-3">
                <Icon icon="mdi:workflow" width={24} height={24} />
                <Input
                  value={workflow.name}
                  onChange={(e) =>
                    setWorkflowList((prev) =>
                      prev.map((w) =>
                        w.id === workflow.id ? { ...w, name: e.target.value } : w,
                      ),
                    )
                  }
                  className="text-md font-bold"
                  placeholder={t("Untitled")}
                />
              </CardHeader>
              <CardBody>
                <Textarea
                  value={workflow.description}
                  onChange={(e) =>
                    setWorkflowList((prev) =>
                      prev.map((w) =>
                        w.id === workflow.id ? { ...w, description: e.target.value } : w,
                      ),
                    )
                  }
                  className="line-clamp-3 text-sm text-gray-600"
                  placeholder={t("No description")}
                />
              </CardBody>
              <CardFooter className="flex items-center justify-between">
                <p className="text-small text-default-500">
                  {format(new Date(workflow.updated_at), "PPP")}
                </p>
                <Button
                  isIconOnly
                  color="success"
                  variant="light"
                  aria-label="Save workflow"
                  onClick={() => {
                    handleUpdateWorkflow(
                      workflow.id,
                      workflow.name,
                      workflow.description,
                    );
                    setEditId(null);
                  }}>
                  <Icon icon="mdi:check" width={20} height={20} />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div
              key={workflow.id}
              onClick={() => router.push(`/workflow/${workflow.id}`)}
              className="cursor-pointer">
              <Card className="group min-w-[240px] max-w-[330px]">
                <CardHeader className="flex gap-3">
                  <Icon icon="mdi:workflow" width={24} height={24} />
                  <p className="text-md font-bold">{workflow.name || t("Untitled")}</p>
                </CardHeader>
                <CardBody>
                  <p className="line-clamp-3 text-sm text-gray-600">
                    {workflow.description || t("No description")}
                  </p>
                </CardBody>
                <CardFooter className="flex items-center justify-between gap-2">
                  <p className="text-small text-default-500">
                    {format(new Date(workflow.updated_at), "PPP")}
                  </p>
                  <div className="flex h-[20px] w-[20px] items-center justify-center px-4">
                    <div className="flex gap-1">
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
                        <Icon icon="mdi:delete" width={16} height={16} />
                      </Button>
                      <Button
                        size="sm"
                        color="success"
                        variant="light"
                        isIconOnly
                        aria-label="Edit workflow"
                        className="hidden group-hover:flex data-[hover]:bg-transparent hover:bg-transparent active:bg-transparent"
                        onClick={() => {
                          setEditId(workflow.id);
                        }}>
                        <Icon icon="mdi:pencil" width={16} height={16} />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ),
        )}
        {hasMore && (
          <div className="col-span-full flex justify-center p-4">
            <Button onClick={loadMore} disabled={loading}>
              {loading ? t("Loading") : t("Load More")}
            </Button>
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

export default WorkflowList;
