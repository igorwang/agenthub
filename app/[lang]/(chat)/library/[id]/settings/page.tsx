"use client";

import { Button, Divider, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import PromptFrom from "@/components/PromptFrom";
import RightHeader from "@/components/RightHeader";
import {
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
  const [data, setData] = useState<KnowledgeBaseItem | null>();
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
      console.log(query.data);
      setData(query?.data?.knowledge_base_by_pk as KnowledgeBaseItem);
    }
  }, [query]);

  function handleSubmit(e: any) {
    const input: Knowledge_Base_Set_Input = {
      name: data?.name,
      description: data?.description,
      base_type: data?.base_type,
    };
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
      setData({ ...data, description: value });
    } else {
      toast.error("Library description limit 200 characters ");
    }
  }

  // 等待数据加载完成后再渲染组件
  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full">
      <RightHeader title={"Library Setting"} callBackUri={`/library/${id}`} />
      <div className={"flex flex-col items-center"}>
        <form className={"w-full max-w-4xl gap-16 px-4 pt-8"}>
          <div className={"flex flex-row items-end justify-between pb-1"}>
            <span className="relative text-foreground-500">Library Information</span>
            <Button color={"primary"} onClick={(e) => handleSubmit(e)}>
              Save
            </Button>
          </div>
          <Divider />
          <div className={"mt-8"}>
            <Input
              isRequired
              label="Library Name"
              labelPlacement="outside"
              placeholder="Enter library name"
              type="text"
              variant={"flat"}
              value={data?.name}
              onChange={(e) => setData({ ...data, name: e.target.value || "" })}
            />
          </div>
          <div className={"mt-4"}>
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
          </div>
          <div className={"mt-4"}>
            <Textarea
              label="Library Description"
              labelPlacement="outside"
              placeholder="Enter library description"
              description="Maximum 200 characters"
              type="text"
              variant={"flat"}
              value={data?.description || ""}
              onChange={(e) => textareaOnChange(e)}
            />
          </div>
        </form>
        <div className={"w-full max-w-4xl pt-12"}>
          <span className="relative text-foreground-500">Prompt</span>
          <Divider />
          {data?.extraction_prompt_id ? (
            <PromptFrom agentId={id} defaultPromptId={data?.extraction_prompt_id} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
