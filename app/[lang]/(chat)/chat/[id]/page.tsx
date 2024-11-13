"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatHub from "@/components/AgentHub";
import Aircraft from "@/components/Aircraft";
import { Conversation } from "@/components/Conversation";
import { AgentFragmentFragment, useGetAgentByIdQuery } from "@/graphql/generated/types";
import {
  selectChat,
  selectCurrentAircraftId,
  selectIsAircraftOpen,
  selectSession,
} from "@/lib/features/chatListSlice";
import { DEFAULT_LLM_MODEL } from "@/lib/models";
import { AppDispatch } from "@/lib/store";

export default function ChatPage() {
  const dispatch: AppDispatch = useDispatch();
  const [isChatHubOpen, setIsChatHubOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = params;
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;

  const [agent, setAgent] = useState<AgentFragmentFragment | null>(null);

  const { data: agentData, error: agentError } = useGetAgentByIdQuery({
    variables: {
      id: id,
    },
    skip: !id,
  });

  const sessionId = searchParams.get("session_id");

  const isAircraftOpen = useSelector(selectIsAircraftOpen);
  const currentAircraftId = useSelector(selectCurrentAircraftId);

  useEffect(() => {
    if (agentData?.agent_by_pk) {
      setAgent(agentData.agent_by_pk);
    }
  }, [agentData]);

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
    <div className="relative flex flex-1 flex-row overflow-auto">
      <div
        className={`custom-scrollbar overflow-auto transition-all duration-300 ease-in-out ${
          isChatHubOpen ? "w-56 min-w-56" : "w-0"
        }`}>
        <ChatHub onToggleChatHub={toggleChatHub} />
      </div>
      <div className="w-full flex-1">
        <Conversation
          agentId={id}
          isChatHubOpen={isChatHubOpen}
          onToggleChatHub={toggleChatHub}
          isAircraftOpen={isAircraftOpen}
        />
      </div>
      {isAircraftOpen && sessionId && (
        <div className="flex w-full min-w-[400px] flex-1">
          <Aircraft model={agent?.default_model || DEFAULT_LLM_MODEL} />
        </div>
      )}
    </div>
  );
}
