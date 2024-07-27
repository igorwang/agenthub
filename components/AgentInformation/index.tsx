"use client";

import ModelSelect from "@/components/PromptFrom/model-select";
import {
  Agent_Set_Input,
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
} from "@/graphql/generated/types";
import { formatTokenLimit } from "@/lib/utils/formatTokenLimit";
import { Input } from "@nextui-org/input";
import { Avatar, Button, Divider, Switch, Textarea } from "@nextui-org/react";
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
  token_limit?: number | null;
  enable_search?: boolean | null;
  force_search?: boolean | null;
}

export interface AgentInfoRef {
  handleSubmit: () => void;
}

interface AgentInfoProps {
  agentId: string;
  isHiddenSaveButton?: boolean;
}

const AgentInformation = forwardRef<AgentInfoRef, AgentInfoProps>((props, ref) => {
  const [agent, setAgent] = useState<Agent | null>();
  const [updateAgentMutation] = useUpdateAgentMutation();
  const query = useGetAgentByIdQuery({ variables: { id: props?.agentId } });

  useEffect(() => {
    if (query.data) {
      setAgent(query?.data?.agent_by_pk);
    }
  }, [query]);

  function handleSubmit() {
    const input: Agent_Set_Input = {
      name: agent?.name,
      description: agent?.description,
      avatar: agent?.avatar,
      default_model: agent?.default_model,
      token_limit: agent?.token_limit,
      enable_search: agent?.enable_search,
      force_search: agent?.force_search,
    };
    delete input.id;
    updateAgentMutation({
      variables: {
        pk_columns: { id: props?.agentId },
        _set: input,
      },
    }).then(() => {
      query.refetch();
      toast.success("Agent information update succeeded！");
    });
  }

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  if (query.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={"flex w-full flex-col items-center justify-center p-10"}>
      <form className={"w-full gap-16"}>
        <div className={"flex flex-row items-end justify-between pb-1"}>
          <span className="relative text-foreground-500">Agent Information</span>
          <Button
            color={"primary"}
            className={props?.isHiddenSaveButton ? "hidden" : "visible"}
            onClick={() => handleSubmit()}>
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
            label={
              agent?.token_limit ? `LLM (${formatTokenLimit(agent.token_limit)})` : "LLM"
            }
            labelPlacement="outside"
            defaultModel={agent?.default_model || ""}
            onSelectionChange={(modelName, limit) => {
              setAgent((prev) => ({
                ...prev,
                default_model: modelName,
                token_limit: limit,
              }));
            }}
          />
        </div>
        <div className={"mt-8"}>
          <Switch
            defaultSelected
            aria-label="Enable Web Search"
            isSelected={agent?.enable_search || false}
            onChange={() => {
              setAgent((prev) => ({
                ...prev,
                enable_search: agent?.enable_search ? false : true,
              }));
            }}>
            Enable Web Search
          </Switch>
        </div>
        <div className={"mt-8"}>
          <Switch
            defaultSelected
            aria-label="Force Search"
            isSelected={agent?.force_search || false}
            onChange={() => {
              setAgent((prev) => ({
                ...prev,
                force_search: agent?.force_search ? false : true,
              }));
            }}>
            Force Library Search
          </Switch>
        </div>
      </form>
    </div>
  );
});
AgentInformation.displayName = "AgentInformation";
export default AgentInformation;
