"use client";
import LibraryList from "@/components/LibrarySideBar/library-list";
import {
  Knowledge_Base_Type_Enum,
  KnowledgeBaseFragmentFragment,
  useCreateOneKnowledgeBaseMutation,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { Divider, Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LibrarySideBarProps {
  items: KnowledgeBaseFragmentFragment[];
}

export default function LibrarySideBar({ items }: LibrarySideBarProps) {
  const [listItems, setListItems] = useState(items);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const router = useRouter();
  const [createOneKnowledgeBaseMutation] = useCreateOneKnowledgeBaseMutation();
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;

  useEffect(() => {
    if (listItems.length > 0 && selectedItemId === null) {
      setSelectedItemId(listItems[0].id);
      router.push(`/discover/${listItems[0].id}`);
    }
  }, [listItems, selectedItemId]);

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

  function handleItemClick(id: string) {
    setSelectedItemId(id);
    router.push(`/discover/${id}`);
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto border-r-small">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-2 py-2 text-3xl font-semibold leading-7">
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
      <Divider />
      <LibraryList
        items={listItems}
        selectedItemId={selectedItemId}
        onItemClick={handleItemClick}></LibraryList>
    </div>
  );
}
