"use client";

import HorizontalSteps from "@/app/[lang]/(chat)/chat/[id]/settings/horizontal-steps";
import AgentInformation from "@/components/AgentInformation";
import LibraryFile from "@/components/LibraryFile";
import PromptFrom from "@/components/PromptFrom";
import { useGetAgentByIdQuery } from "@/graphql/generated/types";
import { Button } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

export default function AgentSettings() {
  const pathname = usePathname();
  const pathList = pathname.split("/");
  const id = pathList[pathList.length - 2];
  const [step, setStep] = useState<number>(0);
  const query = useGetAgentByIdQuery({ variables: { id: id } });
  const agent = query?.data?.agent_by_pk;
  const ref = useRef();

  const _renderContent = (currentStep: Number) => {
    switch (currentStep) {
      case 0:
        return <AgentInformation id={id} ref={ref} />;
      case 1:
        return (
          <PromptFrom
            agentId={id}
            defaultPromptId={agent?.system_prompt?.id}
            hiddeTitle={true}
            defaultModel={agent?.default_model || ""}
          />
        );
      case 2:
        return <LibraryFile id={agent?.kbs[0].knowledge_base?.id} />;
      case 3:
        return <h1>Contact View</h1>;
      default:
        return <h1>Not Found</h1>;
    }
  };

  function onClickNext() {
    console.log("1111");
  }

  const handleChildEvent = () => {
    if (ref.current) {
      ref.current?.triggerEvent();
    }
  };

  console.log(agent?.kbs[0].knowledge_base?.id);
  return (
    <div className={"mt-8 flex w-full flex-col items-center space-y-8 px-24"}>
      <HorizontalSteps
        // defaultStep={step}
        currentStep={step}
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
            title: "Complete Payment",
          },
          {
            title: "Preview and Confirm",
          },
        ]}
      />
      {_renderContent(step)}
      <div className={"flex space-x-8"}>
        {step === 0 ? null : (
          <Button color={"primary"} onClick={() => setStep(step - 1)}>
            Previous
          </Button>
        )}
        {step === 4 ? null : (
          <Button color={"primary"} onClick={() => setStep(step + 1)}>
            Next
          </Button>
        )}
      </div>
    </div>
  );

  // return (
  //   <div className="w-full">
  //     <RightHeader title={"Agent Setting"} callBackUri={`/chat/${id}`} />
  //     <div className={"flex flex-col items-center justify-center p-10"}>
  //       <form className={"w-full max-w-4xl gap-16"}>
  //         <div className={"flex flex-row items-end justify-between pb-1"}>
  //           <span className="relative text-foreground-500">Agent Information</span>
  //           <Button color={"primary"} onClick={(e) => handleSubmit(e)}>
  //             Save
  //           </Button>
  //         </div>
  //         <Divider />
  //         <div className={"mt-4"}>Avatar</div>
  //         <div className={"flex justify-center"}>
  //           {agent?.avatar ? (
  //             <Avatar src={agent?.avatar} />
  //           ) : (
  //             <Avatar
  //               className="flex-shrink-0 bg-blue-400"
  //               size="md"
  //               name={agent?.name?.charAt(0)}
  //               classNames={{ name: "text-xl" }}
  //             />
  //           )}
  //         </div>
  //         <div className={"mt-8"}>
  //           <Input
  //             isRequired
  //             label="Agent Name"
  //             labelPlacement="outside"
  //             placeholder="Enter agent name"
  //             type="text"
  //             variant={"flat"}
  //             value={agent?.name}
  //             onChange={(e) => setAgent({ ...agent, name: e.target.value || "" })}
  //           />
  //         </div>
  //         <div className={"mt-4"}>
  //           <Textarea
  //             label="Agent Description"
  //             labelPlacement="outside"
  //             placeholder="Enter agent description"
  //             type="text"
  //             variant={"flat"}
  //             value={agent?.description || ""}
  //             onChange={(e) => setAgent({ ...agent, description: e.target.value })}
  //           />
  //         </div>
  //         <div className={"mt-8"}>
  //           <ModelSelect
  //             labelPlacement="outside"
  //             defaultModel={agent?.default_model || ""}
  //             onSelectionChange={(model) => {
  //               setAgent((prev) => ({ ...prev, default_model: model }));
  //             }}
  //           />
  //         </div>
  //       </form>
  //       <Spacer y={4} />
  //       <div className={"w-full max-w-4xl"}>
  //         <span className="relative text-foreground-500">Prompt</span>
  //         <Divider />
  //         <PromptFrom
  //           agentId={id}
  //           defaultPromptId={agent?.system_prompt?.id}
  //           hiddeTitle={true}
  //           defaultModel={agent?.default_model || ""}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );
}
