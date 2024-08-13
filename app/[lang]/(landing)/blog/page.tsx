"use client";

import { PromptFormHandle } from "@/components/PromptFrom";
import { PromptTemplate } from "@langchain/core/prompts";
import { RJSFSchema } from "@rjsf/utils";
import { useRef, useState } from "react";

export default function Blog() {
  // promptHubRef =useRef<>
  const promptFormRef = useRef<PromptFormHandle>(null);

  const prompt = PromptTemplate.fromTemplate("You are a help AI named {name}");
  const content =
    "The lift coefficient $C_L$ is a dimensionless coefficient. aa **bb** \n  #1222 \name";

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("X Y Z and then XYZ");
  const onChange = (value: string) => setValue(value);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClick = () => {
    if (promptFormRef.current) {
      promptFormRef.current.clickButton();
    }
  };

  const schema: RJSFSchema = {
    type: "array",
    title: "Array of Objects Schema",
    description:
      "A schema describing an array of objects, each with name, expression, condition, and value fields",
    items: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        expression: {
          type: "string",
        },
        condition: {
          type: "string",
          enum: [
            "exists",
            "does not exist",
            "is empty",
            "is not empty",
            "is equal to",
            "is not equal to",
            "contains",
            "does not contain",
            "starts with",
            "does not start with",
            "ends with",
            "does not end with",
            "matches regex",
            "does not match regex",
          ],
        },
        value: {
          type: "string",
        },
      },
      required: ["name", "expression", "condition", "value"],
    },
  };

  const handleSelectionChange = () => {};

  return (
    <div className="h-full w-full">
      {/* <CustomForm
        schema={schema}
        // validator={validator}
        onSubmit={(formData) => console.log("formData", formData)}
      /> */}
      {/* <JsonTreeRenderer jsonData={schema}></JsonTreeRenderer> */}
      {/* <JsonExpressionInput jsonData={schema}></JsonExpressionInput> */}
    </div>
  );
}
