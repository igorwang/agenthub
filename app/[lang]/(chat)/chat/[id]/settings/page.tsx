"use client";

import HorizontalSteps from "@/app/[lang]/(chat)/chat/[id]/settings/horizontal-steps";
import AgentInformation, { AgentInfoRef } from "@/components/AgentInformation";
import { LibraryCart } from "@/components/LibraryCart";
import LibraryFile from "@/components/LibraryFile";
import PromptFrom, { PromptFormHandle } from "@/components/PromptFrom";
import RightHeader from "@/components/RightHeader";
import {
  useGetAgentByIdQuery,
  useKnowledgeBaseDetailLazyQuery,
} from "@/graphql/generated/types";
import { Button } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function AgentSettings() {
  const pathname = usePathname();
  const pathList = pathname.split("/");
  const id = pathList[pathList.length - 2];
  const [step, setStep] = useState<number>(0);
  const query = useGetAgentByIdQuery({ variables: { id: id } });
  const agent = query?.data?.agent_by_pk;
  const libraryId = query?.data?.agent_by_pk?.kbs[0]?.knowledge_base?.id;
  const [knowledgeBaseDetailQuery] = useKnowledgeBaseDetailLazyQuery();
  const ref = useRef();
  const router = useRouter();
  const promptFormRef = useRef<PromptFormHandle>(null);
  const agentRef = useRef<AgentInfoRef | undefined>();

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
          />
        );
      case 2:
        return <LibraryFile id={agent?.kbs[0].knowledge_base?.id} ref={agentRef} />;
      case 3:
        return <LibraryCart agentId={id} />;
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
      default:
        break;
    }
  }

  console.log(agent?.kbs[0].knowledge_base?.id);
  return (
    <div className={"h-dvh w-dvw"}>
      <RightHeader title={"Agent Setting"} callBackUri={`/chat/${id}`} />
      <div className={"mt-8 flex w-full flex-col items-center space-y-8 px-24"}>
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
        <div className={"flex items-start justify-start space-x-8"}>
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
