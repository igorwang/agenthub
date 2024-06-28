"use client";

import {
  Avatar,
  Button,
  Input,
  Textarea,
  Divider,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import PromptFrom from "@/components/PromptFrom";
import RightHeader from "@/components/RightHeader";
import {
  Agent_Set_Input,
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
} from "@/graphql/generated/types";

interface Agent {
  id?: string;
  name?: string;
  description?: string | null | undefined;
  avatar?: string | null | undefined;
}

export default function Component() {
  const [data, setData] = useState<Agent | null>();
  const [updateAgentMutation] = useUpdateAgentMutation();
  const router = useRouter();
  const pathname = usePathname();

  const pathList = pathname.split("/");
  const id = pathList[pathList.length - 2];
  const query = useGetAgentByIdQuery({ variables: { id: id } });

  useEffect(() => {
    setData(query?.data?.agent_by_pk);
  }, [query]);

  function handleSubmit(e: any) {
    const input: Agent_Set_Input = {
      name: data?.name,
      description: data?.description,
      avatar: data?.avatar,
    };
    delete input.id;
    updateAgentMutation({
      variables: {
        pk_columns: { id: id },
        _set: input,
      },
    }).then(() => {
      toast.success("Agent information update succeeded！");
    });
  }

  return (
    <div className="w-full">
      <RightHeader title={"Agent Setting"} callBackUri={`/chat/${id}`} />
      <div className={"flex flex-col items-center"}>
        <form className={"gap-16 pt-8 px-4 w-full max-w-4xl  "}>
          <div className={"flex justify-between"}>
            <span className="relative text-foreground-500">Agent Information</span>
            <Button
              color={"primary"}
              onClick={(e) => handleSubmit(e)}>
              Save
            </Button>
          </div>
          <Divider />
          <div className={"mt-4"}>Avatar</div>
          <div className={"flex justify-center"}>
            {data?.avatar ? <Avatar src={data?.avatar} /> :
              <Avatar
                className="flex-shrink-0 bg-blue-400"
                size="md"
                name={data?.name?.charAt(0)}
                classNames={{ name: "text-xl" }}
              />}
          </div>
          <div className={"mt-8"}>
            <Input
              isRequired
              label="Agent Name"
              labelPlacement="outside"
              placeholder="Enter agent name"
              type="text"
              variant={"flat"}
              value={data?.name}
              onChange={(e) => setData({ ...data, name: e.target.value || "" })}
            />
          </div>
          <div className={"mt-4"}>
            <Textarea
              label="Agent Description"
              labelPlacement="outside"
              placeholder="Enter agent description"
              type="text"
              variant={"flat"}
              value={data?.description || ""}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
          </div>
        </form>
        <div className={"w-full pt-12 max-w-4xl"}>
          <span className="relative text-foreground-500">Prompt</span>
          <Divider />
          <PromptFrom />
        </div>
      </div>

    </div>
  );
}
