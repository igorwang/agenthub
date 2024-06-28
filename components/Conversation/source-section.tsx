import { SourceCard } from "@/components/Conversation/source-card";
import { SourceType } from "@/types/chatTypes";
import { Icon } from "@iconify/react";

type SourceSectionProps = {
  title: string;
  items: SourceType[];
};

export const SourceSection = ({
  title = "Sources",
  items,
}: SourceSectionProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-start gap-1 p-1 ">
        <Icon
          className="text-lg text-default-600"
          icon="solar:documents-bold-duotone"
        />
        <span className="text-slate-500">{title}:</span>
      </div>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1">
        {items.map((item, index) => (
          <SourceCard key={index + 1} index={index + 1} source={item} />
        ))}
      </section>
    </div>
  );
};
