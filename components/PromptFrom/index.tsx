"use client";
import PromptTemplateInput from "@/components/PromptFrom/prompt-template-input";
import { PlusIcon } from "@/components/ui/icons";
import {
  Message_Role_Enum,
  useCreateNewPromptMutation,
  useDeletePromptTemplateMutation,
  useGetPromptByIdQuery,
  useUpadeAgentPromptMutation,
  useUpadeKnowledgeBasePromptMutation,
} from "@/graphql/generated/types";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Button } from "@nextui-org/button";
import { Input, Spacer } from "@nextui-org/react";
import { clsx } from "clsx";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
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
  defaultPromptId?: number | null;
  templates?: PromptTemplateType[];
  hiddeTitle?: boolean;
  defaultModel?: string;
  hiddenSaveButton?: boolean;
  hiddenNewButton?: boolean;
  hiddenTemplateName?: boolean;
  containerClassName?: string;
  leftColumnClassName?: string;
  rightColumnClassName?: string;
  onUpdateAgent?: () => void;
  onUpdateKnowledge?: () => void;
  onUpdatePromptId?: (id: number) => void;
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

export interface PromptFormHandle extends HTMLDivElement {
  clickButton: () => void;
}

const PromptForm = React.forwardRef<PromptFormHandle, PromptFormProps>(
  (
    {
      hiddenSaveButton,
      hiddenNewButton,
      hiddeTitle,
      hiddenTemplateName,
      agentId,
      konwledgeBaseId,
      defaultPromptId,
      defaultModel,
      defualtEditing = false,
      templates = defaultTemplates,
      containerClassName,
      leftColumnClassName,
      rightColumnClassName,
      onUpdateAgent,
      onUpdateKnowledge,
      onUpdatePromptId,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations();
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

    const saveButtonRef = useRef<HTMLButtonElement>(null);

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

    useImperativeHandle(ref, () => ({
      clickButton: () => {
        if (saveButtonRef.current) {
          saveButtonRef.current.click();
        }
      },
      ...(saveButtonRef.current?.parentElement as HTMLDivElement),
    }));

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
      if (data) {
        setPrompt({
          name: data.prompt_hub_by_pk?.name || "",
        });
        const templates = data.prompt_hub_by_pk?.templates;
        if (templates && templates.length > 0) {
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

    const handleChangePrompt = (id: number | null) => {
      if (id) {
        setPromptId(id);
        setIsNewPromot(false);
      } else {
        setPromptId(null);
        setTemplatesState(defaultTemplates);
        setIsNewPromot(true);
        setPrompt({ name: t("New Prompt") });
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

    const handleTemplateMove = (id: number | string, direction: "up" | "down") => {
      const index = templatesState.findIndex((template) => template.id === id);
      if (index === 0 && direction === "up") return;
      if (index === templatesState.length - 1 && direction === "down") return;
      if (direction === "up") {
        setTemplatesState((prevTemplates) => {
          const newTemplates = [...prevTemplates];
          [newTemplates[index], newTemplates[index - 1]] = [
            newTemplates[index - 1],
            newTemplates[index],
          ];
          return newTemplates;
        });
      } else {
        setTemplatesState((prevTemplates) => {
          const newTemplates = [...prevTemplates];
          [newTemplates[index], newTemplates[index + 1]] = [
            newTemplates[index + 1],
            newTemplates[index],
          ];
          return newTemplates;
        });
      }
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
        const newTemplates = templatesState
          .filter((item) => item.template && item.template.length > 0)
          .map((item, index) => ({
            template: item.template,
            role: item.role as Message_Role_Enum,
            order: index,
          }));
        // const removeIds = templatesState
        //   .filter((item) => item.status === "saved")
        //   .map((item) => Number(item.id));
        // delete old prompt
        // if (promptId) {
        //   await deletePromptTemplateMutation({
        //     variables: {
        //       where: { id: { _in: removeIds } },
        //     },
        //   });
        // }
        const { data, errors } = await createNewPromptMutation({
          variables: {
            object: {
              name: prompt?.name || t("New Prompt"),
              creator_id: userId,
              templates: { data: newTemplates },
            },
          },
        });

        const newPromptId = data?.insert_prompt_hub_one?.id;
        if (newPromptId && agentId) {
          try {
            const { data: updateAgentData, errors: updateAgentErrors } =
              await upadeAgentPromptMutation({
                variables: {
                  id: agentId,
                  _set: { system_prompt_id: newPromptId },
                },
              });
            if (!updateAgentData?.update_agent_by_pk) {
              toast.error(t("You don't have permission to update this agent"));
              return;
            }
            onUpdateAgent?.();
          } catch (error) {
            toast.error(t("Update agent prompt faild! Please try again!"));
            setPromptId(null);
          }
        }
        if (newPromptId && konwledgeBaseId) {
          const { data: updateKBData, errors: updateKBErrors } =
            await upadeKnowledgeBasePromptMutation({
              variables: {
                id: konwledgeBaseId,
                _set: { extraction_prompt_id: newPromptId },
              },
            });
          onUpdateKnowledge?.();
        }
        newPromptId && onUpdatePromptId?.(newPromptId);
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
      setPrompt({ name: t("New Prompt") });
    };

    const templatesElement = templatesState.map((template, index) => (
      <PromptTemplateInput
        index={index}
        onTemplateMove={handleTemplateMove}
        isLast={index === templatesState.length - 1}
        key={template.id}
        template={template}
        isDisabled={!isEditing}
        handleDeleteMessage={handleDeleteMessage}
        handleValueChange={handleValueChange}
        handleRoleSelect={handleRoleSelect}></PromptTemplateInput>
    ));

    const containerClasses = clsx(
      "flex flex-col items-center w-full max-w-4xl mx-auto",
      containerClassName,
    );

    const contentClasses = clsx("w-full max-w-3xl");

    const leftColumnClasses = clsx(
      "flex w-full flex-col items-start justify-start gap-2",
      leftColumnClassName,
    );

    return (
      <div ref={ref} className="flex h-full w-full max-w-full flex-col items-center">
        <div className={containerClasses}>
          <Spacer y={2} />
          <div className="flex w-full flex-row justify-between">
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
                  placeholer="Enter prompt name"></Input>
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
              {/* <Tooltip content={t("Add new prompt")}>
                <Button
                  isIconOnly
                  variant="bordered"
                  onClick={handleAddPrompt}
                  className={hiddenNewButton ? "hidden" : "visible"}>
                  <Icon icon={"ic:outline-add"} fontSize={30} color={"slate-200"}></Icon>
                </Button>
              </Tooltip> */}
              <Button
                color="primary"
                className={hiddenSaveButton ? "hidden" : "visible"}
                ref={saveButtonRef}
                onClick={() => handleSavePrompt()}>
                {t("Save")}
              </Button>
            </div>
          </div>
          <Spacer y={2} />
          <div className={contentClasses}>
            <div className={leftColumnClasses}>
              {hiddenTemplateName && (
                <Input
                  className="w-full"
                  label="Template Name"
                  labelPlacement="outside"
                  classNames={{ label: "text-md font-bold" }}
                  value={prompt?.name}
                  onValueChange={(value) =>
                    setPrompt((prevPrompt) => ({ ...prevPrompt, name: value }))
                  }
                  placeholder={t("Enter prompt name")}></Input>
              )}

              <span className="text-md font-bold">{t("Template Messages")}</span>
              {templatesElement}
              <Button
                className="m-2 gap-1 bg-white p-2"
                size="sm"
                variant="ghost"
                isDisabled={!isEditing}
                startContent={<PlusIcon size={14}></PlusIcon>}
                onClick={handleAddMessage}>
                {t("Message")}
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
