import { Icon } from "@iconify/react";
import { BubbleMenu } from "@tiptap/react";
import React from "react";

import { MenuProps, ShouldShowProps } from "@/components/menus/types";
import { useTranslations } from "next-intl";
import { isRowGripSelected } from "./utils";

const TableRowMenu: React.FC<MenuProps> = ({ editor, appendTo }) => {
  const t = useTranslations("");
  const shouldShow = ({ view, state, from }: ShouldShowProps) => {
    if (!state || !from) return false;
    return isRowGripSelected({ editor, view, state, from });
  };

  const handleRowAction = (action: "addRowBefore" | "addRowAfter" | "deleteRow") => {
    editor.chain().focus()[action]().run();
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="tableRowMenu"
      shouldShow={shouldShow}
      tippyOptions={{
        appendTo: () => appendTo?.current,
        placement: "left",
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
      }}>
      <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        {[
          {
            action: "addRowBefore",
            icon: "lucide:arrow-up",
            label: t("Add Row Before"),
          },
          {
            action: "addRowAfter",
            icon: "lucide:arrow-down",
            label: t("Add Row After"),
          },
          {
            action: "deleteRow",
            icon: "mdi:trash",
            label: t("Delete Row"),
            isDanger: true,
          },
        ].map(({ action, icon, label, isDanger }) => (
          <button
            key={action}
            className={`flex items-center px-4 py-2 text-sm transition-colors ${isDanger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => handleRowAction(action as any)}>
            <Icon icon={icon} className="mr-2 text-lg" />
            {label}
          </button>
        ))}
      </div>
    </BubbleMenu>
  );
};

export default TableRowMenu;
