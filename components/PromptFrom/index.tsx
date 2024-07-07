"use client";
import MarkdownRenderer from "@/components/MarkdownRender";
import ModelSelect from "@/components/PromptFrom/model-select";
import PromptTemplateInput from "@/components/PromptFrom/prompt-template-input";
import { PlusIcon, StartOutlineIcon } from "@/components/ui/icons";
import {
  Message_Role_Enum,
  useCreateNewPromptMutation,
  useDeletePromptTemplateMutation,
  useGetPromptByIdQuery,
  useUpadeAgentPromptMutation,
  useUpadeKnowledgeBasePromptMutation,
} from "@/graphql/generated/types";
import {
  Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Button } from "@nextui-org/button";
import { Input, Spacer } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type TemplateStatus = "draft" | "saved";

export type PromptTemplateType = {
  id: number | string;
  template: string;
  role: Message_Role_Enum | string;
  status: TemplateStatus;
  order?: number;
};

export type PromptFormProps = {
  agentId?: string;
  konwledgeBaseId?: string;
  defualtEditing?: boolean;
  defaultPromptId?: number;
  templates?: PromptTemplateType[];
  hiddeTitle?: boolean;
  defaultModel?: string;
};

export type variableInputsType = {
  name: string;
  value: string;
};

export type Prompt = {
  name?: string;
};

const defaultTemplates: PromptTemplateType[] = [
  { id: 1, template: "You are a helpful AI.", role: "system", status: "draft" },
  { id: 2, template: "", role: "user", status: "draft" },
];

