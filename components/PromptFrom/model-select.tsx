import { Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export type ModelProps = {
  name: string;
  max_tokens: number;
  provider: string;
};

export type ModelSelectProps = {
  // models?: ModelProps[];
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
  ({ onSelectionChange, ...props }, ref) => {
    const [models, setModels] = useState<ModelProps[]>(defaultModels);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedValuse, setSelectedValuse] = useState<string>("");

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
      return <div>Loading...</div>;
    }

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setSelectedValuse(newValue);
      onSelectionChange && onSelectionChange(newValue); // Call the callback function with the new value
    };

    return (
      <Select
        isRequired
        label="Model"
        placeholder="Select an Model"
        // defaultSelectedKeys={"gpt-3.5-turbo"}
        className="max-w-full"
      >
        {models.map((model) => (
          <SelectItem key={model.name}>{model.name}</SelectItem>
        ))}
      </Select>
    );
  },
);

ModelSelect.displayName = "ModelSelect";
export default ModelSelect;
