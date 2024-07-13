"use client";

import HorizontalSteps from "@/app/[lang]/(chat)/chat/[id]/settings/horizontal-steps";
import AgentInformation, { AgentInfoRef } from "@/components/AgentInformation";
import { LibraryCart } from "@/components/LibraryCart";
import LibraryFile, { LibraryFileHandle } from "@/components/LibraryFile";
import PromptFrom, { PromptFormHandle } from "@/components/PromptFrom";
import RightHeader from "@/components/RightHeader";
import {
  Knowledge_Base_Type_Enum,
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

export default function AgentSettings() {
  const [agent, setAgent] = useState<Agent | null>();
  const [libraryId, setLibraryId] = useState<string | null>();

  const [step, setStep] = useState<number>(0);
  const params = useParams<{ id: string }>();
  const { id } = params;
  const query = useGetAgentByIdQuery({ variables: { id: id } });
  const router = useRouter();
  // const agent = query?.data?.agent_by_pk;
  // const libraryId = query?.data?.agent_by_pk?.kbs[0]?.knowledge_base?.id;

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
        return <LibraryFile id={libraryId || ""} ref={libraryRef} />;
      case 3:
        return <LibraryCart agentId={id} />;
      default:
        return <h1>Not Found</h1>;
    }
  };

  function onClickNext() {
    const currentStep = step;
    console.log("currentStep", currentStep);
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
    <div className={"flex h-full w-full flex-col gap-4"}>
      <RightHeader title={"Agent Setting"} callBackUri={`/chat/${id}`} />
      <div className={"mx-auto mt-10 flex w-full flex-col items-center px-4"}>
        <HorizontalSteps
          // defaultStep={step}
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
              title: "Upload Files",
            },
            {
              title: "Select Library",
            },
          ]}
        />
        {_renderContent(step)}
        <div className={"flex items-start justify-start space-x-8 pt-4"}>
          {step === 0 ? null : (
            <Button color={"primary"} onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step === 3 ? (
            <Button color={"primary"} onClick={() => router.push(`/chat/${id}`)}>
              Save
            </Button>
          ) : (
            <Button color={"primary"} onClick={() => onClickNext()}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
