"use client";
import { Conversation } from "@/components/Conversation";
import { selectChatList } from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function ChatPage() {
  const dispatch: AppDispatch = useDispatch();
  const chatList = useSelector(selectChatList);

  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;

  return (
    <div className="flex flex-row overflow-auto">
      <Conversation agentId={id.toString()}></Conversation>
    </div>
  );
}
