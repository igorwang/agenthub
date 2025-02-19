"use client";
import ModelSelect from "@/components/PromptFrom/model-select";
import {
  Chunking_Strategy_Enum,
  Knowledge_Base_Mode_Enum,
  Knowledge_Base_Set_Input,
  KnowledgeBaseDetailQuery,
  useDeleteKnowledgeBaseByIdMutation,
  useUpdateKnowledgeBaseMutation,
} from "@/graphql/generated/types";
import {
  chunkingParamsSchema,
  defaultChunkingParams,
  defaultDocumentSchemaExample,
  documentSchema,
} from "@/lib/jsonSchema";
import { Icon } from "@iconify/react";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import Ajv from "ajv";
import { JsonEditor } from "json-edit-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface LibraryFormProps {
  initLibrary: KnowledgeBaseDetailQuery["knowledge_base_by_pk"];
}

export default function LibraryForm({ initLibrary }: LibraryFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [updateKnowledgeBaseMutation] = useUpdateKnowledgeBaseMutation();
  const [deleteKnowledgeBaseByIdMutation] = useDeleteKnowledgeBaseByIdMutation();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  const ajv = new Ajv();
  const chunkingStrategyValidate = ajv.compile(chunkingParamsSchema);

  const documemtSchemaValidate = ajv.compile(documentSchema);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<Knowledge_Base_Set_Input>({
    defaultValues: {
      name: initLibrary?.name || "",
      description: initLibrary?.description || "",
      base_type: initLibrary?.base_type,
      chunking_strategy: initLibrary?.chunking_strategy,
      chunking_parameters: Object.keys(initLibrary?.chunking_parameters || {}).length
        ? initLibrary?.chunking_parameters
        : defaultChunkingParams,
      is_extraction: initLibrary?.is_extraction || false,
      model_name: initLibrary?.model_name || "",
      is_publish: initLibrary?.is_publish || false,
      embedding_model: initLibrary?.embedding_model || "",
      doc_schema: Object.keys(initLibrary?.doc_schema || {}).length
        ? initLibrary?.doc_schema
        : defaultDocumentSchemaExample,
      mode: initLibrary?.mode,
    },
    mode: "onChange",
  });

  const mode = watch("mode");

  const onSubmit = async (data: Knowledge_Base_Set_Input) => {
    try {
      await updateKnowledgeBaseMutation({
        variables: {
          pk_columns: { id: initLibrary?.id },
          _set: data,
        },
      });
      toast.success(t("Library information update succeeded!"));
      router.refresh();
    } catch (error) {
      toast.error(t("Failed to update library information"));
    }
  };

  const handleDeleteLibrary = async () => {
    const response = await deleteKnowledgeBaseByIdMutation({
      variables: { id: initLibrary?.id },
    });
    toast.success(t("Delete library success"));
    setDeleteModal(false);
    router.push("/library");
  };

  const deleteModalContent = (
    <Modal isOpen={deleteModal} hideCloseButton={true}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{t("Delete Library")}</ModalHeader>
        <ModalBody>
          <p>
            {t("Are you sure you want to remove this Library")} : {initLibrary?.name}?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={() => setDeleteModal(false)}>
            {t("Close")}
          </Button>
          <Button
            color="danger"
            onPress={() => {
              // setIsModalOpen(false);
              handleDeleteLibrary();
            }}>
            {t("Confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full max-w-4xl">
      {/* 基本信息配置 */}
      <div className="mb-6">
        <div className="mb-2 flex flex-row items-center gap-2">
          <Icon icon={"hugeicons:settings-05"} fontSize={20} />
          <h3 className="text-lg font-semibold">{t("Basic Information")}</h3>
        </div>
        <div className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Library name is required" }}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                value={field.value as string}
                label={t("Library Name")}
                labelPlacement="outside"
                placeholder={t("Enter library name")}
                isRequired
                errorMessage={error?.message}
              />
            )}
          />
          {/* <Input
            label="Library Type"
            labelPlacement="outside"
            value={initLibrary?.base_type}
            disabled
          /> */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value as string}
                label={t("Library Description")}
                labelPlacement="outside"
                placeholder={t("Enter library description")}
                description={t("Maximum 200 characters")}
              />
            )}
          />
          <Controller
            name="is_publish"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch size={"sm"} isSelected={value as boolean} onValueChange={onChange}>
                {t("Publish the library")}
              </Switch>
            )}
          />
          {/* <Controller
            name="model_name"
            control={control}
            render={({ field }) => (
              <ModelSelect
                labelPlacement="outside"
                defaultModel={field.value as string}
                onSelectionChange={(modelName) => {
                  field.onChange(modelName || null);
                }}
              />
            )}
          /> */}
        </div>
      </div>
      <Divider className="my-2" />
      <div className="mb-4">
        <div className="mb-4 flex flex-row items-center gap-2">
          <Icon icon={"solar:document-add-linear"} fontSize={20} />
          <h3 className="text-lg font-semibold">{t("Document Structure")}</h3>
        </div>
        <Controller
          name="mode"
          control={control}
          render={({ field }) => (
            <Select
              label={t("Library Document Mode")}
              className="pt-2"
              isRequired
              labelPlacement="outside"
              placeholder={t("Select your mode for this library")}
              selectedKeys={field.value ? [field.value] : [""]}
              disallowEmptySelection={false}
              onSelectionChange={(keys) => {
                field.onChange(Array.from(keys)[0] || null);
              }}>
              {Object.values(Knowledge_Base_Mode_Enum).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {t(mode)}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        {/* <div className="flex flex-col gap-4">
          <Controller
            name="doc_schema"
            control={control}
            rules={{
              validate: (value) => {
                const isValid = documemtSchemaValidate(value);
                if (!isValid) {
                  const errorMessage = documemtSchemaValidate.errors
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
              <div>
                <label className="font-sans text-sm text-gray-900">Document Schema</label>
                <JsonEditor
                  collapse={true} // This will collapse the editor by default
                  maxWidth={400}
                  data={field.value}
                  onUpdate={({ newData }) => {
                    field.onChange(newData);
                  }}
                  //   onUpdate={({ newData }) => field.onChange(newData)}
                  rootName=""
                />
                {errors.doc_schema && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.doc_schema.message as string}
                  </p>
                )}
              </div>
            )}
          />
        </div> */}
      </div>
      {/* 索引配置 */}
      {mode != "workflow" && (
        <div className="mb-6">
          <div className="mb-2 flex flex-row items-center gap-2">
            <Icon icon={"solar:graph-broken"} fontSize={20} />
            <h3 className="text-lg font-semibold">{t("Indexing Configuration")}</h3>
          </div>
          <div className="flex flex-col gap-4">
            <Controller
              name="chunking_strategy"
              control={control}
              render={({ field }) => (
                <Select
                  label={t("Chunking Strategy")}
                  labelPlacement="outside"
                  placeholder={t("Select your chunking strategy for this library")}
                  selectedKeys={field.value ? [field.value] : ["length"]}
                  disallowEmptySelection={false}
                  onSelectionChange={(keys) => {
                    field.onChange(Array.from(keys)[0] || null);
                  }}>
                  {Object.values(Chunking_Strategy_Enum).map((strategy) => (
                    <SelectItem key={strategy} value={strategy}>
                      {strategy}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="chunking_parameters"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="font-sans text-sm text-gray-900">
                    {t("Chunking Parameters")}
                  </label>
                  <JsonEditor
                    collapse={true} // This will collapse the editor by default
                    maxWidth={400}
                    data={field.value}
                    onUpdate={({ newData }) => {
                      const valid = chunkingStrategyValidate(newData);
                      if (!valid) {
                        const errorMessage = chunkingStrategyValidate.errors
                          ?.map(
                            (error) =>
                              `${error.instancePath}${error.instancePath ? ": " : ""}${error.message}`,
                          )
                          .join("\n");
                        toast.error(
                          `${t("Not compliant with JSON Schema")}:${errorMessage}`,
                        );
                        return t("JSON Schema error");
                      }
                      field.onChange(newData);
                    }}
                    rootName=""
                  />
                </div>
              )}
            />
            <Controller
              name="embedding_model"
              control={control}
              render={({ field }) => (
                <ModelSelect
                  label={t("Embedding model")}
                  modelType="embedding"
                  labelPlacement="outside"
                  isRequired={false}
                  defaultModel={field.value as string}
                  onSelectionChange={(modelName) => field.onChange(modelName || null)}
                />
              )}
            />
          </div>
        </div>
      )}

      <Divider className="my-2" />

      <div className="flex items-end justify-end gap-2 pb-1">
        {/* <span className="text-foreground-500">Library Information</span> */}
        <Button color="danger" onClick={() => setDeleteModal(true)}>
          {t("Delete")}
        </Button>
        <Button color="primary" type="submit">
          {t("Save")}
        </Button>
      </div>
      {deleteModal && deleteModalContent}
    </form>
  );
}
