"use client";

import DeleteModal from "@/components/ui/delete-modal";
import { DiscussionIcon, OcticonKebabHorizontalIcon } from "@/components/ui/icons";
import {
  useAddNewTopicMutationMutation,
  useDeleteTopicHistoryByIdMutation,
  useGetTopicHistoriesQuery,
} from "@/graphql/generated/types";
import {
  selectRefreshSession,
  selectSelectedChatId,
  selectSelectedSessionId,
  selectSession,
  setIsChangeSession,
  setRefreshSession,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { Icon } from "@iconify/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  ScrollShadow,
} from "@nextui-org/react";
import { formatDate } from "date-fns";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface TopicHistoryProps {
  agent_id?: string;
}

export function TopicHistory({ agent_id }: TopicHistoryProps) {
  const dispatch: AppDispatch = useDispatch();
  const selectedChatId = useSelector(selectSelectedChatId);
  const selectedSessionId = useSelector(selectSelectedSessionId);
  const refreshSession = useSelector(selectRefreshSession);
  const [deleteID, setDeleteID] = useState<string | null>(null);
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;
  const t = useTranslations();

  const router = useRouter();
  const pathname = usePathname();
  const params: { id: string } = useParams();
  const [addNewTopicMutation] = useAddNewTopicMutationMutation();
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const getTopicListQuery = useGetTopicHistoriesQuery({
    variables: {
      agent_id: params.id,
      user_id: userId || "",
      limit: 100,
    },
    skip: !params.id || !userId,
  });
  const { data, loading, error, refetch } = getTopicListQuery;

  const [deleteTopicHistoryByIdMutation] = useDeleteTopicHistoryByIdMutation();

  const handleExport = useCallback(
    async (itemId: string) => {
      try {
        const response = await fetch("/api/chat/session/export_document", {
          method: "POST",
          body: JSON.stringify({ session_id: itemId }),
        });
        const data = await response.json();
        if (data.url) {
          window.open(data.url, "_blank");
        } else {
          toast.error(t("Failed to export document"));
        }
      } catch (error) {
        console.error("Error exporting document", error);
        toast.error(t("Failed to export document"));
      }
    },
    [t],
  );

  useEffect(() => {
    getTopicListQuery.refetch();
    if (refreshSession) {
      dispatch(setRefreshSession(false));
    }
  }, [getTopicListQuery, selectedSessionId, refreshSession, dispatch]);

  if (!status) {
    return null;
  }

  if (loading) {
    return <div className="p-4 text-center">{t("Loading")}...</div>;
  }

  const histories = data?.topic_history.map((item) => ({
    id: item.id,
    title: item.title,
    agent_id: item.agent_id,
    updated_at: item.updated_at || item.created_at,
  }));

  const defaultSelectedKey = data?.topic_history[0]?.id;

  const handleSelect = (sId: string) => {
    dispatch(selectSession(sId));
    dispatch(setIsChangeSession(true));
    router.push(`${pathname}?session_id=${sId}`);
  };

  const handleDelete = (itemId: string) => {
    deleteTopicHistoryByIdMutation({
      variables: {
        id: itemId,
      },
    }).then(() => {
      setDeleteID(null);
      refetch();
    });
  };

  const handleAddNewTopic = async () => {
    const response = await addNewTopicMutation({
      variables: {
        agent_id: params.id,
        user_id: userId || "",
        title: t("New Chat"),
      },
    });
    if (response.data) {
      const newTopicId = response.data.insert_topic_history_one?.id;
      dispatch(setIsChangeSession(true));
      handleSelect(newTopicId);
      refetch();
    }
  };

  const dropdownContent = (itemId: string) => (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          className="absolute right-2 top-0.5 h-8 min-w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          variant="light"
          startContent={<OcticonKebabHorizontalIcon className="h-4 w-4" />}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Topic Actions">
        <DropdownItem
          key="export"
          onClick={() => {
            handleExport(itemId);
          }}>
          {t("Export Session")}
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteID(itemId);
          }}>
          {t("Delete")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  const historyItems = histories?.map((item) => (
    <ListboxItem
      key={item.id}
      className={`group relative flex h-10 items-center px-2 py-1 ${
        selectedSessionId === item.id ? "bg-primary-100" : "hover:bg-slate-100"
      }`}
      startContent={<DiscussionIcon className="mr-2 h-4 w-4" />}
      textValue={item.title}
      onClick={() => handleSelect(item.id)}>
      <div className="w-full truncate pr-8">{item.title}</div>
      <div className="text-xs text-gray-500">
        {formatDate(item.updated_at, "yyyy-MM-dd HH:mm")}
      </div>
      <div
        className="absolute right-0 top-0 flex h-full w-10 items-center justify-center"
        onClick={(e) => e.stopPropagation()}>
        {dropdownContent(item.id)}
      </div>
    </ListboxItem>
  ));

  return (
    <div className="flex h-full flex-col gap-2">
      <h2 className="px-4 text-center text-xs font-normal uppercase tracking-wide text-gray-500">
        {t("Chat History")}
      </h2>
      <Button
        variant="light"
        color="primary"
        startContent={<Icon icon="mdi:plus" className="text-lg" />}
        className="w-full rounded-lg px-4 text-sm font-medium transition-all hover:bg-primary-50 hover:text-primary-600"
        onClick={handleAddNewTopic}>
        {t("Start New Chat")}
      </Button>

      <ScrollShadow className="custom-scrollbar h-full">
        {historyItems && (
          <Listbox
            aria-label="TopicHistory"
            selectionMode="single"
            className="p-0"
            defaultSelectedKeys={[defaultSelectedKey]}
            hideSelectedIcon={true}>
            {historyItems}
          </Listbox>
        )}
      </ScrollShadow>
      {deleteID && (
        <DeleteModal
          id={deleteID}
          title="Delete Session"
          name=""
          isOpen={deleteID !== null}
          onClose={() => setDeleteID(null)}
          onAffirm={() => handleDelete(deleteID)}
        />
      )}
    </div>
  );
}
