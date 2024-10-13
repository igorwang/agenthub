import { SourceCard } from "@/components/Conversation/source-card";
import { SourceType } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import { useRef } from "react";

type SourceSectionProps = {
  title: string;
  items: SourceType[];
};

export const SourceSection = ({ title = "Source", items }: SourceSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex flex-row items-center justify-start gap-1 p-1">
        <Icon className="text-lg text-default-600" icon={iconType} />
        <span className="text-slate-500">{title}</span>
      </div>
      <div className="flex flex-wrap justify-start gap-4">
        {items.map((item, index) => (
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
