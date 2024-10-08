"use client";

import {
  AgentDiscoverInfoFragmentFragment,
  Role_Enum,
  useAddAgentUserRelationMutation,
  useGetPublicAgentListQuery,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { Avatar, Button, Card, Input, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function AgentDiscorver() {
  const t = useTranslations();
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 6;

  const { data, loading, fetchMore } = useGetPublicAgentListQuery({
    variables: {
      offset: 0,
      limit: perPage,
      where: {
        is_publish: { _eq: true },
        name: { _ilike: `%${searchInput}%` },
      },
    },
  });

  const agents = data?.agent ?? [];
  const hasMore = agents.length === perPage;

  const handleSearch = useCallback(() => {
    setPage(0);
    fetchMore({
      variables: {
        offset: 0,
        limit: perPage,
        where: {
          name: { _ilike: `%${searchInput}%` },
        },
      },
      updateQuery: (_, { fetchMoreResult }) => fetchMoreResult,
    });
  }, [searchInput, fetchMore]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: (page + 1) * perPage,
        limit: perPage,
        where: {
          name: { _ilike: `%${searchInput}%` },
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          agent: [...prev.agent, ...fetchMoreResult.agent],
        };
      },
    });
    setPage(page + 1);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-background px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-6 text-center text-2xl font-bold sm:text-4xl">
          {t("Agent Discover")}
        </h1>
        <div className="mx-auto w-full max-w-3xl">
          <Input
            isClearable
            radius="lg"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            classNames={{
              input: "text-sm",
              inputWrapper: "h-10 sm:h-12",
            }}
            placeholder={t("Search agent")}
            startContent={
              <Icon
                icon="mdi:magnify"
                className="pointer-events-none flex-shrink-0 text-lg text-default-400 sm:text-xl"
              />
            }
          />
        </div>
      </div>
      <div className="custom-scrollbar flex-grow overflow-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Button color="primary" onClick={loadMore} disabled={loading}>
                {loading ? <Spinner size="sm" color="current" /> : t("Load More")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AgentCardProps {
  agent: AgentDiscoverInfoFragmentFragment;
}

function AgentCard({ agent }: AgentCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();
  const [addAgentUserRelation] = useAddAgentUserRelationMutation();
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (isSubscribing) return;
    if (!session?.user) {
      toast.error(t("Please login to subscribe to this agent"));
      return;
    }
    setIsSubscribing(true);
    try {
      await addAgentUserRelation({
        variables: {
          object: {
            agent_id: agent.id,
            user_id: session.user?.id,
            role: Role_Enum.User,
          },
        },
      });
      toast.success(t("Successfully subscribed"));
      router.push(`/chat/${agent.id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate key value")) {
        toast.error(t("You have already subscribed to this agent"));
        router.push(`/chat/${agent.id}`);
      } else {
        toast.error(t("Failed to subscribe the agent"));
        setIsSubscribing(false);
      }
    }
  };

  return (
    <div>
      <Card className="flex h-full flex-col p-4">
        <div className="flex flex-grow items-start gap-4">
          <Avatar
            src={agent.avatar || undefined}
            name={agent.name}
            className="h-16 w-16 flex-shrink-0 text-large"
          />
          <div className="flex flex-grow flex-col">
            <h3 className="text-lg font-semibold">{agent.name}</h3>
            <p className="text-sm text-gray-500">@{agent.creator?.name || "system"}</p>
            <p className="mt-2 line-clamp-3 h-[4.5em] overflow-hidden text-sm">
              {agent.description}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            color="primary"
            size="sm"
            onClick={handleSubscribe}
            isLoading={isSubscribing}
            disabled={isSubscribing}>
            {isSubscribing ? t("Subscribing") : t("Subscribe")}
          </Button>
        </div>
      </Card>
      {isSubscribing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner color="white" />
        </div>
      )}
    </div>
  );
}
