"use client";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface SubAgentSuccessProps {
  agent_id: string;
}

const SubAgentSuccess = ({ agent_id }: SubAgentSuccessProps) => {
  const router = useRouter();
  const t = useTranslations();
  const handleRedirect = () => {
    router.push(`/chat/${agent_id}`);
  };

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="p-6 text-center">
        <Icon
          icon="mdi:check-circle"
          className="mx-auto text-green-500"
          width="64"
          height="64"
        />
        <h2 className="mb-2 mt-4 text-2xl font-bold text-gray-800">
          {t("Subscription successful")}
        </h2>
        <p className="mb-6 text-gray-600">{t("Now you can start using it")}</p>
        <Button color="primary" onPress={handleRedirect} className="font-semibold">
          {t("Start using")}
        </Button>
      </div>
    </div>
  );
};

export default SubAgentSuccess;
