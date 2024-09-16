"use client";

import { Button, Card } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export const Unauthorized = () => {
  const router = useRouter();
  const t = useTranslations("");
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold">{t("Unauthorized Access")}</h2>
        <p className="mb-4">
          {t("Sorry, you do not have permission to access this page")}
        </p>
        <Button color="primary" onPress={() => router.push("/")}>
          {t("Return to Home")}
        </Button>
      </Card>
    </div>
  );
};