const PromptForm = React.forwardRef<HTMLDivElement, PromptFormProps>(
  (
    {
      hiddeTitle,
      agentId,
      konwledgeBaseId,
      defaultPromptId,
      defaultModel,
      defualtEditing = false,
      templates = defaultTemplates,
      ...props
    },
    ref,
  ) => {
    const [templatesState, setTemplatesState] = useState<PromptTemplateType[]>(templates);
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [isChating, setIsChating] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(true);
    const [isNewPromot, setIsNewPromot] = useState<boolean>(false);
    const [promptId, setPromptId] = useState<number | null>(null);
    const [prompt, setPrompt] = useState<Prompt>();
    // const [value, setValue] = React.useState(new Set([defaultModel || ""]));

    const [variableInputs, setVariableInputs] = useState<variableInputsType[]>([]);
    const [message, setMessage] = useState<string>("");

    const variableInputRef = useRef<HTMLDivElement>(null);

    const session = useSession();
    const userId = session.data?.user?.id;

    const [createNewPromptMutation] = useCreateNewPromptMutation();
    const [deletePromptTemplateMutation] = useDeletePromptTemplateMutation();
    const [upadeAgentPromptMutation] = useUpadeAgentPromptMutation();

    const [upadeKnowledgeBasePromptMutation] = useUpadeKnowledgeBasePromptMutation();

    const query = useGetPromptByIdQuery({
      variables: {
        id: promptId || 0, // value for 'id'
      },
      skip: !promptId,
    });
    const { data } = query;

    useEffect(() => {
      if (defaultPromptId) {
        setPromptId(defaultPromptId);
        setIsNewPromot(false);
      } else {
        setIsNewPromot(true);
      }
      if (defaultModel) {
        setSelectedModel(defaultModel);
      }
    }, [defaultPromptId, defaultModel]);

    useEffect(() => {
      query.refetch();
    }, [promptId]);

    useEffect(() => {
      console.log("data", data);
      if (data) {
        console.log();
        setPrompt({
          name: data.prompt_hub_by_pk?.name || "",
        });
        const templates = data.prompt_hub_by_pk?.templates;
        console.log("templates", templates);
        if (templates) {
          setTemplatesState(
            templates.map((item) => ({
              id: item.id,
              template: item.template,
              role: item.role,
              status: "saved",
            })),
          );
        }
        setIsNewPromot(false);
      } else {
        setTemplatesState(defaultTemplates);
      }
    }, [data, isNewPromot]);

    const reorderItem = useCallback(
      ({
        startIndex,
        indexOfTarget,
        closestEdgeOfTarget,
      }: {
        startIndex: number;
        indexOfTarget: number;
        closestEdgeOfTarget: Edge | null;
      }) => {
        const finishIndex = getReorderDestinationIndex({
          startIndex,
          closestEdgeOfTarget,
          indexOfTarget,
          axis: "vertical",
        });

        if (finishIndex === startIndex) {
          // If there would be no change, we skip the update
          return;
        }
        setTemplatesState((prevTemplatesState) => {
          return reorder({ list: prevTemplatesState, startIndex, finishIndex });
        });
      },
      [],
    );

    useEffect(() => {
      return monitorForElements({
        onDrop({ source, location }) {
          const target = location.current.dropTargets[0];

          if (!target) {
            return;
          }

          const sourceData = source.data;
          const targetData = target.data;

          const indexOfSource = templatesState.findIndex(
            (template) => template.id === sourceData.templateId,
          );
          const indexOfTarget = templatesState.findIndex(
            (template) => template.id === targetData.templateId,
          );

          if (indexOfTarget < 0 || indexOfSource < 0) {
            return;
          }

          const closestEdgeOfTarget = extractClosestEdge(target.data);

          reorderItem({
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget,
          });
        },
      });
    }, [templatesState, reorderItem]);

    const handleChangePrompt = (id: number | null) => {
      if (id) {
        console.log("handleChangePrompt", id);
        setPromptId(id);
        setIsNewPromot(false);
      } else {
        setPromptId(null);
        setTemplatesState(defaultTemplates);
        setIsNewPromot(true);
        setPrompt({ name: "New Prompt" });
      }
    };

    const handleAddMessage = () => {
      setTemplatesState((prevTemplates) => [
        ...prevTemplates,
        {
          id: `temp${Date.now()}`,
          template: "",
          role: "user",
          status: "draft",
        },
      ]);
    };

    const handleDeleteMessage = (id: number | string) => {
      setTemplatesState((prevTemplates) =>
        prevTemplates.filter((template) => template.id !== id),
      );
    };

    const handleValueChange = (id: number | string, newValue: string) => {
      setTemplatesState((prevTemplates) =>
        prevTemplates.map((template) =>
          template.id === id ? { ...template, template: newValue } : template,
        ),
      );
    };

    const handleRoleSelect = (id: number | string, role: string) => {
      setTemplatesState((prevTemplates) =>
        prevTemplates.map((template) =>
          template.id === id ? { ...template, role: role } : template,
        ),
      );
    };

    const handelVariableInputChange = (name: string, value: string) => {
      setVariableInputs((prevInputs) => {
        const existingInput = prevInputs.find((input) => input.name === name);

        if (existingInput) {
          return prevInputs.map((input) =>
            input.name === name ? { ...input, value: value } : input,
          );
        } else {
          return [...prevInputs, { name: name, value: value }];
        }
      });
    };

    const handleStartChat = async () => {
      setIsChating(true);
      setMessage("Think...");

      const cleanTemplates = templatesState.filter(
        (template) => template.template.length > 0,
      );

      const promptTemplate = ChatPromptTemplate.fromMessages(
        cleanTemplates.map((template) => {
          return [template.role, template.template];
        }),
      );

      const variabledDict = variableInputs.reduce(
        (acc: { [key: string]: string }, item: variableInputsType) => {
          acc[item.name] = item.value;
          return acc;
        },
        {},
      );

      let formattedPrompt;
      // build prompt
      try {
        formattedPrompt = await promptTemplate.format({
          ...variabledDict,
        });
      } catch (e) {
        toast.error("Please input variables", {
          classNames: { toast: "bg-red-400" },
        });
        setMessage("Please input variables and try again.");
        setIsChating(false);
        return;
      }

      try {
        // Fetch the streaming data from the API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: selectedModel,
            prompt: formattedPrompt,
          }),
        }); // Adjust the endpoint as needed
        setMessage(""); // new message

        if (!response.body) {
          throw new Error("ReadableStream not supported by the browser.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Function to read the stream
        const readStream = async () => {
          const { done, value } = await reader.read();
          if (done) {
            return;
          }

          // Decode the chunk and update the message state
          const chunk = decoder.decode(value, { stream: true });
          setMessage((prevMessage) => prevMessage + chunk);

          // Continue reading the stream
          await readStream();
        };

        // Start reading the stream
        await readStream();
      } catch (error) {
        console.error("Error while streaming:", error);
      }
      setIsChating(false);
    };

    const handleSavePrompt = async () => {
      setIsEditing(false);
      try {
        const newTemplates = templatesState.map((item, index) => ({
          template: item.template,
          role: item.role as Message_Role_Enum,
          order: index,
        }));
        const removeIds = templatesState
          .filter((item) => item.status === "saved")
          .map((item) => Number(item.id));

        // delete old prompt
        if (promptId) {
          await deletePromptTemplateMutation({
            variables: {
              where: { id: { _in: removeIds } },
            },
          });
        }

        const { data, errors } = await createNewPromptMutation({
          variables: {
            object: {
              name: prompt?.name || "New Prompt",
              creator_id: userId,
              templates: { data: newTemplates },
            },
          },
        });

        const newPromptId = data?.insert_prompt_hub_one?.id;
        if (newPromptId && agentId) {
          const { data: updateAgentData, errors: updateAgentErrors } =
            await upadeAgentPromptMutation({
              variables: {
                id: agentId,
                _set: { system_prompt_id: newPromptId },
              },
            });
        }
        if (newPromptId && konwledgeBaseId) {
          const { data: updateKBData, errors: updateKBErrors } =
            await upadeKnowledgeBasePromptMutation({
              variables: {
                id: konwledgeBaseId,
                _set: { extraction_prompt_id: newPromptId },
              },
            });
        }
        setPromptId(newPromptId || null);
        setIsNewPromot(false);
      } catch (error) {
        toast.error("Save prompt faild! Please try again!");
        setPromptId(null);
        // setIsNewPromot(true);
      }
      setIsEditing(true);
    };

    const handleAddPrompt = () => {
      setPromptId(null);
      setIsNewPromot(true);
      // setIsEditing(true);
      setPrompt({ name: "New Prompt" });
    };

    const templatesElement = templatesState.map((template) => (
      <PromptTemplateInput
        key={template.id}
        template={template}
        isDisabled={!isEditing}
        handleDeleteMessage={handleDeleteMessage}
        handleValueChange={handleValueChange}
        handleRoleSelect={handleRoleSelect}></PromptTemplateInput>
    ));

    return (
      <div className="flex h-full w-full max-w-full flex-col">
        <Spacer y={2} />
        <div className="flex flex-row">
          <div className="flex flex-grow flex-row items-center gap-2 pr-2">
            {!hiddeTitle && (
              <div className="flex flex-shrink-0 gap-2 text-xl font-bold sm:text-3xl">
                Playground
              </div>
            )}
            {/* {isEditing ? (
              <Input
                className="w-1/3"
                value={prompt?.name}
                onValueChange={(value) =>
                  setPrompt((prevPrompt) => ({ ...prevPrompt, name: value }))
                }
                placeholder="Enter prompt name"></Input>
            ) : (
              <PromptSearchBar handleChangePrompt={handleChangePrompt}></PromptSearchBar>
            )} */}
            {/* <Input
              className="w-1/3"
              value={prompt?.name}
              onValueChange={(value) =>
                setPrompt((prevPrompt) => ({ ...prevPrompt, name: value }))
              }
              placeholder="Enter prompt name"></Input> */}
            {/* <PromptSearchBar handleChangePrompt={handleChangePrompt}></PromptSearchBar> */}
          </div>
          <div className="flex flex-row gap-2">
            <Button color="primary" onClick={handleAddPrompt}>
              New
            </Button>
            <Button color="primary" onClick={() => handleSavePrompt()}>
              Save
            </Button>
          </div>
        </div>
        <Spacer y={2} />
        <div className="flex flex-row gap-4">
          <div className="flex h-full w-1/2 flex-col items-start justify-start gap-2">
            <Input
              className="w-full"
              label="Template Name"
              labelPlacement="outside"
              classNames={{ label: "text-1xl font-bold" }}
              value={prompt?.name}
              onValueChange={(value) =>
                setPrompt((prevPrompt) => ({ ...prevPrompt, name: value }))
              }
              placeholder="Enter prompt name"></Input>

            <span className="text-1xl font-bold">Template Messages</span>

            {templatesElement}
            <Button
              className="m-2 gap-1 bg-white p-2"
              size="sm"
              variant="ghost"
              isDisabled={!isEditing}
              startContent={<PlusIcon size={14}></PlusIcon>}
              onClick={handleAddMessage}>
              Message
            </Button>
          </div>
          <div className="flex w-1/2 flex-col justify-start gap-2">
            {/* <span className="text-xl font-bold">Inputs</span>
            <PromptVariablesInput
              ref={variableInputRef}
              templates={templatesState}
              isDisabled={!isEditing}
              setVariableInputs={handelVariableInputChange}></PromptVariablesInput> */}
            <div className="text-xl font-bold">Output</div>
            <div className="relative flex h-full flex-col items-baseline gap-2 border-2 p-2">
              <div className="flex w-full flex-col">
                <ModelSelect
                  onSelectionChange={setSelectedModel}
                  defaultModel={selectedModel}></ModelSelect>
              </div>
              <div className="max-h-[600px] w-full overflow-scroll pb-8">
                {message && "Assistant:"}
                <></>
                <MarkdownRenderer content={message}></MarkdownRenderer>
              </div>
              <Button
                className="absolute bottom-1 right-1"
                color={isChating || selectedModel.length === 0 ? "default" : "primary"}
                startContent={<StartOutlineIcon size={28} />}
                isDisabled={isChating || selectedModel.length === 0}
                onClick={handleStartChat}>
                Start
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

PromptForm.displayName = "PromptForm";

export default PromptForm;
