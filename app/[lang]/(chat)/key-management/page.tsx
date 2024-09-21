import KeyManagement from "@/components/KeyManagement";
import { Spinner } from "@nextui-org/react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

async function ApiKeyPage() {
  const t = await getTranslations("");

  const documentString = `Do not share your API key with others, or expose it in the browser or other client-side code. \
  In order to protect the security of your account, Platform may also automatically disable any API key that has leaked publicly.`;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-800">{t("API Key Management", {})}</h1>
      </div>
      <div className="mb-6 rounded-lg bg-gray-100 p-5 text-sm leading-relaxed text-gray-700">
        {t("API Key Management Description", {
          defaultValue: `Do not share your API key with others, or expose it in the browser or other client-side code.

In order to protect the security of your account, Platform may also automatically disable any API key that has leaked publicly.`,
        })}
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-grow px-4">
        <Suspense fallback={<Spinner>{t("Loading")}...</Spinner>}>
          <KeyManagement />
        </Suspense>
      </div>
    </div>
  );
}

export default ApiKeyPage;
