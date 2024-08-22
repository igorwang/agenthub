"use client";

import { KnowledgeBaseFragmentFragment } from "@/graphql/generated/types";
import { cn, Listbox, ListboxItem } from "@nextui-org/react";

interface LibraryListProps {
  items: KnowledgeBaseFragmentFragment[];
  selectedItemId: string | null;
  onItemClick: (id: string) => void;
}

const LibraryList: React.FC<LibraryListProps> = ({
  items,
  selectedItemId,
  onItemClick,
}) => {
  return (
    <div
      className={cn(
        "h-full overflow-auto",
        "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
        "scrollbar-none hover:scrollbar-default",
      )}>
      <Listbox
        aria-label="Actions"
        //   onAction={(key) => router.push("/library/" + key.toString())}
      >
        {items.map((item) => (
          <ListboxItem
            key={item?.id}
            onClick={() => onItemClick(item.id)}
            className={cn(
              "cursor-pointer p-2",
              "max-w-[200px] overflow-hidden text-ellipsis",
              selectedItemId === item.id ? "bg-blue-100" : "",
            )}>
            {/* <Tooltip content={item?.name}> */}
            {/* <p className="max-w-[180px] overflow-hidden text-ellipsis"> */}
            {item?.name || "-"}
            {/* </p> */}
            {/* </Tooltip> */}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
};

LibraryList.displayName = "LibraryList";
export default LibraryList;
