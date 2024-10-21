"use client";
import { selectChatList, selectSession } from "@/lib/features/chatListSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DefaultChatPage() {
  const dispatch = useDispatch();
  const chatList = useSelector(selectChatList);

  const router = useRouter();

  useEffect(() => {
    dispatch(selectSession(null));
    if (chatList.length > 0 && chatList[0].agents.length > 0) {
      router.push(`/chat/${chatList[0].agents[0].id}?openStatus=1`);
    } else {
      router.push(`/chat/default`);
    }
  }, [chatList, router]);

  return null;
}
