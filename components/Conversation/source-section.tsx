import { SourceCard } from "@/components/Conversation/source-card";
import { SourceType } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

type SourceSectionProps = {
  title: string;
  items: SourceType[];
};

export const SourceSection = ({ title = "Source", items }: SourceSectionProps) => {
  const [columns, setColumns] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width < 160) {
          setColumns(1);
        } else if (width < 300) {
          setColumns(2);
        } else {
          setColumns(4);
        }
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
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

  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex flex-row items-center justify-start gap-1 p-1">
        <Icon className="text-lg text-default-600" icon={iconType} />
        <span className="text-slate-500">{title}</span>
      </div>
      <section
        className={`grid gap-1.5 ${
          columns === 1 ? "grid-cols-1" : columns === 2 ? "grid-cols-2" : "grid-cols-4"
        }`}>
        {items.map((item, index) => (
          <SourceCard key={index + 1} index={index + 1} source={item} />
        ))}
      </section>
    </div>
  );
};
