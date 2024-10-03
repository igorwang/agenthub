"use client";

import { useCreateOneAgentMutation } from "@/graphql/generated/types";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmptyPage() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const router = useRouter();
  const userRoles = session?.data?.user?.roles;
  console.log("userRoles", userRoles);
  const hasCreatorRole = userRoles?.includes("admin") || userRoles?.includes("creator");
  const t = useTranslations();

  const [createAgentMutation, { loading }] = useCreateOneAgentMutation();

  const handelCreateAgent = async () => {
    const res = await createAgentMutation({
      variables: {
        object: { name: "New Agent", type_id: 2, creator_id: userId },
      },
    });
    const newAgentId = res?.data?.insert_agent_one?.id;
    const path = `/chat/${newAgentId}/settings?step=0`;
    router.push(path);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <h2 className="mb-4 text-2xl font-bold">{t("No Agents Followed")}</h2>
      <p className="mb-6">{t("Explore and follow agents to get started")}</p>
      <div className="flex flex-row gap-4">
        <Link href="/discover">
          <Button color="primary">{t("explore Agents")}</Button>
        </Link>
        {hasCreatorRole && (
          <Button
            color="secondary"
            isLoading={loading}
            onClick={handelCreateAgent}
            isDisabled={loading}>
            {t("create new Agent")}
          </Button>
        )}
      </div>
    </div>
  );
}
