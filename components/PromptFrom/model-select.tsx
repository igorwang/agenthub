import { Select, SelectItem, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export type ModelProps = {
  name: string;
  max_tokens: number;
  provider: string;
};

export type ModelSelectProps = {
  // models?: ModelProps[];
  defaultModel?: string;
  labelPlacement?: "outside" | "outside-left" | "inside" | undefined;
  onSelectionChange?: (selectedValue: string) => void;
};

const defaultModels = [
  { name: "gpt-3.5-turbo", max_tokens: 16000, provider: "azure" },
  {
    name: "gpt-4-turbo",
    max_tokens: 128000,
    provider: "openai",
  },
];

const ModelSelect = React.forwardRef<HTMLDivElement, ModelSelectProps>(
  ({ onSelectionChange, labelPlacement, defaultModel, ...props }, ref) => {
    const [models, setModels] = useState<ModelProps[]>(defaultModels);
    const [loading, setLoading] = useState<boolean>(true);
    const [value, setValue] = React.useState(new Set([defaultModel || ""]));

    useEffect(() => {
      if (defaultModel) {
        setValue(new Set([defaultModel]));
      }
    }, [defaultModel]);

    // const defaultSelectedKey: Key = defaultModel ? defaultModel : "";
    useEffect(() => {
      const fetchModels = async () => {
        try {
          const response = await fetch("/api/models");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setModels(data);
        } catch (error) {
          console.error("Failed to fetch models:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchModels();
    }, []);

    if (loading) {
      return <Spinner label="Loading model..." />;
    }

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setValue(new Set([newValue]));
      onSelectionChange && onSelectionChange(newValue); // Call the callback function with the new value
    };

    return (
      <Select
        // isRequired
        label="LLM Model"
        labelPlacement={labelPlacement}
        placeholder="Select an Model"
        // selectedKeys={value}
        selectedKeys={value}
        onChange={handleSelectionChange}
        className="max-w-full">
        {models.map((model) => (
          <SelectItem key={model.name}>{model.name}</SelectItem>
        ))}
      </Select>
    );
  },
);

ModelSelect.displayName = "ModelSelect";
export default ModelSelect;
