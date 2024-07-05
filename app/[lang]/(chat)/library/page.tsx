"use client";

import {
  Knowledge_Base_Type_Enum,
  Order_By,
  useCreateOneKnowledgeBaseMutation,
  useKnowledgeBaseListQuery,
} from "@/graphql/generated/types";
import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function LibraryPage() {
  const [createOneKnowledgeBaseMutation] = useCreateOneKnowledgeBaseMutation();
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;
  const router = useRouter();

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

  const { loading, error, data, refetch } = useKnowledgeBaseListQuery({
    variables: {
      where: { creator_id: { _eq: userId } },
      order_by: { updated_at: Order_By.DescNullsLast },
      limit: 1,
    },
  });

  if (loading) {
    return (
      <div className="flex w-dvw items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  if (data?.knowledge_base.length === 1) {
    router.push(`/library/${data?.knowledge_base[0].id}`);
  } else {
    return (
      <div className="flex w-full items-center justify-center">
        There is no any library , click
        <Button
          color="primary"
          className="mx-2"
          onClick={() => handleCreateOneKnowledgeBase()}>
          Add new library
        </Button>
        to add one.
      </div>
    );
  }
}

export default LibraryPage;
