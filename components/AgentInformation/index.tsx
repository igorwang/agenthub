"use client";

import ModelSelect from "@/components/PromptFrom/model-select";
import {
  Agent_Set_Input,
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
} from "@/graphql/generated/types";
import { Input } from "@nextui-org/input";
import { Avatar, Button, Divider, Textarea } from "@nextui-org/react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
}

const AgentInformation = forwardRef(({ id }: { id: string }, ref) => {
  const [agent, setAgent] = useState<Agent | null>();
  const [updateAgentMutation] = useUpdateAgentMutation();
  const query = useGetAgentByIdQuery({ variables: { id: id } });

  useImperativeHandle(ref, () => ({
    triggerEvent: () => {
      const input: Agent_Set_Input = {
        name: agent?.name,
        description: agent?.description,
        avatar: agent?.avatar,
        default_model: agent?.default_model,
      };
      delete input.id;
      updateAgentMutation({
        variables: {
          pk_columns: { id: id },
          _set: input,
        },
      }).then(() => {
        toast.success("Agent information update succeeded！");
      });
    },
  }));

  useEffect(() => {
    if (query.data) {
      setAgent(query?.data?.agent_by_pk);
    }
  }, [query]);

  function handleSubmit(e: any) {
    const input: Agent_Set_Input = {
      name: agent?.name,
      description: agent?.description,
      avatar: agent?.avatar,
      default_model: agent?.default_model,
    };
    delete input.id;
    updateAgentMutation({
      variables: {
        pk_columns: { id: id },
        _set: input,
      },
    }).then(() => {
      toast.success("Agent information update succeeded！");
    });
  }

  if (query.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={"flex w-full flex-col items-center justify-center p-10"}>
      <form className={"w-full gap-16"}>
        <div className={"flex flex-row items-end justify-between pb-1"}>
          <span className="relative text-foreground-500">Agent Information</span>
          <Button color={"primary"} onClick={(e) => handleSubmit(e)}>
            Save
          </Button>
        </div>
        <Divider />
        <div className={"mt-4"}>Avatar</div>
        <div className={"flex justify-center"}>
          {agent?.avatar ? (
            <Avatar src={agent?.avatar} />
          ) : (
            <Avatar
              className="flex-shrink-0 bg-blue-400"
              size="md"
              name={agent?.name?.charAt(0)}
              classNames={{ name: "text-xl" }}
            />
          )}
        </div>
        <div className={"mt-8"}>
          <Input
            isRequired
            label="Agent Name"
            labelPlacement="outside"
            placeholder="Enter agent name"
            type="text"
            variant={"flat"}
            value={agent?.name}
            onChange={(e) => setAgent({ ...agent, name: e.target.value || "" })}
          />
        </div>
        <div className={"mt-4"}>
          <Textarea
            label="Agent Description"
            labelPlacement="outside"
            placeholder="Enter agent description"
            type="text"
            variant={"flat"}
            value={agent?.description || ""}
            onChange={(e) => setAgent({ ...agent, description: e.target.value })}
          />
        </div>
        <div className={"mt-8"}>
          <ModelSelect
            labelPlacement="outside"
            defaultModel={agent?.default_model || ""}
            onSelectionChange={(model) => {
              setAgent((prev) => ({ ...prev, default_model: model }));
            }}
          />
        </div>
      </form>
    </div>
  );
});
AgentInformation.displayName = "AgentInformation";
export default AgentInformation;
