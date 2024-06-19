"use client";
import ModelSelect from "@/components/PromptFrom/model-select";
import PromptTemplateInput from "@/components/PromptFrom/prompt-template-input";
import PromptVariablesInput from "@/components/PromptFrom/prompt-variables-input";
import { PlusIcon, StartOutlineIcon } from "@/components/ui/icons";
import {
  Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { Button } from "@nextui-org/button";
import React, { useCallback, useEffect, useRef, useState } from "react";

type TemplateStatus = "draft" | "saved";

export type PromptTemplateType = {
  id: number | string;
  template: string;
  role: string;
  status: TemplateStatus;
};

export type PromptFormProps = {
  templates?: PromptTemplateType[];
};

export type variableInputsType = {
  name: string;
  value: string;
};

const defaultTemplates: PromptTemplateType[] = [
  { id: 1, template: "You are a helpful AI.", role: "system", status: "draft" },
  { id: 2, template: "", role: "user", status: "draft" },
];

const PromptForm = React.forwardRef<HTMLDivElement, PromptFormProps>(
  ({ templates = defaultTemplates, ...props }, ref) => {
    const [templatesState, setTemplatesState] =
      useState<PromptTemplateType[]>(templates);
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [isChating, setIsChating] = useState<boolean>(false);
    const [variableInputs, setVariableInputs] = useState<variableInputsType[]>(
      [],
    );
    const [message, setMessage] = useState<string>("");

    const variableInputRef = useRef<HTMLDivElement>(null);

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
      setMessage("");

      try {
        // Fetch the streaming data from the API
        const response = await fetch("/api/chat"); // Adjust the endpoint as needed

        console.log(response);

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

    const templatesElement = templatesState.map((template) => (
      <PromptTemplateInput
        key={template.id}
        template={template}
        handleDeleteMessage={handleDeleteMessage}
        handleValueChange={handleValueChange}
        handleRoleSelect={handleRoleSelect}
      ></PromptTemplateInput>
    ));

    return (
      <div className="flex flex-col h-full w-full max-w-full">
        <div className="flex flex-row p-2">
          <div className="text-3xl font-bold flex-grow ">Playground</div>
          <div className="flex flex-row gap-1 ">
            <Button
              className="flex-grow"
              color="primary"
              variant="flat"
              radius="lg"
            >
              New
            </Button>
            <Button
              className="flex-grow"
              color="primary"
              variant="flat"
              radius="lg"
            >
              Edit
            </Button>
            <Button
              className="flex-grow"
              color="primary"
              variant="flat"
              radius="lg"
            >
              Save
            </Button>
          </div>
        </div>
        <div className="flex flex-row p-2 gap-4">
          <div className="w-1/2 flex flex-col gap-2 justify-start items-start h-full">
            <span className="text-1xl font-bold">Template</span>
            {templatesElement}
            <Button
              className="bg-white p-2 gap-1 m-2"
              size="sm"
              variant="ghost"
              startContent={<PlusIcon size={14}></PlusIcon>}
              onClick={handleAddMessage}
            >
              Message
            </Button>
          </div>
          <div className="w-1/2 flex flex-col gap-2 justify-start">
            <span className="text-xl font-bold">Inputs</span>
            <PromptVariablesInput
              ref={variableInputRef}
              templates={templatesState}
              setVariableInputs={handelVariableInputChange}
            ></PromptVariablesInput>
            <div className="text-xl font-bold">Output</div>
            <div className="flex flex-col h-full min-h-80 relative  items-baseline border-2 gap-2 p-2">
              <div className="flex flex-col w-full">
                <ModelSelect onSelectionChange={setSelectedModel}></ModelSelect>
              </div>
              <div className="w-full overflow-scroll max-h-[600px]">
                {message && `Assisitant:${message}`}
              </div>
              <Button
                className="absolute right-1 bottom-1"
                color={isChating ? "default" : "primary"}
                startContent={<StartOutlineIcon size={28} />}
                isDisabled={isChating}
                onClick={handleStartChat}
              >
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
