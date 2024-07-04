"use client";

import {
  Knowledge_Base_Type_Enum,
  KnowledgeBaseItemFragment,
  Order_By,
  useCreateOneKnowledgeBaseMutation,
  useKnowledgeBaseListQuery,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Input,
  Listbox,
  ListboxItem,
  ScrollShadow,
  Spacer,
  Tooltip,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LibraryLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;

  function _renderLibraryHub() {
    const { loading, error, data, refetch } = useKnowledgeBaseListQuery({
      variables: {
        order_by: { updated_at: Order_By.DescNullsLast },
        where: { creator_id: { _eq: userId } },
      },
    });
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [filterData, setFilterData] = useState<KnowledgeBaseItemFragment[]>([]);
    const [createOneKnowledgeBaseMutation] = useCreateOneKnowledgeBaseMutation();

    useEffect(() => {
      if (typeof searchValue === "string") {
        const filter = data?.knowledge_base?.filter((it) =>
          it?.name.includes(searchValue),
        ) as KnowledgeBaseItemFragment[];
        setFilterData(filter);
      } else {
        setFilterData(data?.knowledge_base as KnowledgeBaseItemFragment[]);
      }
    }, [searchValue, data]);

    function onClickEditIcon(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      key: string,
    ) {
      e.stopPropagation;
      router.push(`/library/${key}/settings`);
    }

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
        refetch();
        router.push(`/library/${res?.data?.insert_knowledge_base_one?.id}/settings`);
      });
    }

    return (
      <div className="hidden h-full min-w-[200px] flex-col border-b-1 border-r-1 sm:flex">
        <div className="flex items-center justify-between px-2 pt-4 text-3xl font-semibold leading-7 text-default-foreground">
          <div>Library</div>
          <Tooltip content="Add new library">
            <Icon
              className={"cursor-pointer pt-1"}
              onClick={() => handleCreateOneKnowledgeBase()}
              icon="material-symbols-light:chat-add-on-outline"
              width={"1.2em"}
            />
          </Tooltip>
        </div>
        <Spacer y={4} />
        <Input
          fullWidth
          value={searchValue}
          labelPlacement="outside"
          placeholder={"Search..."}
          onValueChange={(value) => setSearchValue(value)}
          startContent={<Icon icon="solar:magnifer-linear" />}
        />
        <Spacer y={4} />
        <ScrollShadow className="w-full max-w-[260px] rounded-small border-small border-default-200 px-1 dark:border-default-100">
          <Listbox
            aria-label="Actions"
            onAction={(key) => router.push("/library/" + key.toString())}>
            {(filterData || []).map((item) => (
              <ListboxItem
                key={item?.id}
                endContent={
                  <Icon icon="ep:edit" onClick={(e) => onClickEditIcon(e, item?.id)} />
                }>
                {item?.name || "-"}
              </ListboxItem>
            ))}
          </Listbox>
        </ScrollShadow>
      </div>
    );
  }
  return (
    <div className="h-full w-full max-w-full">
      <div className="flex h-full flex-row">
        {_renderLibraryHub()}
        {children}
      </div>
    </div>
  );
}
