"use client";

import {
  Button,
  Divider,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { JsonEditor } from "json-edit-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import PromptFrom from "@/components/PromptFrom";
import ModelSelect from "@/components/PromptFrom/model-select";
import RightHeader from "@/components/RightHeader";
import {
  Chunking_Strategy_Enum,
  Knowledge_Base_Set_Input,
  Knowledge_Base_Type_Enum,
  useKnowledgeBaseDetailQuery,
  useKnowledgeBaseTypeListQuery,
  useUpdateKnowledgeBaseMutation,
} from "@/graphql/generated/types";

interface KnowledgeBaseItem {
  name?: string;
  description?: string;
  extraction_prompt_id?: number;
  base_type?: Knowledge_Base_Type_Enum;
  chunking_strategy?: Chunking_Strategy_Enum;
  chunking_parameters?: any;
  model_name?: string;
  is_extraction?: boolean;
  is_publish?: boolean;
  type?: {
    value?: string;
    comment?: string;
  };
}

interface KnowledgeBaseTypeItem {
  value: string;
  comment?: string;
}

export default function LibrarySetting() {
  const [knowledgeBase, setknowledgeBase] = useState<KnowledgeBaseItem | null>();
  const [typeList, setTypeList] = useState<KnowledgeBaseTypeItem[]>([]);
  const [updateKnowledgeBaseMutation] = useUpdateKnowledgeBaseMutation();
  const router = useRouter();
  const typeListQuery = useKnowledgeBaseTypeListQuery({ variables: {} });
  const pathname = usePathname();
  const pathList = pathname.split("/");
  const id = pathList[pathList.length - 2];
  const query = useKnowledgeBaseDetailQuery({ variables: { id: id } });

  useEffect(() => {
    if (query.data) {
      setknowledgeBase({ ...query.data?.knowledge_base_by_pk } as KnowledgeBaseItem);
    }
  }, [query]);

  function handleSubmit(e: any) {
    const input: Knowledge_Base_Set_Input = {
      name: knowledgeBase?.name,
      description: knowledgeBase?.description,
      base_type: knowledgeBase?.base_type,
      chunking_strategy: knowledgeBase?.chunking_strategy,
      chunking_parameters: knowledgeBase?.chunking_parameters,
      is_extraction: knowledgeBase?.is_extraction,
      model_name: knowledgeBase?.model_name,
      is_publish: knowledgeBase?.is_publish,
    };
    console.log("knowledgeBase input", input);
    updateKnowledgeBaseMutation({
      variables: {
        pk_columns: { id: id },
        _set: input,
      },
    }).then(() => {
      query.refetch();
      toast.success("Library information update succeeded！");
    });
  }

  function textareaOnChange(e: any) {
    const value = e.target.value;
    if (value.length <= 200) {
      setknowledgeBase({ ...knowledgeBase, description: value });
    } else {
      toast.error("Library description limit 200 characters ");
    }
  }

  // 等待数据加载完成后再渲染组件
  if (!knowledgeBase) {
    return <p>Loading...</p>;
  }
  // const placeholderText =
  // const handleSelectionChange = () => {
  //   setknowledgeBase((prev) => ({
  //     ...prev,
  //     is_extraction: !prev.is_extraction,
  //   }));
  //   return true;
  // };

  return (
    <div className="h-full w-full overflow-auto">
      <RightHeader title={"Library Setting"} callBackUri={`/library/${id}`} />
      <div className={"mx-auto flex flex-col items-center px-4 py-2"}>
        <form className={"w-full max-w-4xl"}>
          <div className={"flex flex-row items-end justify-between pb-1"}>
            <span className="relative text-foreground-500">Library Information</span>
            <Button color={"primary"} onClick={(e) => handleSubmit(e)}>
              Save
            </Button>
          </div>
          <Divider />
          <div className="flex flex-col gap-4 pt-2">
            <Input
              isRequired
              label="Library Name"
              labelPlacement="outside"
              placeholder="Enter library name"
              type="text"
              variant={"flat"}
              value={knowledgeBase?.name}
              onChange={(e) =>
                setknowledgeBase({ ...knowledgeBase, name: e.target.value || "" })
              }
            />
            <Input
              isRequired
              label="Library Type"
              labelPlacement="outside"
              disabled={true}
              // placeholder="Enter library name"
              type="text"
              variant={"flat"}
              value={knowledgeBase?.base_type}
              // onChange={(e) => setData({ ...data, name: e.target.value || "" })}
            />
            <Textarea
              label="Library Description"
              labelPlacement="outside"
              placeholder="Enter library description"
              description="Maximum 200 characters"
              type="text"
              variant={"flat"}
              value={knowledgeBase?.description || ""}
              onChange={(e) => textareaOnChange(e)}
            />
            <Switch
              defaultSelected
              aria-label="Publish the library"
              isSelected={knowledgeBase.is_publish || false}
              onChange={() => {
                setknowledgeBase((prev) => ({
                  ...prev,
                  is_publish: knowledgeBase.is_publish ? false : true,
                }));
              }}>
              Publish the library
            </Switch>
            <div className="flex flex-col gap-2">
              <Select
                label="Chunking Strategy"
                labelPlacement="outside"
                placeholder="Select your chunking strategy for this library"
                classNames={{ label: "text-sm" }}
                variant={"flat"}
                selectedKeys={new Set([knowledgeBase.chunking_strategy || ""])}
                // defaultSelectedKeys={[Chunking_Strategy_Enum.Length.toString()]}
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys)[0] as Chunking_Strategy_Enum;
                  setknowledgeBase((prev) => ({
                    ...prev,
                    chunking_strategy: selectedValue,
                  }));
                }}>
                {Object.values(Chunking_Strategy_Enum).map((strategy) => (
                  <SelectItem key={strategy} value={strategy}>
                    {strategy}
                  </SelectItem>
                ))}
              </Select>
              <label className="font-sans text-sm text-gray-900 subpixel-antialiased">
                Chunking Parameters
              </label>
              <JsonEditor
                maxWidth={400}
                data={
                  knowledgeBase.chunking_parameters
                    ? JSON.parse(knowledgeBase.chunking_parameters)
                    : {}
                }
                onUpdate={({ newData }) => {
                  setknowledgeBase({
                    ...knowledgeBase,
                    chunking_parameters: JSON.stringify(newData),
                  });
                }}
                rootName="data"></JsonEditor>
            </div>
            <Switch
              defaultSelected
              aria-label="Extraction Process Switch"
              isSelected={knowledgeBase.is_extraction || false}
              onChange={() => {
                setknowledgeBase((prev) => ({
                  ...prev,
                  is_extraction: knowledgeBase.is_extraction ? false : true,
                }));
              }}>
              {/* onChange={()=>{}} */}
              Extraction Process Switch
            </Switch>

            {knowledgeBase.is_extraction && (
              <ModelSelect
                labelPlacement="outside"
                defaultModel={knowledgeBase.model_name}
                onSelectionChange={(model) =>
                  setknowledgeBase(
                    (prev) => ({ ...prev, model_name: model }) as KnowledgeBaseItem,
                  )
                }></ModelSelect>
            )}
          </div>
        </form>
        <div className={"w-full max-w-4xl pt-12"}>
          <span className="relative text-foreground-500">Prompt</span>
          <Divider />
          {/* {data?.extraction_prompt_id ? ( */}
          <PromptFrom
            agentId={id}
            hiddeTitle={true}
            defaultPromptId={knowledgeBase?.extraction_prompt_id}
            konwledgeBaseId={id}
          />
          {/* ) : null} */}
        </div>
      </div>
    </div>
  );
}
