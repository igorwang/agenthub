import { SourceCard } from "@/components/Conversation/source-card";
import { SourceType } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type SourceSectionProps = {
  title: string;
  items: SourceType[];
};

export const SourceSection = ({ title = "Source", items }: SourceSectionProps) => {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(1);

  useEffect(() => {
    const updateItemsPerRow = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerRow(4);
      } else if (window.innerWidth >= 640) {
        setItemsPerRow(2);
      } else {
        setItemsPerRow(1);
      }
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, []);

  let iconType: string;
  switch (title) {
    case "Source":
      iconType = "tabler:library";
      break;
    case "Web Source":
      iconType = "iconoir:internet";
      break;
    default:
      iconType = "tabler:library";
      break;
  }

  const displayedItems = showAll ? items : items.slice(0, itemsPerRow);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex flex-row items-center justify-between p-1">
        <div className="flex items-center gap-1">
          <Icon className="text-lg text-default-600" icon={iconType} />
          <span className="text-slate-500">{title}</span>
        </div>
        {items.length > itemsPerRow && (
          <span
            className="cursor-pointer text-xs text-blue-500 hover:underline"
            onClick={() => setShowAll(!showAll)}>
            {showAll ? t("Show less") : t("Show more")}
          </span>
        )}
      </div>
      <div className="flex flex-wrap justify-start gap-4">
        {displayedItems.map((item, index) => (
          <div
            key={index + 1}
            className="w-full min-w-[160px] sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]">
            <SourceCard key={index + 1} index={index + 1} source={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
function useTranslation(): { t: any } {
  throw new Error("Function not implemented.");
}
