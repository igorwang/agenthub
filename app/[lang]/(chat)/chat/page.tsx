"use client";
import { useRouter } from "next/navigation";

export default function DefaultChatPage() {
  const router = useRouter();
  router.push("/chat/default");
  return null;
}
