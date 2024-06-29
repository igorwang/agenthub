"use client";

import { LibraryCardProps } from "@/components/FunctionTab/libaray-card";
import LibrarySideBar from "@/components/FunctionTab/library-sidebar";
import { TopicHistory } from "@/components/TopicHistory";
import { PlusIcon } from "@/components/ui/icons";
import UploadZone from "@/components/UploadZone";
import {
  selectSelectedChatId,
  selectSelectedSessionId,
  selectSession,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { Button, Divider, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useAddNewTopicMutationMutation,
  useGetKbListQuery,
  useGetTopicHistoriesQuery,
} from "../../graphql/generated/types";

export type FunctionTabProps = {
  agentId: string;
};
export default function FunctionTab({ agentId }: FunctionTabProps) {
  const dispatch: AppDispatch = useDispatch();
  const selectedChatId = useSelector(selectSelectedChatId);
  const selectedSessionId = useSelector(selectSelectedSessionId);
  const [libraries, setLibraries] = useState<LibraryCardProps[]>();
  const [selectedLibrary, setSelectedLibrary] = useState<LibraryCardProps>();
  const [knowledgeBaseId, setKnowledgeBaseId] = useState(selectedLibrary?.id);

  const session = useSession();
  const userId = session.data?.user?.id;
  // const agent_id = selectedChatId;

  const [addNewTopicMutation, { data, loading, error }] =
    useAddNewTopicMutationMutation();

  const { refetch: refetchTopicHistories } = useGetTopicHistoriesQuery({
    variables: { agent_id: agentId, user_id: userId },
    skip: !agentId || !userId, // Skip the query if agent_id or user_id is not available
  });

  const { data: kbData } = useGetKbListQuery({
    variables: {
      where: { agent_id: { _eq: agentId } }, // value for 'where'
    },
    skip: !agentId,
  });

  useEffect(() => {
    setLibraries(
      kbData?.r_agent_kb.map((item) => ({
        id: item.knowledge_base.id,
        name: item.knowledge_base.name,
        description:
          item.knowledge_base.description ||
          "Find comprehensive information, expert insights, and solutions to common issues in our Knowledge Base. Your go-to resource for all your questions and needs.",
        creator: item.knowledge_base.creator_id,
        base_type: item.knowledge_base.base_type,
      })),
    );
  }, [kbData]);

  useEffect(() => {
    setKnowledgeBaseId(selectedLibrary?.id);
  }, [selectedLibrary]);

  const handleAddTopic = async ({ agent_id, user_id }: AddTopicParams) => {
    try {
      const { data, errors } = await addNewTopicMutation({
        variables: {
          title: "New Topic",
          user_id: user_id,
          agent_id: agent_id,
        },
      });
      if (errors) {
        console.error(errors);
      } else {
        toast.success("Add success!", {
          duration: 1000,
          position: "bottom-left",
        });
        const new_sid = data?.insert_topic_history_one?.id;
        if (new_sid) {
          dispatch(selectSession(new_sid));
        }
        refetchTopicHistories();
      }
    } catch (error) {
      console.error("Error adding topic:", error);
      toast.success("系统错误请稍后重试", {
        duration: 1000,
        position: "bottom-left",
      });
    }
  };
  const element = selectedLibrary?.creator === userId && (
    <UploadZone knowledgeBaseId={selectedLibrary?.id}></UploadZone>
  );

  return (
    <div className="flex h-full w-full flex-col overflow-auto pt-2">
      <Tabs aria-label="Options" variant="light" className="flex flex-col">
        <Tab
          key="topic"
          className="flex h-full w-full flex-col overflow-auto"
          title={
            <div className="flex items-center space-x-2">
              <span>Topic</span>
            </div>
          }
        >
          <Button
            className="flex max-h-16 w-full bg-white hover:bg-slate-100"
            endContent={<PlusIcon />}
            onClick={() => handleAddTopic({ agent_id: agentId, user_id: userId })}
            disabled={!userId}
          >
            New Topic
          </Button>
          <ScrollShadow className="flex max-h-full min-h-10 flex-grow flex-col gap-6 pb-8">
            {agentId && <TopicHistory agent_id={agentId} />}
          </ScrollShadow>
        </Tab>
        <Tab
          key="library"
          title={
            <div className="flex h-full w-full flex-col overflow-auto">
              {/* <BookIcon /> */}
              <span>Library</span>
            </div>
          }
        >
          <LibrarySideBar
            cards={libraries || []}
            setSelectedLibrary={setSelectedLibrary}
          ></LibrarySideBar>
          <Divider className="mt-2" />
          {selectedLibrary?.creator === userId && knowledgeBaseId && (
            <UploadZone
              key={knowledgeBaseId}
              knowledgeBaseId={knowledgeBaseId}
            ></UploadZone>
          )}
        </Tab>
        <Tab
          key="setting"
          title={
            <div className="flex items-center space-x-2">
              {/* <TopicFolderIcon /> */}
              <span>Settings</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
