"use client";

import ModelSelect from "@/components/PromptFrom/model-select";
import {
  Agent_Mode_Enum,
  Agent_Set_Input,
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
} from "@/graphql/generated/types";
import { formatTokenLimit } from "@/lib/utils/formatTokenLimit";
import { Input } from "@nextui-org/input";
import {
  Avatar,
  Button,
  Divider,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
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
  embedding_model?: string | null;
  token_limit?: number | null;
  enable_search?: boolean | null;
  force_search?: boolean | null;
  mode?: Agent_Mode_Enum | null;
  is_publish?: boolean | null;
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
  const t = useTranslations();

  useEffect(() => {
    if (query.data) {
      setAgent(query?.data?.agent_by_pk);
    }
  }, [query]);

  const handleSubmit = async () => {
    const input: Agent_Set_Input = {
      name: agent?.name,
      description: agent?.description,
      avatar: agent?.avatar,
      default_model: agent?.default_model,
      token_limit: agent?.token_limit,
      enable_search: agent?.enable_search,
      force_search: agent?.force_search,
      mode: agent?.mode,
      embedding_model: agent?.embedding_model,
      is_publish: agent?.is_publish || false,
    };
    delete input.id;
    try {
      const response = await updateAgentMutation({
        variables: {
          pk_columns: { id: props?.agentId },
          _set: input,
        },
      });
      if (!response.data?.update_agent_by_pk) {
        toast.error("You don't have permission to update this agent");
      } else {
        query.refetch();
        toast.success("Agent information update succeeded！");
      }
    } catch (error) {
      toast.error("Agent information update failed！");
    }
  };

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
          <span className="relative text-foreground-500">{t("Agent Information")}</span>
          <Button
            color={"primary"}
            className={props?.isHiddenSaveButton ? "hidden" : "visible"}
            onClick={() => handleSubmit()}>
            {t("Save")}
          </Button>
        </div>
        <Divider />
        <div className={"mt-4"}>{t("Avatar")}</div>
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
        <div className={"mt-4"}>
          <Input
            isRequired
            label={t("Agent Name")}
            labelPlacement="outside"
            placeholder={t("Enter agent name")}
            type="text"
            variant={"flat"}
            value={agent?.name}
            onChange={(e) => setAgent({ ...agent, name: e.target.value || "" })}
          />
        </div>
        <div className={"mt-4"}>
          <Textarea
            label={t("Agent Description")}
            labelPlacement="outside"
            placeholder={t("Enter agent description")}
            type="text"
            variant={"flat"}
            value={agent?.description || ""}
            onChange={(e) => setAgent({ ...agent, description: e.target.value })}
          />
        </div>
        <div className={"mt-10"}>
          <ModelSelect
            label={
              agent?.token_limit
                ? `${t("LLM")} (${formatTokenLimit(agent.token_limit)})`
                : `${t("LLM")}`
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

        <div className={"mt-10"}>
          <ModelSelect
            label={
              agent?.embedding_model
                ? `${t("Embedding model")} (8k)`
                : `${t("Embedding model")}`
            }
            labelPlacement="outside"
            placeholder={t(
              "Select an Embedding Model, Please Ensure it same as your workflow index setting",
            )}
            modelType="embedding"
            defaultModel={agent?.embedding_model || ""}
            onSelectionChange={(modelName, limit) => {
              setAgent((prev) => ({
                ...prev,
                embedding_model: modelName,
              }));
            }}
          />
        </div>
        <div className={"mt-8"}>
          <Select
            label={t("Agent Work Mode")}
            className="pt-2"
            isRequired
            labelPlacement="outside"
            placeholder={t("Select your mode for this agent")}
            selectedKeys={agent?.mode ? [agent?.mode] : []}
            disallowEmptySelection={false}
            onSelectionChange={(keys) => {
              const selectedMode = Array.from(keys)[0];
              setAgent({ ...agent, mode: selectedMode as Agent_Mode_Enum });
            }}>
            {Object.values(Agent_Mode_Enum).map((mode) => (
              <SelectItem key={mode} value={mode}>
                {mode}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className={"mt-4"}>
          <Switch
            defaultSelected
            aria-label="is_publish"
            isSelected={agent?.is_publish || false}
            onChange={() => {
              setAgent((prev) => ({
                ...prev,
                is_publish: agent?.is_publish ? false : true,
              }));
            }}>
            {t("Publish")}
          </Switch>
        </div>
        {/* <div className={"mt-8"}>
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
        </div> */}
      </form>
    </div>
  );
});
AgentInformation.displayName = "AgentInformation";
export default AgentInformation;
