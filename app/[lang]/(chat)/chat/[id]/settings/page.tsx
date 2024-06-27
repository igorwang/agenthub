"use client";

import React, { useEffect, useState } from "react";
import {
  Input,
  Avatar,
  Button, Textarea,
} from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

import NameAvatar from "../../../../../../components/NameAvatar";

import {
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
  Agent_Set_Input,
} from "@/graphql/generated/types";
import RightHeader from "@/components/RightHeader";


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
      router.back();
    });
  }

  return (
    <div className="w-full">
      <RightHeader title={"Agent Setting"} />
      <div className={"flex justify-center"}>
        <form className={"gap-16 py-16 px-4 w-full max-w-2xl  "}>
          <span className="relative text-foreground-500">Agent Information</span>
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
          <div className={"mt-4"}>Avatar</div>
          <div className={"flex justify-center"}>
            {data?.avatar ? <Avatar src={data?.avatar} /> : <NameAvatar name={data?.name} />}
          </div>
          <Button color={"primary"} className={"w-full mt-8"} onClick={(e) => handleSubmit(e)}>Submit</Button>
        </form>
      </div>
    </div>
  );
}
