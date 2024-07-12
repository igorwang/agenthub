"use client";
import LibraryGrid from "@/components/LibraryCart/library-grid";
import {
  useAddALibraryToAgentMutation,
  useGetKbListQuery,
  useKnowledgeBaseListQuery,
  useRemoveALibraryFromAgentMutation,
} from "@/graphql/generated/types";
import { LibraryCardType } from "@/types/chatTypes";
import { cn } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LibraryCartProps {
  agentId?: string;
  className?: string;
}

export type selectedLibrariesType = {
  id: number;
  agentId: string;
  libraryId: string;
};

function LibraryCart({ agentId, className }: LibraryCartProps) {
  const session = useSession();
  const [libraries, setLibraries] = useState<LibraryCardType[]>();
  const [selectedLibraries, setSelectedLibraries] = useState<selectedLibrariesType[]>([]);

  useAddALibraryToAgentMutation;
  const [addALibraryToAgentMutation, addResponse] = useAddALibraryToAgentMutation();
  const [removeALibraryFromAgentMutation, removeResponse] =
    useRemoveALibraryFromAgentMutation();

  const selectedLibrariesQuery = useGetKbListQuery({
    variables: {
      where: { agent_id: { _eq: agentId } },
    },
    skip: !agentId,
  });
  const publicLibrariesQuery = useKnowledgeBaseListQuery({
    variables: {
      //    distinct_on: // value for 'distinct_on'
      //    limit: // value for 'limit'
      //    offset: // value for 'offset'
      //    order_by:
      where: { is_publish: { _eq: true } },
    },
  });

  useEffect(() => {
    console.log("publicLibrariesQuery", publicLibrariesQuery.data?.knowledge_base);
    if (publicLibrariesQuery.data?.knowledge_base) {
      const libraries = publicLibrariesQuery.data?.knowledge_base.map((item) => ({
        id: item.id,
        name: item.name,
        base_type: item.base_type,
        description: item.description || "",
        updatedAt: item.updated_at,
      }));
      setLibraries(libraries);
    }
  }, [publicLibrariesQuery.data]);

  useEffect(() => {
    if (selectedLibrariesQuery.data?.r_agent_kb) {
      const libraries = selectedLibrariesQuery.data?.r_agent_kb.map((item) => ({
        id: item.id,
        agentId: item.agent_id,
        libraryId: item.kb_id,
      }));
      setSelectedLibraries(libraries);
    }
  }, [selectedLibrariesQuery.data]);

  const handleAddLibrary = async (libraryId: string) => {
    if (agentId) {
      try {
        const response = await addALibraryToAgentMutation({
          variables: { object: { agent_id: agentId, kb_id: libraryId } },
        });
        toast.info("Add successed");
        setSelectedLibraries((prev) => {
          // 检查 response.data 是否存在以及所需的数据是否存在
          const newLibraryId = response.data?.insert_r_agent_kb_one?.id;
          if (newLibraryId) {
            // 如果新的 libraryId 存在，更新状态
            return [
              ...prev,
              {
                id: newLibraryId,
                libraryId: libraryId,
                agentId: agentId,
              },
            ];
          } else {
            // 如果新的 libraryId 不存在，返回原始状态
            return prev;
          }
        });
      } catch (error) {
        toast.error("System error. Please try later.");
      }
    }
  };

  const handleRemoveLibrary = async (libraryId: string) => {
    const removeLibrary = selectedLibraries?.find((item) => item.libraryId === libraryId);
    if (removeLibrary) {
      try {
        const response = await removeALibraryFromAgentMutation({
          variables: { id: removeLibrary.id },
        });
        setSelectedLibraries((prev) =>
          prev?.filter((item) => item.id != removeLibrary.id),
        );
        toast.info("Remove successed");
      } catch (erro) {
        toast.error("System error. Please try later.");
      }
    }
  };

  return (
    <div
      className={cn(
        "my-auto flex w-full max-w-7xl flex-col items-start gap-2",
        className,
      )}>
      <LibraryGrid
        libraries={libraries}
        selectedLibraries={selectedLibraries}
        onAddLibrary={handleAddLibrary}
        onRemoveLibrary={handleRemoveLibrary}
      />
    </div>
  );
}

export { LibraryCart };
