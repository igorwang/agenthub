"use client";
import { PromptFormHandle } from "@/components/PromptFrom";
import ModelSelect from "@/components/PromptFrom/model-select";
import { outputSchema } from "@/lib/jsonSchema";
import { Button, Divider, Input } from "@nextui-org/react";
import { Node } from "@xyflow/react";
import Ajv from "ajv";
import { JsonEditor } from "json-edit-react";
import { useRef } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

interface NodeData {
  [key: string]: any;
}

interface OutputParserNodeFormProps {
  node: Node<NodeData>;
  onNodeChange?: (data: { [key: string]: any }) => void;
  onToggleDrawer?: () => void;
}

type FormValues = {
  id: string;
  model_name: string;
  output_schema: object | null;
  label: string;
};

export default function OutputParserNodeForm({
  node,
  onNodeChange,
  onToggleDrawer,
}: OutputParserNodeFormProps) {
  const promptFormRef = useRef<PromptFormHandle>(null);
  const ajv = new Ajv();
  const outputSchemaValidate = ajv.compile(outputSchema);
  const nodeData = node.data || {};
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      id: node.id,
      model_name: nodeData.model_name || "",
      output_schema: nodeData.output_schema || null,
      label: nodeData.label,
    },
  });

  const model_name = useWatch({
    control,
    name: "model_name",
    defaultValue: nodeData.model_name || "",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (promptFormRef.current) {
      await promptFormRef.current.clickButton();
    }
    onNodeChange?.(data);
    onToggleDrawer?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 p-4">
      <div className="text-2xl font-bold">Edit Node</div>
      <Divider />

      <Controller
        name="model_name"
        control={control}
        rules={{ required: "Model name is required" }}
        render={({ field }) => (
          <ModelSelect
            label="Model name"
            isRequired={true}
            labelClassName="text-md font-bold"
            modelType="llm"
            labelPlacement="outside"
            defaultModel={field.value}
            onSelectionChange={(modelName) => field.onChange(modelName || null)}
          />
        )}
      />
      {errors.model_name && (
        <span className="text-red-500">{errors.model_name.message}</span>
      )}

      <Controller
        name="label"
        control={control}
        rules={{ required: "Node label is required" }}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            value={field.value as string}
            label="Node label"
            labelPlacement="outside"
            placeholder="Enter node label"
            classNames={{ label: "text-md font-bold" }}
            isRequired
            errorMessage={error?.message}
          />
        )}
      />

      <label className="text-md font-bold">Output Schema</label>
      <Controller
        name="output_schema"
        control={control}
        rules={{
          validate: (value) => {
            if (
              value === null ||
              (typeof value === "object" && Object.keys(value).length === 0)
            ) {
              return true;
            }
            const isValid = outputSchemaValidate(value);
            if (!isValid) {
              const errorMessage = outputSchemaValidate.errors
                ?.map(
                  (error) =>
                    `${error.instancePath}${error.instancePath ? ": " : ""}${error.message}`,
                )
                .join("\n");
              toast.error(`Not compliant with JSON Schema: ${errorMessage}`);
              return `Not compliant with JSON Schema: ${errorMessage}`;
            }
            return true;
          },
        }}
        render={({ field }) => (
          <JsonEditor
            collapse={true} // This will collapse the editor by default
            maxWidth={400}
            data={field.value || {}}
            onUpdate={({ newData }) => {
              field.onChange(newData);
            }}
            rootName=""></JsonEditor>
        )}
      />
      {errors.output_schema && (
        <p className="mt-1 text-sm text-red-500">
          {errors.output_schema.message as string}
        </p>
      )}

      <div className="flex flex-row justify-end gap-2">
        <Button
          color="danger"
          variant="bordered"
          onClick={() => {
            onToggleDrawer?.();
          }}>
          Close
        </Button>
        <Button type="submit" color="primary">
          Submit
        </Button>
      </div>
    </form>
  );
}
