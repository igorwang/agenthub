"use client";

import UploadZone, { UploadFileType } from "@/components/UploadZone";
import WorkflowBindPane from "@/components/Workflow/WorkflowBindPane";
import LibraryWorkflowRunningPane from "@/components/Workflow/WorkflowForm/library-workflow-runing-pane";
import NodeTypeList from "@/components/Workflow/WorkflowForm/node-type-list";
import WorkflowPane from "@/components/Workflow/WorkflowForm/workflow-pane";
import WorkflowTemplate from "@/components/Workflow/WorkflowTemplate";
import {
  FlowEdgeFragmentFragment,
  FlowNodeFragmentFragment,
  NodeTypeFragmentFragment,
  Workflow_Type_Enum,
  WorkflowTemplateFragmentFragment,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import { Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { Conversation } from "../../Conversation";

interface WorkflowFormProps {
  agentId?: string;
  knowledgeBaseId?: string;
  workflowType: "library" | "agent" | Workflow_Type_Enum;
  initialData: {
    id: string;
    name: string;
    description: string;
    workflow_type: Workflow_Type_Enum | null;
    nodes?: FlowNodeFragmentFragment[];
    edges?: FlowEdgeFragmentFragment[];
    r_agent_workflows?: Array<{
      __typename?: "r_agent_workflow";
      id: number;
      agent_id: any;
    }>;
  };
  nodeTypeList: NodeTypeFragmentFragment[];
  action: (formData: FormData) => Promise<{ success: boolean }>;
  onHasUnsavedChanges?: (hasUnsavedChanges: boolean) => void;
}

type FormValues = {
  id: string;
  name: string;
  description: string;
  workflow_type: Workflow_Type_Enum | null | undefined;
  nodes: Node[];
  edges: Edge[];
  r_agent_workflows?: Array<{
    __typename?: "r_agent_workflow";
    id: number;
    agent_id: any;
  }>;
};

export default function WorkflowForm({
  knowledgeBaseId,
  workflowType,
  initialData,
  agentId,
  action,
  nodeTypeList,
  onHasUnsavedChanges,
}: WorkflowFormProps) {
  const router = useRouter();
  const t = useTranslations();
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isWorkflowRunOpen, setIsWorkflowRunOpen] = useState(false);
  const [isSelectTemplateOpen, setIsSelectTemplateOpen] = useState(false);
  const [isStartGuideOpen, setIsStartGuideOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testFile, setTestFile] = useState<{ id: string; filename: string } | null>(null);
  const {
    isOpen: isToolBindOpen,
    onOpen: openToolBind,
    onClose: closeToolBind,
  } = useDisclosure();

  const flowId = initialData.id;

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      id: flowId,
      name: initialData?.name || "",
      description: initialData?.description || "",
      workflow_type: initialData?.workflow_type || null,
      nodes: initialNodes,
      edges: initialEdges,
      r_agent_workflows: initialData?.r_agent_workflows || [],
    },
  });
  const currentNodes = watch("nodes");
  const currentEdges = watch("edges");
  const workflowName = watch("name");

  useEffect(() => {
    setInitialNodes(
      initialData?.nodes?.map((item) => ({
        id: item.id,
        position: { x: item.position_x, y: item.position_y },
        type: item.node_type.type,
        data: { ...item.data },
      })) || [],
    );
    setInitialEdges(
      initialData?.edges?.map((item) => ({
        id: item.id,
        source: item.source_id,
        target: item.target_id,
        sourceHandle: item.sourceHandle,
      })) || [],
    );
    console.log("initialData.nodes?.length", initialData.nodes?.length);
    setIsStartGuideOpen(!initialData.nodes || initialData.nodes?.length === 0);
  }, [initialData]);

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      if (isSaving) return; // Prevent multiple submissions
      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.append("id", data.id);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("workflow_type", workflowType);
        formData.append("nodes", JSON.stringify(data.nodes));
        formData.append("edges", JSON.stringify(data.edges));
        formData.append(
          "r_agent_workflows",
          JSON.stringify(initialData.r_agent_workflows),
        );

        const result = await action(formData);
        if (result.success) {
          toast.success("Save workflow success");
          setHasUnsavedChanges(false);
          onHasUnsavedChanges?.(false);
        } else {
          toast.error("Create error");
        }
      } catch (error) {
        console.error("Error saving workflow:", error);
        toast.error("An error occurred while saving");
      } finally {
        setIsSaving(false);
      }
    },
    [action, isSaving],
  );

  const handleWorkflowChange = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      console.log("Workflow changed:", { newNodes, newEdges });
      const hasNodeChanges = JSON.stringify(newNodes) !== JSON.stringify(currentNodes);
      const hasEdgeChanges = JSON.stringify(newEdges) !== JSON.stringify(currentEdges);
      console.log("hasNodeChanges", newNodes);
      console.log("hasEdgeChanges", newEdges);

      if (hasNodeChanges) {
        setValue("nodes", newNodes);
      }
      if (hasEdgeChanges) {
        setValue("edges", newEdges);
      }
    },
    [setValue, currentNodes, currentEdges],
  );

  const handleRunWorkflow = useCallback(() => {
    if (hasUnsavedChanges) {
      toast.warning("Please save your changes before running the workflow");
    } else {
      if (workflowType == "library") {
        if (testFile === null) {
          setIsUploadOpen(true);
        } else {
          setIsWorkflowRunOpen(true);
        }
      } else if (workflowType == "agent") {
        setIsWorkflowRunOpen(true);
      }
    }
  }, [hasUnsavedChanges, workflowType]);

  const handleEditStatusChange = useCallback(() => {
    setHasUnsavedChanges(true);
    onHasUnsavedChanges?.(true);
  }, []);

  const closeUploadModal = () => {
    setIsUploadOpen(false);
  };

  const handleFileUploadCallback = useCallback((files: UploadFileType[]) => {
    setTestFile({ id: files[0].id as string, filename: files[0].name || "" });
    setIsUploadOpen(false);
    setIsWorkflowRunOpen(true);
  }, []);

  const handleCloseWorkflowRun = useCallback(() => {
    setIsWorkflowRunOpen(false);
  }, []);

  const handleExportWorkflowTemplate = useCallback(() => {
    const template = {
      nodes: currentNodes,
      edges: currentEdges,
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${workflowName}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }, [currentNodes, currentEdges, workflowName]);

  const handleImportWorkflowTemplate = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
              // replace id with uuid
              const idMap = new Map<string, string>();
              const newNodes = parsed.nodes.map((node: Node) => {
                const newId = v4();
                idMap.set(node.id, newId);
                return {
                  ...node,
                  id: newId,
                };
              });
              setInitialNodes(newNodes);
              const newEdges = parsed.edges.map((edge: Edge) => ({
                ...edge,
                target: idMap.get(edge.target),
                source: idMap.get(edge.source),
                id: v4(),
              }));
              setInitialEdges(newEdges);
              handleWorkflowChange(newNodes, newEdges);
              setHasUnsavedChanges(true);
              onHasUnsavedChanges?.(true);
            } else {
              toast.error(t("Invalid JSON format"));
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            toast.error(t("Invalid JSON format"));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setValue, handleWorkflowChange]);

  const handleSelectWorkflowTemplate = useCallback(
    (template: WorkflowTemplateFragmentFragment) => {
      setIsSelectTemplateOpen(false);
      const data = template.data;
      const nodes = data.nodes;
      const edges = data.edges;
      try {
        const idMap = new Map<string, string>();
        const newNodes = nodes.map((node: Node) => {
          const newId = v4();
          idMap.set(node.id, newId);
          return {
            ...node,
            id: newId,
          };
        });
        setInitialNodes(newNodes);
        const newEdges = edges.map((edge: Edge) => ({
          ...edge,
          target: idMap.get(edge.target),
          source: idMap.get(edge.source),
          id: v4(),
        }));
        setInitialEdges(newEdges);
        handleWorkflowChange(newNodes, newEdges);
        setHasUnsavedChanges(true);
        onHasUnsavedChanges?.(true);
      } catch (error) {
        console.error("Error set template data", error);
        toast.error(t("Invalid template data"));
      }
    },
    [setInitialNodes, setInitialEdges, handleWorkflowChange, setHasUnsavedChanges],
  );

  return (
    <div className="relative flex h-full flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Controller
          name="name"
          control={control}
          rules={{ required: "name is required" }}
          render={({ field }) => (
            <div className="max-w-1/2 w-[300px]">
              {isEditing ? (
                <Input
                  autoFocus
                  {...field}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setIsEditing(false);
                    }
                  }}
                />
              ) : (
                <div
                  className="min-h-[40px] cursor-pointer rounded border p-2 hover:bg-gray-100"
                  onClick={() => setIsEditing(true)}>
                  {field.value}
                </div>
              )}
            </div>
          )}
        />
        <form className="flex justify-end" onSubmit={handleSubmit(onSubmit)}>
          {workflowType == "agent" && (
            <Button
              color="default"
              startContent={<Icon icon="mdi:toolbox" width="20" height="20" />}
              // isLoading={isSaving}
              // disabled={isSaving}
              onClick={openToolBind}>
              {t("Bind Tools")}
            </Button>
          )}
          <Spacer x={2} />
          <Button
            type="submit"
            color="primary"
            startContent={<Icon icon="mdi:content-save" width="20" height="20" />}
            isLoading={isSaving}
            disabled={isSaving}>
            {isSaving ? `${t("Saving")}...` : t("Save Workflow")}
          </Button>
          <Spacer x={2} />
          <Button
            color={isWorkflowRunOpen ? "danger" : "secondary"}
            onClick={isWorkflowRunOpen ? handleCloseWorkflowRun : handleRunWorkflow}
            startContent={
              <Icon
                icon={isWorkflowRunOpen ? "mdi:close-circle" : "mdi:play-circle"}
                width="20"
                height="20"
              />
            }
            disabled={isSaving}>
            {isWorkflowRunOpen ? t("Close Workflow Test") : t("Run Workflow Test")}
          </Button>
          <Spacer x={2} />
          <Dropdown>
            <DropdownTrigger>
              <Button
                color="default"
                startContent={<Icon icon="mdi:dots-vertical" width="20" height="20" />}>
                {t("More")}
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                startContent={<Icon icon="mdi:select-all" width="20" height="20" />}
                onClick={() => setIsSelectTemplateOpen(true)}>
                {t("Select Template")}
              </DropdownItem>
              <DropdownItem
                startContent={<Icon icon="mdi:import" width="20" height="20" />}
                onClick={handleImportWorkflowTemplate}>
                {t("Import Template")}
              </DropdownItem>
              <DropdownItem
                startContent={<Icon icon="mdi:export" width="20" height="20" />}
                onClick={handleExportWorkflowTemplate}>
                {t("Export Template")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </form>
      </div>
      <div className="flex h-[calc(100vh-340px)] w-full flex-row gap-2">
        <div className="min-h-[600px]">
          <NodeTypeList nodeTypeList={nodeTypeList} />
        </div>
        <div className="z-20 min-h-[600px] flex-1 flex-grow border bg-white">
          <WorkflowPane
            flowId={flowId}
            initialEdges={initialEdges}
            initialNodes={initialNodes}
            onWorkflowChange={handleWorkflowChange}
            onEditStatusChange={handleEditStatusChange}
          />
        </div>
        {testFile && isWorkflowRunOpen && (
          <div className="flex-1 overflow-hidden border-1">
            <div className="custom-scrollbar h-full overflow-auto">
              <LibraryWorkflowRunningPane
                fileId={testFile.id}
                fileName={testFile.filename}
                onNewFile={() => {
                  setIsUploadOpen(true);
                }}
              />
            </div>
          </div>
        )}
        {agentId && isWorkflowRunOpen && (
          <div className={`custom-scrollbar flex-1 overflow-hidden border-1`}>
            <Conversation agentId={agentId} hiddenHeader={true} isTestMode={true} />
          </div>
        )}
      </div>

      {hasUnsavedChanges && (
        <p className="bottom-0 left-0 text-sm text-yellow-600">
          {t("You have unsaved changes")}.
        </p>
      )}

      {knowledgeBaseId && (
        <Modal
          isOpen={isUploadOpen}
          onClose={closeUploadModal}
          className="rounded-lg bg-white shadow-lg"
          size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 border-b pb-4 text-2xl font-semibold text-gray-700">
                  {t("Upload File")}
                </ModalHeader>
                <ModalBody className="py-6">
                  <UploadZone
                    maxNumberOfFile={1}
                    knowledgeBaseId={knowledgeBaseId}
                    onAfterUpload={handleFileUploadCallback}
                    acceptFileTypes=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.txt,.json,.mp3,.mp4"
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      {agentId && (
        <Modal
          isOpen={isToolBindOpen}
          onOpenChange={openToolBind}
          onClose={closeToolBind}
          size="4xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {t("Bind Worflow Tools to Agent")}
                </ModalHeader>
                <ModalBody>
                  <WorkflowBindPane agentId={agentId} />
                </ModalBody>
                <ModalFooter>
                  {/* <Button color="danger" variant="light" onPress={onClose}>
                关闭
              </Button>
              <Button as={Link} href={`/chat/${params.id}/workflow`} color="primary">
                查看完整工作流页面
              </Button> */}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <Modal
        isOpen={isSelectTemplateOpen}
        onClose={() => setIsSelectTemplateOpen(false)}
        size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("Select Workflow Template")}
              </ModalHeader>
              <ModalBody>
                <WorkflowTemplate
                  workflowType={workflowType as Workflow_Type_Enum}
                  onSelectWorkflowTemplate={handleSelectWorkflowTemplate}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isStartGuideOpen}
        onClose={() => setIsStartGuideOpen(false)}
        size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1">
                {t("Start Guide")}
              </ModalHeader> */}
              <ModalBody>
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-lg font-semibold">
                    {t("Choose how to start your workflow")}
                  </p>
                  <div className="flex space-x-4">
                    <Button
                      size="lg"
                      variant="bordered"
                      startContent={<Icon icon="mdi:plus" className="text-2xl" />}
                      className="h-48 w-48 flex-col items-center justify-center border-2 border-primary transition-colors hover:bg-primary/10"
                      onPress={() => {
                        setIsStartGuideOpen(false);
                        // Add logic for starting from scratch
                      }}>
                      <span className="mt-2 text-lg font-semibold">
                        {t("Start from Scratch")}
                      </span>
                    </Button>
                    <Button
                      size="lg"
                      variant="bordered"
                      startContent={<Icon icon="mdi:file-outline" className="text-2xl" />}
                      className="h-48 w-48 flex-col items-center justify-center border-2 border-secondary transition-colors hover:bg-secondary/10"
                      onPress={() => {
                        setIsStartGuideOpen(false);
                        setIsSelectTemplateOpen(true);
                      }}>
                      <span className="mt-2 text-lg font-semibold">
                        {t("Choose a Template")}
                      </span>
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
