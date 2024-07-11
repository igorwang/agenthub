"use client";
import ChatHub from "@/components/AgentHub";
import { Conversation } from "@/components/Conversation";
import {
  selectChat,
  selectChatList,
  selectSelectedChatId,
  selectSession,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ChatPage() {
  const dispatch: AppDispatch = useDispatch();
  const chatList = useSelector(selectChatList);
  const selectedChatId = useSelector(selectSelectedChatId);

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

  return (
    <div className="flex flex-1 flex-row overflow-auto">
      <ChatHub />
      <Conversation agentId={id}></Conversation>
    </div>
  );
}
