"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function DefaultChatPage() {
  const router = useRouter();
  router.push("/chat/default");
  return null;
}
