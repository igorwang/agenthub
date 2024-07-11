"use client";
import React, { useEffect, useState } from "react";

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
  Tooltip,
} from "@nextui-org/react";

import { useDeleteAgentUserRelationMutation } from "@/graphql/generated/types";
import {
  OcticonChevronDownIcon,
  OcticonChevronRightIcon,
  OcticonKebabHorizontalIcon,
} from "../ui/icons";

import { selectChat } from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { ChatDTO, GroupedChatListDTO } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

interface ChatListProps {
  chatListOpenStatus: boolean;
  setChatListOpenStatus?: (status: boolean) => void;
  groupedChatList: GroupedChatListDTO[];
}

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

  function handleMouseEnter(id: string) {
    setShowIconId(id);
  }

  function handleMouseLeave() {
    setShowIconId("");
  }

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
  const backElement = (
    <Tooltip content="Back">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onClick={() => {
          setChatListOpenStatus?.(true);
          setFixedChatList(groupedChatList);
        }}
        startContent={
          <Icon icon={"weui:back-filled"} className="ml-0 pl-0" fontSize={24}></Icon>
        }></Button>
    </Tooltip>
  );
  const chatListContent = (fixedChatList || []).map((group) => (
    <div className="flex flex-col" key={group.id}>
      {group.name && group.name != "system" && chatListOpenStatus && (
        <div className="flex h-12 flex-row items-center justify-between bg-slate-100 px-2 py-2 hover:bg-slate-200">
          <div className="overflow-hidden text-ellipsis text-nowrap text-sm">
            {group.name}
          </div>
          <div className="flex flex-row items-center">
            <Button isIconOnly variant="light">
              <OcticonKebabHorizontalIcon />
            </Button>
            <Button isIconOnly variant="light" onClick={() => toggleListbox(group.id)}>
              {openStates[group.id] ? (
                <OcticonChevronDownIcon />
              ) : (
                <OcticonChevronRightIcon />
              )}
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
          //   onSelectionChange={setValues}
          variant="flat"
          hideSelectedIcon={true}>
          {group.agents.map((item) => (
            <ListboxItem
              key={item.id}
              textValue={item.name}
              className={item.id == params?.id ? "bg-blue-200" : ""}
              onClick={() => {
                handleSelectChat(item.id);
                setChatListOpenStatus?.(false);
              }}
              onMouseEnter={() => handleMouseEnter(item?.id)}
              onMouseLeave={() => handleMouseLeave()}
              startContent={!chatListOpenStatus && backElement}>
              <div className={"flex justify-between"}>
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
                    {/* <Tooltip content={item.description}> */}
                    <span className="max-w-[120px] truncate text-nowrap text-tiny text-default-400">
                      {item.description}
                    </span>
                    {/* </Tooltip> */}
                  </div>
                </div>
                {item?.id === showIconId && (
                  <Button
                    isIconOnly
                    // disableAnimation
                    // disableRipple
                    onPress={() => handleUnsubscribeClick(item)}
                    className="bg-transparent data-[hover]:bg-transparent"
                    startContent={
                      <Icon
                        className={"cursor-pointer"}
                        // onClick={(e) => handleUnsubscribe(e, item.id)}
                        icon="material-symbols:delete-outline-rounded"
                        fontSize={20}
                      />
                    }></Button>
                )}
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
            <p>Are you sure you want to unsubscribe this agent : {deleteAgent?.name}?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button
              color="danger"
              onPress={() => {
                // setIsModalOpen(false);
                handleDeleteAgentRelation();
              }}>
              Affirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  return (
    <ScrollShadow className="-mr-2 flex h-full max-h-full flex-col justify-between py-2 pr-2">
      {_renderModal()}
      <div>{chatListContent}</div>
    </ScrollShadow>
  );
};
