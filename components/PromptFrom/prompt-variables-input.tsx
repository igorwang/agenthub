import { PromptTemplateType } from "@/components/PromptFrom";
import { PromptTemplate } from "@langchain/core/prompts";
import { Textarea } from "@nextui-org/input";
import { forwardRef, useEffect, useState } from "react";

type Variable = {
  name: string;
};

type PromptVariabelsInputProps = {
  templates: PromptTemplateType[];
  setVariableInputs?: (name: string, value: string) => void;
  isDisabled?: boolean;
};

const PromptVariablesInput = forwardRef<HTMLDivElement, PromptVariabelsInputProps>(
  ({ isDisabled, templates, setVariableInputs, ...props }, ref) => {
    const [variables, setVariables] = useState<Variable[]>([]);

    useEffect(() => {
      const prompts = templates.map((template) => {
        try {
          return PromptTemplate.fromTemplate(template.template);
        } catch (error) {
          return PromptTemplate.fromTemplate("");
        }
      });
      const allInputVariables = prompts.flatMap((prompt) =>
        prompt.inputVariables.map((variable) => ({ name: variable })),
      );
      setVariables(allInputVariables);
    }, [templates]);

    const handleInputsValueChange = (name: string, value: string) => {
      setVariableInputs && setVariableInputs(name, value);
    };

    const defaultElement = (
      <div className="flex items-center min-h-[60px] border-2 border-dashed p-2 text-slate-400">
        Add a new variable by wrapping variable name with &#123; and &#125; brackets.
      </div>
    );

    return (
      <div className="flex flex-col gap-2" ref={ref}>
        {variables && variables.length > 0
          ? variables.map((variable) => (
              <Textarea
                // isRequired
                key={variable.name}
                minRows={2}
                variant="bordered"
                isDisabled={isDisabled}
                placeholder="Enter variable value..."
                label={`{${variable.name}}`}
                defaultValue=""
                onValueChange={(value) => handleInputsValueChange(variable.name, value)}
                classNames={{
                  label: "h-8 text-base group-data-[filled-within=true]:text-blue-600",
                }}
              />
            ))
          : defaultElement}
      </div>
    );
  },
);

PromptVariablesInput.displayName = "PromptVariablesInput";

export default PromptVariablesInput;
