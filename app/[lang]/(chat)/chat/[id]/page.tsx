"use client";

import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatHub from "@/components/AgentHub";
import { Conversation } from "@/components/Conversation";
import {
  selectChat,
  selectChatList,
  selectSelectedChatId,
  selectSession,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";

export default function ChatPage() {
  const dispatch: AppDispatch = useDispatch();
  const chatList = useSelector(selectChatList);
  const selectedChatId = useSelector(selectSelectedChatId);
  const [isChatHubOpen, setIsChatHubOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = params;
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    dispatch(selectChat(id));
    dispatch(selectSession(sessionId));
  }, [id, sessionId, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsChatHubOpen(false);
      } else {
        setIsChatHubOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleChatHub = () => {
    setIsTransitioning(true);
    setIsChatHubOpen(!isChatHubOpen);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const showButton = useCallback(() => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setIsButtonVisible(true);
  }, [hideTimeout]);

  const hideButton = useCallback(() => {
    const timeout = setTimeout(() => {
      setIsButtonVisible(false);
    }, 500); // 500ms delay before hiding the button
    setHideTimeout(timeout);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  return (
    <div className="custom-scrollbar relative flex flex-1 flex-row overflow-auto">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isChatHubOpen ? "w-64 min-w-64" : "w-0"
        } custom-scrollbar relative overflow-auto`}
        onMouseLeave={hideButton}>
        <ChatHub />
        <div className="absolute left-0 top-0 h-full w-8" onMouseEnter={showButton} />
        <div className="absolute right-0 top-0 h-full w-8" onMouseEnter={showButton} />
      </div>
      <div
        className="absolute left-0 top-0 h-full w-8"
        onMouseEnter={showButton}
        onMouseLeave={hideButton}
      />
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onClick={toggleChatHub}
        disableAnimation={true}
        disableRipple={true}
        onMouseEnter={showButton}
        onMouseLeave={hideButton}
        className={`absolute z-10 transition-all duration-300 ease-in-out data-[hover]:bg-transparent ${
          isTransitioning ? "opacity-0" : isButtonVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: isChatHubOpen ? "248px" : "0px",
          top: "50%",
          transform: "translateY(-50%)",
        }}>
        <Icon
          icon={isChatHubOpen ? "line-md:arrow-open-left" : "line-md:arrow-open-right"}
          width="20"
          height="20"
        />
      </Button>
      <div className="flex-1">
        <Conversation agentId={id} />
      </div>
    </div>
  );
}
