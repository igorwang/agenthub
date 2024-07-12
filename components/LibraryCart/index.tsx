"use client";
import LibraryGrid from "@/components/LibraryCart/library-grid";
import { useGetKbListQuery, useKnowledgeBaseListQuery } from "@/graphql/generated/types";
import { LibraryCardType } from "@/types/chatTypes";
import { cn } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface LibraryCartProps {
  agentId?: string;
  className?: string;
}

function LibraryCart({ agentId, className }: LibraryCartProps) {
  const session = useSession();
  const [libraries, setLibraries] = useState<LibraryCardType[]>();
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

  //   const { data, loading, error } = selectedLibrariesQuery;
  //   if (publicLibrariesQuery.loading) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <div
      className={cn(
        "my-auto flex w-full max-w-7xl flex-col items-start gap-2",
        className,
      )}>
      <LibraryGrid libraries={libraries} />
    </div>
  );
}

export { LibraryCart };
