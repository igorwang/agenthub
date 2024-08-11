"use client";
import { useDeleteAgentUserRelationMutation } from "@/graphql/generated/types";
import { selectChat } from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { ChatDTO, GroupedChatListDTO } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Button,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface ChatListProps {
  chatListOpenStatus: boolean;
  setChatListOpenStatus?: (status: boolean) => void;
  groupedChatList: GroupedChatListDTO[];
}

interface ReturnButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

const ReturnButton: React.FC<ReturnButtonProps> = ({ onClick, isVisible }) => {
  if (!isVisible) return null;
  return (
    <Button
      color="primary"
      variant="light"
      size="sm"
      startContent={<Icon icon="mdi:arrow-left" />}
      className="h-auto min-h-0 justify-start font-normal hover:bg-transparent active:bg-transparent data-[hover]:bg-transparent"
      onClick={onClick}>
      Return to Agent List
    </Button>
  );
};

export const ChatList: React.FC<ChatListProps> = ({
  chatListOpenStatus = false,
  groupedChatList,
  setChatListOpenStatus,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [showIconId, setShowIconId] = useState("");
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const [deleteAgentUserRelationMutation] = useDeleteAgentUserRelationMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAgent, setDeleteAgent] = useState<ChatDTO | null>(null);
  const [fixedChatList, setFixedChatList] = useState<GroupedChatListDTO[] | null>(null);
  const params = useParams<{ id: string }>();

  const session = useSession();
  const userId = session?.data?.user?.id;

  useEffect(() => {
    const initialOpenStates: Record<number, boolean> = {};
    groupedChatList.forEach((group) => {
      initialOpenStates[group.id] = true;
    });
    setOpenStates(initialOpenStates);
    const shortList = groupedChatList
      .map((group) => ({
        ...group,
        agents: group.agents.filter((agent) => agent.id === params.id),
      }))
      .filter((group) => group.agents.length > 0);
    if (shortList && !chatListOpenStatus) {
      setFixedChatList(shortList);
    } else {
      setFixedChatList(groupedChatList);
    }
  }, [groupedChatList, chatListOpenStatus]);

  const toggleListbox = (id: number) => {
    setOpenStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };

  const handleSelectChat = (selectId: string) => {
    dispatch(selectChat(selectId));
    const shortList = groupedChatList
      .map((group) => ({
        ...group,
        agents: group.agents.filter((agent) => agent.id === selectId),
      }))
      .filter((group) => group.agents.length > 0);
    setChatListOpenStatus?.(false);
    setFixedChatList(shortList);
    router.push(`/chat/${selectId}?openStatus=0`);
  };

  const handleUnsubscribeClick = (item: ChatDTO) => {
    setIsModalOpen(true);
    setDeleteAgent(item);
  };

  const handleDeleteAgentRelation = () => {
    const deletedId = deleteAgent?.id;
    deleteAgentUserRelationMutation({
      variables: {
        where: {
          _and: [{ agent_id: { _eq: deleteAgent?.id } }, { user_id: { _eq: userId } }],
        },
      },
    });
    setDeleteAgent(null);
    setIsModalOpen(false);
    if (deletedId == params.id) {
      router.push("/chat");
    }
  };

  const handleReturn = () => {
    setChatListOpenStatus?.(true);
    setFixedChatList(groupedChatList);
  };

  console.log("fixedChatList", fixedChatList);
  const chatListContent = (fixedChatList || []).map((group) => (
    <div className="relative flex w-full flex-col" key={group.id}>
      {group.name &&
        group.name != "system" &&
        group.name != "default" &&
        chatListOpenStatus && (
          <div className="flex h-12 flex-row items-center justify-between bg-slate-100 px-2 pb-2 hover:bg-slate-200">
            <div className="overflow-hidden text-ellipsis text-nowrap text-sm">
              {group.name}
            </div>
            <div className="flex flex-row items-center">
              <Button isIconOnly variant="light">
                <Icon icon="octicon:kebab-horizontal-16" />
              </Button>
              <Button isIconOnly variant="light" onClick={() => toggleListbox(group.id)}>
                <Icon
                  icon={
                    openStates[group.id]
                      ? "octicon:chevron-down-16"
                      : "octicon:chevron-right-16"
                  }
                />
              </Button>
            </div>
          </div>
        )}
      {openStates[group.id] && (
        <Listbox
          key={group.id}
          classNames={{
            base: "max-w-xs",
            list: "max-h-[300px] overflow-scroll",
          }}
          label="Assigned to"
          selectionMode="single"
          variant="flat"
          hideSelectedIcon={true}>
          {group.agents.map((item) => (
            <ListboxItem
              key={item.id}
              textValue={item.name}
              className={`relative ${item.id == params?.id ? "bg-blue-200" : ""}`}
              onClick={() => {
                handleSelectChat(item.id);
                setChatListOpenStatus?.(false);
              }}>
              <div
                className="flex w-full justify-between"
                onMouseEnter={() => setShowIconId(item.id)}
                onMouseLeave={() => setShowIconId("")}>
                <div className="flex items-center gap-2">
                  {item.avatar ? (
                    <Avatar
                      alt={item.name}
                      className="flex-shrink-0"
                      size="sm"
                      src={
                        item.avatar ||
                        "https://api.dicebear.com/8.x/fun-emoji/svg?seed=Tigger"
                      }
                    />
                  ) : (
                    <Avatar
                      className="flex-shrink-0 bg-blue-400"
                      size="sm"
                      name={item?.name?.charAt(0)}
                      classNames={{ name: "text-xl" }}
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-small">{item.name}</span>
                    <span className="max-w-[120px] truncate text-nowrap text-tiny text-default-400">
                      {item.description}
                    </span>
                  </div>
                </div>
                <Button
                  isIconOnly
                  className={`absolute right-0 bg-transparent transition-opacity duration-300 data-[hover]:bg-transparent ${
                    item.id === showIconId ? "opacity-100" : "opacity-0"
                  }`}
                  onPress={() => handleUnsubscribeClick(item)}>
                  <Icon
                    className="cursor-pointer"
                    icon="material-symbols:delete-outline-rounded"
                    fontSize={20}
                  />
                </Button>
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      )}
    </div>
  ));

  function _renderModal() {
    return (
      <Modal isOpen={isModalOpen} hideCloseButton={true}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Unsubscribe Agent</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to unsubscribe this agent: {deleteAgent?.name}?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button color="danger" onPress={handleDeleteAgentRelation}>
              Affirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <div className="flex flex-col">
      <ScrollShadow className="flex-grow" size={0}>
        {_renderModal()}
        <div>{chatListContent}</div>
      </ScrollShadow>
      <ReturnButton onClick={handleReturn} isVisible={!chatListOpenStatus} />
    </div>
  );
};
