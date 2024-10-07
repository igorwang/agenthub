"use client";

import AgentInformation, { AgentInfoRef } from "@/components/AgentInformation";
import HorizontalSteps from "@/components/AgentSettings/horizontal-steps";
import { LibraryCart } from "@/components/Library/LibraryCart";
import { LibraryFileHandle } from "@/components/Library/LibraryFile";
import PromptFrom, { PromptFormHandle } from "@/components/PromptFrom";
import RightHeader from "@/components/RightHeader";
import { Unauthorized } from "@/components/ui/unauthorized";
import WorkflowForm from "@/components/Workflow/WorkflowForm";
import {
  FlowEdgeFragmentFragment,
  FlowNodeFragmentFragment,
  Knowledge_Base_Type_Enum,
  NodeTypeFragmentFragment,
  useGetAgentByIdQuery,
  Workflow_Type_Enum,
} from "@/graphql/generated/types";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
  creator_id?: string | null;
}

interface AgentSettingsProps {
  initialData: {
    id: string;
    name: string;
    description: string;
    workflow_type: Workflow_Type_Enum;
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
  const t = useTranslations();
  const session = useSession();
  const [agent, setAgent] = useState<Agent | null>();
  const [libraryId, setLibraryId] = useState<string | null>();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<number>(parseInt(searchParams.get("step") || "1"));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { id } = params;
  const query = useGetAgentByIdQuery({ variables: { id: id } });
  const router = useRouter();

  const promptFormRef = useRef<PromptFormHandle>(null);
  const agentRef = useRef<AgentInfoRef>(null);
  const libraryRef = useRef<LibraryFileHandle>(null);

  const handleUpdateAgent = () => {
    query.refetch();
    toast.success(t("Update agent prompt successfully"));
  };

  // useEffect for initializing step from URL and updating URL when step changes
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const newStep = parseInt(stepParam);
      if (newStep >= 0 && newStep <= 3) {
        setStep(newStep);
      }
    } else {
      // If no step parameter, set to first step (0) and update URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("step", "1");
      router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  // useEffect for updating URL when step changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", step.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  }, [step, pathname, router, searchParams]);

  useEffect(() => {
    if (query.data) {
      const defaultLibrary = query?.data.agent_by_pk?.kbs.find(
        (item) => item.knowledge_base.base_type == Knowledge_Base_Type_Enum.Agent,
      );
      if (defaultLibrary) {
        setLibraryId(defaultLibrary.knowledge_base?.id);
      }
      setAgent(query?.data?.agent_by_pk);
    }
  }, [query]);

  const _renderContent = (currentStep: number) => {
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
              agentId={id}
              workflowType="agent"
              initialData={initialData}
              action={action}
              nodeTypeList={nodeTypeList}
              onHasUnsavedChanges={setHasUnsavedChanges}></WorkflowForm>
          </div>
        );
      default:
        return <AgentInformation agentId={id} isHiddenSaveButton={true} ref={agentRef} />;
    }
  };

  function onClickNext() {
    const currentStep = step;
    switch (currentStep) {
      case 0:
        if (agentRef?.current) {
          agentRef?.current?.handleSubmit();
        }
        break;
      case 1:
        if (promptFormRef.current) {
          promptFormRef.current.clickButton();
        }
        break;
      case 2:
        if (libraryRef.current) {
          libraryRef?.current?.saveLibraryInfo();
        }
        break;
      default:
        break;
    }
    setStep(currentStep + 1);
  }

  const handleSave = () => {
    if (hasUnsavedChanges) {
      toast.warning(t("Please save your changes before you leave"));
    } else {
      router.push(`/chat/${id}`);
    }
  };

  if (agent && agent.creator_id !== session?.data?.user?.id) {
    return <Unauthorized />;
  }

  return (
    <div className="flex h-screen flex-col">
      <RightHeader title={t("Agent Setting")} callBackUri={`/chat/${id}`} />
      <div className="flex-grow overflow-auto scrollbar-none">
        <div className="mx-auto mt-10 flex w-full flex-col items-center px-4">
          <HorizontalSteps
            currentStep={step}
            className={"items-start"}
            steps={[
              {
                title: t("Edit Agent"),
              },
              {
                title: t("System Prompt"),
              },
              {
                title: t("Select Library"),
              },
              {
                title: t("Agent Workflow"),
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
              {t("Previous")}
            </Button>
          )}
          {step < 3 ? (
            <Button color={"primary"} onClick={() => onClickNext()}>
              {t("Next")}
            </Button>
          ) : (
            <Button color={"primary"} onClick={handleSave}>
              {t("Save")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
