"use client";

import {
  DiscussionIcon,
  OcticonKebabHorizontalIcon,
  PlusIcon,
} from "@/components/ui/icons";
import {
  useAddNewTopicMutationMutation,
  useGetTopicHistoriesQuery,
} from "@/graphql/generated/types";
import { selectSelectedSessionId, selectSession } from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface TopicHistoryProps {
  agent_id?: string;
}

export const TopicHistory: React.FC<TopicHistoryProps> = ({ agent_id }) => {
  const dispatch: AppDispatch = useDispatch();
  const selectedSessionId = useSelector(selectSelectedSessionId);
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;

  const router = useRouter();
  const pathname = usePathname();
  const params: { id: string } = useParams();
  const [addNewTopicMutation] = useAddNewTopicMutationMutation();
  const getTopicListQuery = useGetTopicHistoriesQuery({
    variables: {
      agent_id: params.id,
      user_id: userId || "",
      limit: 100,
    },
    skip: !params.id || !userId,
  });
  const { data, loading, error } = getTopicListQuery;
  useEffect(() => {
    getTopicListQuery.refetch();
  }, [selectedSessionId]);

  useEffect(() => {
    if (data && data.topic_history && data.topic_history.length > 0) {
      const session_id = data.topic_history[0].id;
      // dispatch(selectSession(session_id));
      // if (session_id) {
      //   router.push(`${pathname}?session_id=${session_id}`);
      // }
    }
  }, [data, params.id, dispatch]);

  if (!status) {
    return <div></div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const histories = data?.topic_history.map((item) => ({
    id: item.id,
    title: item.title,
    agent_id: item.agent_id,
  }));

  const defaultSelectedKey = data?.topic_history[0]?.id;

  const handleSelect = (sId: string) => {
    dispatch(selectSession(sId));
    router.push(`${pathname}?session_id=${sId}`);
  };

  const dropdownContent = (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          className="absolute right-1 top-0.5 max-h-full"
          variant="light"
          startContent={<OcticonKebabHorizontalIcon />}></Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {/* <DropdownItem key="new">New file</DropdownItem> */}
        {/* <DropdownItem key="copy">Copy link</DropdownItem> */}
        <DropdownItem key="edit">Rename</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  const historyItems = histories?.map((item) => {
    return (
      <ListboxItem
        classNames={{ base: "flex py-2 px-4 bg-slate-100 h-full" }}
        className={selectedSessionId === item.id ? "bg-primary-100" : "bg-slate-100"}
        key={item.id}
        startContent={<DiscussionIcon className="hidden" />}
        endContent={dropdownContent}
        shouldHighlightOnFocus={true}
        onClick={() => handleSelect(item.id)}>
        {item.title}
      </ListboxItem>
    );
  });

  const handleAddTopic = async ({ agent_id, user_id }: AddTopicParams) => {
    console.log("pathname", pathname);
    dispatch(selectSession(null));
    // try {
    //   const { data, errors } = await addNewTopicMutation({
    //     variables: {
    //       title: "New Chat",
    //       user_id: user_id,
    //       agent_id: agent_id,
    //     },
    //   });
    //   if (errors) {
    //     console.error(errors);
    //   } else {
    //     toast.success("Add success!", {
    //       duration: 1000,
    //       position: "bottom-left",
    //     });
    //     const new_sid = data?.insert_topic_history_one?.id;
    //     if (new_sid) {
    //       dispatch(selectSession(new_sid));
    //     }
    //     getTopicListQuery.refetch();
    //   }
    // } catch (error) {
    //   console.error("Error adding topic:", error);
    //   toast.success("系统错误请稍后重试", {
    //     duration: 1000,
    //     position: "bottom-left",
    //   });
    // }
  };

  return (
    <div className="flex flex-col">
      <Button
        className="flex w-full bg-white hover:bg-slate-100"
        endContent={<PlusIcon />}
        onClick={() => handleAddTopic({ agent_id: params.id, user_id: userId })}
        disabled={!userId}>
        New Chat
      </Button>
      {historyItems && (
        <Listbox
          aria-label="TopicHistory"
          selectionMode="single"
          className="h-full"
          defaultSelectedKeys={[defaultSelectedKey]}
          hideSelectedIcon={true}>
          {historyItems}
        </Listbox>
      )}
    </div>
  );
};
