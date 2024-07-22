"use client";
import LibraryList from "@/components/LibrarySideBar/library-list";
import {
  Knowledge_Base_Type_Enum,
  KnowledgeBaseFragmentFragment,
  useCreateOneKnowledgeBaseMutation,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface LibrarySideBarProps {
  items: KnowledgeBaseFragmentFragment[];
}

export default function LibrarySideBar({ items }: LibrarySideBarProps) {
  const [listItems, setListItems] = useState(items);

  const [createOneKnowledgeBaseMutation] = useCreateOneKnowledgeBaseMutation();
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;

  function handleCreateOneKnowledgeBase() {
    createOneKnowledgeBaseMutation({
      variables: {
        object: {
          name: "New library",
          base_type: Knowledge_Base_Type_Enum.Professional,
          creator_id: userId,
        },
      },
    }).then((res) => {
      toast.success("Successfully add new library");
      setListItems((prev) => [
        res.data?.insert_knowledge_base_one as KnowledgeBaseFragmentFragment,
        ...prev,
      ]);
      //   refetch();
      //   router.push(`/library/${res?.data?.insert_knowledge_base_one?.id}/settings`);
    });
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-2 py-4 text-3xl font-semibold leading-7">
        <div>Library</div>
        <Tooltip content="Add new library">
          <Icon
            className={"cursor-pointer pt-1"}
            onClick={() => handleCreateOneKnowledgeBase()}
            icon="material-symbols-light:library-add-outline"
            fontSize={36}
          />
        </Tooltip>
      </div>
      <LibraryList items={listItems}></LibraryList>
    </div>
  );
}
