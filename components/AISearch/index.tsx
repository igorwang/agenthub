"use client";
import SearchPanel from "@/components/AISearch/search-panel";
import {
  Order_By,
  useCreateNewTopicMutation,
  useGetTopicsQuery,
  useSubscriptionMessageListSubscription,
} from "@/graphql/generated/types";
import { MessageType } from "@/types/chatTypes";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type topicProps = {
  id: any;
  short_url?: string | null | undefined;
  title?: string;
  user_id?: any;
  created_at: any;
  updated_at: any;
};
export default function AISearch() {
  const sesssion = useSession();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [isChating, setIsChaing] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [topic, setTopic] = useState<topicProps>();
  const [createNewTopicMutation, { loading: createLoading }] =
    useCreateNewTopicMutation();

  const { data: messageData } = useSubscriptionMessageListSubscription({
    variables: {
      order_by: { created_at: Order_By.AscNullsLast }, // value for 'order_by'
      where: { id: { _eq: topic?.id } }, // value for 'where'
    },
    skip: !topic?.id,
  });

  const userId = sesssion.data?.user?.id;

  const {
    data: topicData,
    loading,
    error,
  } = useGetTopicsQuery({
    variables: {
      where: { short_url: { _eq: id } },
    },
    skip: !id,
  });

  useEffect(() => {
    console.log("topic:", topic);
    const fetchOrCreateTopic = async () => {
      if (topicData?.topic_history && topicData.topic_history.length > 0) {
        setTopic({ ...topicData.topic_history[0] });
      } else if (topicData?.topic_history && topicData.topic_history.length == 0) {
        try {
          const response = await createNewTopicMutation({
            variables: {
              object: { title: query || "New Topic", short_url: id, user_id: userId },
            },
          });
          const data = response.data?.insert_topic_history_one;
          if (data) {
            setTopic({ ...data });
          }
        } catch (error) {
          console.log(error);
          // toast.error("Create new topic failed, please try again.");
        }
      }
    };
    fetchOrCreateTopic();
  }, [id, topicData]);

  useEffect(() => {
    if (messageData) {
    }
  }, [messageData]);

  useEffect(() => {
    if (query && query.trim().length > 0) {
    }
  }, [query]);

  return (
    <div className="mx-auto flex h-full min-w-[460px] max-w-3xl flex-col space-y-2 px-12 pb-14 pt-12 sm:px-12 md:space-y-4 md:pb-24 md:pt-14">
      <SearchPanel></SearchPanel>
    </div>
  );
}
