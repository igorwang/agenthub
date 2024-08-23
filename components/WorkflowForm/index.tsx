"use client";

import UploadZone from "@/components/UploadZone";
import LibraryWorkflowRunningPane from "@/components/WorkflowForm/library-workflow-runing-pane";
import NodeTypeList from "@/components/WorkflowForm/node-type-list";
import WorkflowPane from "@/components/WorkflowForm/workflow-pane";
import {
  FlowEdgeFragmentFragment,
  FlowNodeFragmentFragment,
  NodeTypeFragmentFragment,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
} from "@nextui-org/react";
import { Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Conversation } from "../Conversation";

interface WorkflowFormProps {
  agentId?: string;
  knowledgeBaseId?: string;
  workflowType: "library" | "agent";
  initialData: {
    id: string;
    name: string;
    description: string;
    nodes?: FlowNodeFragmentFragment[];
    edges?: FlowEdgeFragmentFragment[];
  };
  nodeTypeList: NodeTypeFragmentFragment[];
  action: (formData: FormData) => Promise<{ success: boolean }>;
}

type FormValues = {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
};

export default function WorkflowForm({
  knowledgeBaseId,
  workflowType,
  initialData,
  agentId,
  action,
  nodeTypeList,
}: WorkflowFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isWorkflowRunOpen, setIsWorkflowRunOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testFile, setTestFile] = useState<{ id: string; filename: string } | null>(null);

  const flowId = initialData.id;

  const initialNodes = useMemo(
    () =>
      initialData?.nodes?.map((item) => ({
        id: item.id,
        position: { x: item.position_x, y: item.position_y },
        type: item.node_type.type,
        data: { ...item.data },
      })) || [],
    [initialData?.nodes],
  );

  const initialEdges = useMemo(
    () =>
      initialData?.edges?.map((item) => ({
        id: item.id,
        source: item.source_id,
        target: item.target_id,
        sourceHandle: item.sourceHandle,
      })) || [],
    [initialData?.edges],
  );

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      id: flowId,
      name: initialData?.name || "",
      description: initialData?.description || "",
      nodes: initialNodes,
      edges: initialEdges,
    },
  });
  const currentNodes = watch("nodes");
  const currentEdges = watch("edges");

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      if (isSaving) return; // Prevent multiple submissions
      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.append("id", data.id);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("nodes", JSON.stringify(data.nodes));
        formData.append("edges", JSON.stringify(data.edges));

        const result = await action(formData);
        if (result.success) {
          toast.success("Save workflow success");
          setHasUnsavedChanges(false);
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
        if (!testFile) {
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
  }, []);

  const closeUploadModal = () => {
    setIsUploadOpen(false);
  };

  const handleFileUploadCallback = useCallback(
    (files: { id: string | number; name: string }[]) => {
      setTestFile({ id: files[0].id as string, filename: files[0].name || "" });
      setIsUploadOpen(false);
      setIsWorkflowRunOpen(true);
    },
    [],
  );

  const handleCloseWorkflowRun = useCallback(() => {
    setIsWorkflowRunOpen(false);
  }, []);

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
          <Button
            type="submit"
            color="primary"
            startContent={<Icon icon="mdi:content-save" width="20" height="20" />}
            isLoading={isSaving}
            disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Workflow"}
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
            {isWorkflowRunOpen ? "Close Workflow Test" : "Run Workflow Test"}
          </Button>
        </form>
      </div>
      <div className="flex h-[calc(100vh-340px)] w-full flex-row gap-2">
        <div>
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
        {agentId && (
          <div
            className={`custom-scrollbar flex-1 overflow-hidden border-1 ${isWorkflowRunOpen ? "visible" : "invisible"}`}>
            <Conversation agentId={agentId} hiddenHeader={true} isTestMode={true} />
          </div>
        )}
      </div>

      {hasUnsavedChanges && (
        <p className="bottom-0 left-0 text-sm text-yellow-600">
          You have unsaved changes.
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
                  Upload File
                </ModalHeader>
                <ModalBody className="py-6">
                  <UploadZone
                    maxNumberOfFile={1}
                    knowledgeBaseId={knowledgeBaseId}
                    // onAfterUpload={handleAfterUploadFile}
                    onFileUploadCallback={handleFileUploadCallback}
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
