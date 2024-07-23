"use client";
import { KnowledgeBaseDetailQuery } from "@/graphql/generated/types";

interface LibraryHeaderProps {
  library: KnowledgeBaseDetailQuery["knowledge_base_by_pk"];
}

export default function LibraryHeader({ library }: LibraryHeaderProps) {
  return (
    <div className="flex h-12 items-center justify-start">
      <div className="flex w-full flex-row justify-between">
        <h1
          className="max-w-[400px] truncate text-xl font-semibold text-gray-800"
          title={library?.name}>
          {library?.name}
        </h1>
        {/* <Tooltip content="Delete Library">
          <span
            className="cursor-pointer text-lg text-default-400 active:opacity-50"
            // onClick={() => onView(file)}
          >
            <Icon icon={"openmoji:delete"} fontSize={24} />
          </span>
        </Tooltip> */}
      </div>
    </div>
  );
}
