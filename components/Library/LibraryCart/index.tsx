import LibraryGrid from "@/components/Library/LibraryCart/library-grid";
import {
  Order_By,
  useAddALibraryToAgentMutation,
  useGetKbListQuery,
  useKnowledgeBaseListQuery,
  useRemoveALibraryFromAgentMutation,
} from "@/graphql/generated/types";
import { LibraryCardType } from "@/types/chatTypes";
import { cn } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
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

  const [addALibraryToAgentMutation] = useAddALibraryToAgentMutation();
  const [removeALibraryFromAgentMutation] = useRemoveALibraryFromAgentMutation();

  const selectedLibrariesQuery = useGetKbListQuery({
    variables: {
      where: { agent_id: { _eq: agentId } },
    },
    skip: !agentId,
  });

  const publicLibrariesQuery = useKnowledgeBaseListQuery({
    variables: {
      order_by: { updated_at: Order_By.Desc },
      where: {
        _or: [
          { is_publish: { _eq: true } },
          { creator_id: { _eq: session.data?.user?.id } },
        ],
      },
    },
  });

  useEffect(() => {
    if (publicLibrariesQuery.data?.knowledge_base) {
      const librariesData = publicLibrariesQuery.data?.knowledge_base.map((item) => ({
        id: item.id,
        name: item.name,
        base_type: item.base_type,
        description: item.description || "",
        updatedAt: item.updated_at,
      }));
      setLibraries(librariesData);
    }
  }, [publicLibrariesQuery.data]);

  useEffect(() => {
    if (selectedLibrariesQuery.data?.r_agent_kb) {
      const selectedLibrariesData = selectedLibrariesQuery.data?.r_agent_kb.map(
        (item) => ({
          id: item.id,
          agentId: item.agent_id,
          libraryId: item.kb_id,
        }),
      );
      setSelectedLibraries(selectedLibrariesData);
    }
  }, [selectedLibrariesQuery.data]);

  const handleAddLibrary = async (libraryId: string) => {
    if (agentId) {
      try {
        const response = await addALibraryToAgentMutation({
          variables: { object: { agent_id: agentId, kb_id: libraryId } },
        });
        toast.info("Add succeeded");
        setSelectedLibraries((prev) => {
          const newLibraryId = response.data?.insert_r_agent_kb_one?.id;
          if (newLibraryId) {
            return [
              ...prev,
              {
                id: newLibraryId,
                libraryId: libraryId,
                agentId: agentId,
              },
            ];
          }
          return prev;
        });
        selectedLibrariesQuery.refetch();
      } catch (error) {
        toast.error("System error. Please try later.");
      }
    }
  };

  const handleRemoveLibrary = async (libraryId: string) => {
    const removeLibrary = selectedLibraries?.find((item) => item.libraryId === libraryId);
    if (removeLibrary) {
      try {
        await removeALibraryFromAgentMutation({
          variables: { id: removeLibrary.id },
        });
        setSelectedLibraries((prev) =>
          prev?.filter((item) => item.id !== removeLibrary.id),
        );
        toast.info("Remove success");

        // 添加重新获取数据的调用
        await Promise.all([
          selectedLibrariesQuery.refetch(),
          publicLibrariesQuery.refetch(),
        ]);
      } catch (error) {
        toast.error("System error. Please try later.");
      }
    }
  };

  const sortedLibraries = React.useMemo(() => {
    if (!libraries) return [];
    return libraries.sort((a, b) => {
      const aSelected = selectedLibraries.some((sl) => sl.libraryId === a.id);
      const bSelected = selectedLibraries.some((sl) => sl.libraryId === b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [libraries, selectedLibraries]);

  return (
    <div
      className={cn(
        "my-auto flex w-full max-w-7xl flex-col items-start gap-2",
        className,
      )}>
      <LibraryGrid
        libraries={sortedLibraries}
        selectedLibraries={selectedLibraries}
        onAddLibrary={handleAddLibrary}
        onRemoveLibrary={handleRemoveLibrary}
      />
    </div>
  );
}

export { LibraryCart };
