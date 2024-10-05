"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
        className={`custom-scrollbar overflow-auto transition-all duration-300 ease-in-out ${
          isChatHubOpen ? "w-48 min-w-48" : "w-0"
        }`}>
        <ChatHub onToggleChatHub={toggleChatHub} />
      </div>
      <div className="flex-1">
        <Conversation agentId={id} />
      </div>
    </div>
  );
}
