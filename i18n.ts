import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config
const locales = ["en", "zh", "hk"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: {
      ...(await import(`@/messages/${locale}.json`)).default,
      // Add other JSON files if needed
    },
  };
});
