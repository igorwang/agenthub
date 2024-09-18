import { cn } from "@/cn";
import { Icon } from "@iconify/react";

import { forwardRef } from "react";

export type CommandButtonProps = {
  active?: boolean;
  description: string;
  icon: string; // Changed from keyof typeof icons to string
  onClick: () => void;
  title: string;
};

export const CommandButton = forwardRef<HTMLButtonElement, CommandButtonProps>(
  ({ active, description, icon, onClick, title }, ref) => {
    const wrapperClass = cn(
      "flex items-center justify-start p-1.5 gap-2 rounded text-xs",
      "text-gray-500 hover:bg-gray-100",
      active && "bg-gray-100 text-gray-800",
    );

    return (
      <button ref={ref} onClick={onClick} className={wrapperClass}>
        <Icon icon={icon} className="h-3.5 w-3.5 text-gray-400" />
        <div className="flex flex-col items-start justify-start">
          <div className="text-xs font-medium text-slate-300">{title}</div>
          <div className="text-[10px] text-slate-300">{description}</div>
        </div>
      </button>
    );
  },
);

CommandButton.displayName = "CommandButton";
