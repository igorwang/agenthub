"use client";
import { selectChatList } from "@/lib/features/chatListSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function DefaultChatPage() {
  const chatList = useSelector(selectChatList);

  const router = useRouter();

  useEffect(() => {
    if (chatList.length > 0 && chatList[0].agents.length > 0) {
      router.push(`/chat/${chatList[0].agents[0].id}`);
    }
  }, [chatList, router]);

  return null;
}
