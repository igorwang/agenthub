"use client";

import { Button, Divider, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
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
    console.log("knowledgeBase", knowledgeBase);
    const input: Knowledge_Base_Set_Input = {
      name: knowledgeBase?.name,
      description: knowledgeBase?.description,
      base_type: knowledgeBase?.base_type,
      model_name: knowledgeBase?.model_name,
    };
    console.log("Knowledge_Base_Set_Input", input);
    updateKnowledgeBaseMutation({
      variables: {
        pk_columns: { id: id },
        _set: input,
      },
    }).then(() => {
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

  const animals = [
    { key: "length", label: "length" },
    { key: "page", label: "markdown" },
    { key: "markdown", label: "markdown" },
    { key: "semantic", label: "semantic" },
  ];

  return (
    <div className="w-full">
      <RightHeader title={"Library Setting"} callBackUri={`/library/${id}`} />
      <div className={"flex flex-col items-center pt-2"}>
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
            {/* <div className={"mt-4"}>
            <Select
              label="Library Type"
              labelPlacement="outside"
              onChange={(e) =>
                setData({
                  ...data,
                  base_type: e.target.value as Knowledge_Base_Type_Enum,
                })
              }
              defaultSelectedKeys={[data?.type?.value || ""]}>
              {(typeListQuery?.data?.knowledge_base_type || []).map((it) =>
                it.value === "USER_AGENT" || it.value === "AGENT" ? null : (
                  <SelectItem key={it.value}>{it?.comment}</SelectItem>
                ),
              )}
            </Select>
          </div> */}
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
            <ModelSelect
              labelPlacement="outside"
              defaultModel={knowledgeBase.model_name}
              onSelectionChange={(model) =>
                setknowledgeBase(
                  (prev) => ({ ...prev, model_name: model }) as KnowledgeBaseItem,
                )
              }></ModelSelect>
            <Select
              items={animals}
              label="chunking strategy"
              labelPlacement="outside"
              placeholder="Select an strategy"
              defaultSelectedKeys={["length"]}
              className="w-full">
              {(animal) => <SelectItem key={animal.key}>{animal.label}</SelectItem>}
            </Select>
            <Input
              isRequired
              label="chunking parameters"
              labelPlacement="outside"
              disabled={true}
              // placeholder="Enter library name"
              type="text"
              variant={"flat"}
              // value={'\{"chunking_length"\}']
              // onChange={(e) => setData({ ...data, name: e.target.value || "" })}
            />
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
