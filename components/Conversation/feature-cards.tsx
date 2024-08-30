import { Icon } from "@iconify/react";

import { useTranslations } from "next-intl";
import FeatureCard from "./feature-card";

export default function FeatureCards() {
  const t = useTranslations();
  const featuresCategories = [
    {
      key: "examples",
      title: t("Examples"),
      icon: <Icon icon="solar:mask-happly-linear" width={40} />,
      descriptions: [
        t("Explain quantum computing in simple terms"),
        t("Got any creative ideas for birthday"),
        t("How do I make an HTTP request in Javascript"),
      ],
    },
    {
      key: "capabilities",
      title: t("Capabilities"),
      icon: <Icon icon="solar:magic-stick-3-linear" width={40} />,
      descriptions: [
        t("Remembers what user said earlier in the conversation"),
        t("Allows user to provide follow-up corrections"),
        t("Trained to decline inappropriate requests"),
      ],
    },
    {
      key: "limitations",
      title: t("Limitations"),
      icon: <Icon icon="solar:shield-warning-outline" width={40} />,
      descriptions: [
        t("May occasionally generate incorrect information"),
        t("May occasionally produce harmful instructions or biased information"),
        t("Limited knowledge of realtime world and events"),
      ],
    },
  ];

  return (
    <div className="grid max-w-[1000px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {featuresCategories.map((category) => (
        <FeatureCard
          key={category.key}
          descriptions={category.descriptions}
          icon={category.icon}
          title={category.title}
        />
      ))}
    </div>
  );
}
