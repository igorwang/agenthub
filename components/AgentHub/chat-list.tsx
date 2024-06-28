"use client";
import React, { useEffect, useState } from "react";

import {
  Avatar,
  Button,
  Listbox,
  ListboxItem,
  ScrollShadow,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalBody,
} from "@nextui-org/react";
import {
  OcticonChevronDownIcon,
  OcticonChevronRightIcon,
  OcticonKebabHorizontalIcon,
} from "../ui/icons";
import { useDeleteAgentUserRelationMutation } from "@/graphql/generated/types";

import { selectChat } from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { GroupedChatListDTO } from "@/types/chatTypes";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";

export const ChatList: React.FC<{ groupedChatList: GroupedChatListDTO[] }> = ({
                                                                                groupedChatList,
                                                                              }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [showIconId, setShowIconId] = useState("");
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const [deleteAgentUserRelation] = useDeleteAgentUserRelationMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);


  const session = useSession();
  const userId = session?.data?.user?.id;

  useEffect(() => {
    const initialOpenStates: Record<number, boolean> = {};
    groupedChatList.forEach((group) => {
      initialOpenStates[group.id] = true;
    });
    setOpenStates(initialOpenStates);
  }, [groupedChatList]);

  const toggleListbox = (id: number) => {
    setOpenStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };

  const handleSelectChat = (selectId: string) => {
    dispatch(selectChat(selectId));
    router.push(`/chat/${selectId}`);
  };

  function handleMouseEnter(id) {
    setShowIconId(id);
  };

  function handleMouseLeave() {
    setShowIconId("");
  };

  function handleUnsubscribe(e: React.MouseEvent<SVGSVGElement>, agentId: string) {
    e.stopPropagation();
    deleteAgentUserRelation({
      variables: {
        userId: { _eq: userId },
        agentId: { _eq: agentId },
      },
    }).then(r => setIsModalOpen(true));
  };

  const chatListContent = groupedChatList.map((group) => (
    <div className="flex flex-col" key={group.id}>
      {group.name && group.name != "system" && (
        <div className="flex flex-row justify-between px-2 py-2 items-center hover:bg-slate-200 bg-slate-100 h-12">
          <div className="text-sm text-nowrap text-ellipsis overflow-hidden">
            {group.name}
          </div>
          <div className="flex flex-row items-center">
            <Button isIconOnly variant="light">
              <OcticonKebabHorizontalIcon />
            </Button>
            <Button
              isIconOnly
              variant="light"
              onClick={() => toggleListbox(group.id)}
            >
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
          hideSelectedIcon={true}
        >
          {group.agents.map((item) => (
            <ListboxItem
              key={item.id}
              textValue={item.name}
              onClick={() => handleSelectChat(item.id)}
              onMouseEnter={() => handleMouseEnter(item?.id)}
              onMouseLeave={() => handleMouseLeave()}
            >
              <div className={"flex justify-between"}>
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={item.name}
                    className="flex-shrink-0"
                    size="sm"
                    src={
                      item.avatar ||
                      "https://api.dicebear.com/8.x/fun-emoji/svg?seed=Tigger"
                    }
                  />
                  <div className="flex flex-col">
                    <span className="text-small">{item.name}</span>
                    {/* <Tooltip content={item.description}> */}
                    <span className="text-tiny text-default-400 text-nowrap max-w-[120px] truncate">
                    {item.description}
                  </span>
                    {/* </Tooltip> */}
                  </div>
                </div>
                {item?.id === showIconId && <Icon
                  className={"cursor-pointer"}
                  onClick={(e) => handleUnsubscribe(e, item.id)}
                  icon="material-symbols-light:add-alert-outline"
                  width={"2em"}
                />}
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
          {/*<ModalHeader className="flex flex-col gap-1">Unsubscribe successfully</ModalHeader>*/}
          <ModalBody>
            <p>
              Unsubscribe successfully!
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setIsModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  return (
    <ScrollShadow className="-mr-2 h-full max-h-full py-2 pr-2 flex flex-col justify-between">
      {_renderModal()}
      <div>{chatListContent}</div>
    </ScrollShadow>
  );
};
