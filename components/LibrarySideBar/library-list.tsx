"use client";

import { KnowledgeBaseFragmentFragment } from "@/graphql/generated/types";
import { Listbox, ListboxItem, ScrollShadow } from "@nextui-org/react";

interface LibraryListProps {
  items: KnowledgeBaseFragmentFragment[];
}

const LibraryList: React.FC<LibraryListProps> = ({ items }) => {
  return (
    <div>
      <ScrollShadow className="w-full max-w-[260px] border-default-200 px-1">
        <Listbox
          aria-label="Actions"
          //   onAction={(key) => router.push("/library/" + key.toString())}
        >
          {items.map((item) => (
            <ListboxItem
              key={item?.id}
              //   endContent={
              //     <Icon icon="ep:edit" onClick={(e) => onClickEditIcon(e, item?.id)} />
              //   }
            >
              {item?.name || "-"}
            </ListboxItem>
          ))}
        </Listbox>
      </ScrollShadow>
    </div>
  );
};

LibraryList.displayName = "LibraryList";
export default LibraryList;
