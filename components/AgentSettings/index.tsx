"use client";

import AgentInformation, { AgentInfoRef } from "@/components/AgentInformation";
import HorizontalSteps from "@/components/AgentSettings/horizontal-steps";
import { LibraryCart } from "@/components/Library/LibraryCart";
import { LibraryFileHandle } from "@/components/Library/LibraryFile";
import PromptFrom, { PromptFormHandle } from "@/components/PromptFrom";
import RightHeader from "@/components/RightHeader";
import WorkflowForm from "@/components/WorkflowForm";
import {
  FlowEdgeFragmentFragment,
  FlowNodeFragmentFragment,
  Knowledge_Base_Type_Enum,
  NodeTypeFragmentFragment,
  useGetAgentByIdQuery,
} from "@/graphql/generated/types";
import { Button } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SystemPrompt {
  id: number;
}
interface Agent {
  id?: string;
  name?: string;
  description?: string | null | undefined;
  avatar?: string | null | undefined;
  system_prompt?: SystemPrompt | null | undefined;
  default_model?: string | null;
}

interface AgentSettingsProps {
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

export default function AgentSettings({
  initialData,
  action,
  nodeTypeList,
}: AgentSettingsProps) {
  const [agent, setAgent] = useState<Agent | null>();
  const [libraryId, setLibraryId] = useState<string | null>();

  const [step, setStep] = useState<number>(0);
  const params = useParams<{ id: string }>();
  const { id } = params;
  const query = useGetAgentByIdQuery({ variables: { id: id } });
  const router = useRouter();

  const promptFormRef = useRef<PromptFormHandle>(null);
  const agentRef = useRef<AgentInfoRef>(null);
  const libraryRef = useRef<LibraryFileHandle>(null);

  const handleUpdateAgent = () => {
    query.refetch();
  };

  useEffect(() => {
    if (query.data) {
      const defautlLibrary = query?.data.agent_by_pk?.kbs.find(
        (item) => item.knowledge_base.base_type == Knowledge_Base_Type_Enum.Agent,
      );
      if (defautlLibrary) {
        setLibraryId(defautlLibrary.knowledge_base?.id);
      }
      setAgent(query?.data?.agent_by_pk);
    }
  }, [query]);

  const _renderContent = (currentStep: Number) => {
    switch (currentStep) {
      case 0:
        return <AgentInformation agentId={id} isHiddenSaveButton={true} ref={agentRef} />;
      case 1:
        return (
          <PromptFrom
            agentId={id}
            defaultPromptId={agent?.system_prompt?.id}
            hiddeTitle={true}
            hiddenSaveButton={true}
            defaultModel={agent?.default_model || ""}
            ref={promptFormRef}
            onUpdateAgent={handleUpdateAgent}
          />
        );
      case 2:
        return <LibraryCart agentId={id} />;
      case 3:
        return (
          <div className="h-[80vh] w-full min-w-[600px] px-20">
            <WorkflowForm
              workflowType="agent"
              initialData={initialData}
              action={action}
              nodeTypeList={nodeTypeList}></WorkflowForm>
          </div>
        );
      default:
        return <h1>Not Found</h1>;
    }
  };

  function onClickNext() {
    const currentStep = step;
    setStep(currentStep + 1);
    switch (currentStep) {
      case 0:
        if (agentRef?.current) {
          agentRef?.current?.handleSubmit();
        }
      case 1:
        if (promptFormRef.current) {
          promptFormRef.current.clickButton();
        }
      case 2:
        if (libraryRef.current) {
          libraryRef?.current?.saveLibraryInfo();
        }
      default:
        break;
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <RightHeader title={"Agent Setting"} callBackUri={`/chat/${id}`} />
      <div className="flex-grow overflow-auto">
        <div className="mx-auto mt-10 flex w-full flex-col items-center px-4">
          <HorizontalSteps
            currentStep={step}
            className={"items-start"}
            steps={[
              {
                title: "Edit Agent",
              },
              {
                title: "Configure Prompt",
              },
              {
                title: "Select Library",
              },
              {
                title: "Agent Workflow",
              },
            ]}
          />
          {_renderContent(step)}
        </div>
      </div>
      <div className="border-t bg-white p-4">
        <div className="flex justify-center space-x-8">
          {step > 0 && (
            <Button color={"primary"} onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button color={"primary"} onClick={() => onClickNext()}>
              Next
            </Button>
          ) : (
            <Button color={"primary"} onClick={() => router.push(`/chat/${id}`)}>
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
