import { auth } from "@/auth";
import SubAgentSuccess from "@/components/ui/sub-agent-success";
import "@/lib/apiClient";
import {
  ChatService,
  DecodeShareLinkV1ChatAgentShareKeyGetResponse,
  OpenAPI,
} from "@/restful/generated";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

async function getShareData(key: string) {
  const session = await auth();
  OpenAPI.HEADERS = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token}`,
  };

  const response: DecodeShareLinkV1ChatAgentShareKeyGetResponse =
    await ChatService.decodeShareLinkV1ChatAgentShareKeyGet({
      key: key,
    });
  return response;
}

export default async function SharePage({ params }: { params: { key: string } }) {
  const t = await getTranslations();
  const { key } = params;
  try {
    const shareData = await getShareData(key);
    const agent_id = shareData.agent_id;
    return (
      <Suspense fallback={<div>{t("Checking Subscription Status")}...</div>}>
        <div className="flex h-screen items-center justify-center">
          <SubAgentSuccess agent_id={agent_id} />
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching share data:", error);
    return <div>{t("Wrong share link")}</div>;
  }
}
