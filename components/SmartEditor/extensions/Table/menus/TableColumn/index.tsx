import { MenuProps, ShouldShowProps } from "@/components/menus/types";
import { Icon } from "@iconify/react";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import { useTranslations } from "next-intl";
import React, { useCallback } from "react";
import { isColumnGripSelected } from "./utils";

export const TableColumnMenu = React.memo(
  ({ editor, appendTo }: MenuProps): JSX.Element => {
    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state) return false;
        return isColumnGripSelected({ editor, view, state, from: from || 0 });
      },
      [editor],
    );
    const t = useTranslations("");

    const onAddColumnBefore = useCallback(() => {
      editor.chain().focus().addColumnBefore().run();
    }, [editor]);

    const onAddColumnAfter = useCallback(() => {
      editor.chain().focus().addColumnAfter().run();
    }, [editor]);

    const onDeleteColumn = useCallback(() => {
      editor.chain().focus().deleteColumn().run();
    }, [editor]);

    return (
      <BaseBubbleMenu
        editor={editor}
        pluginKey="tableColumnMenu"
        updateDelay={0}
        tippyOptions={{
          appendTo: () => appendTo?.current,
          offset: [0, 15],
          popperOptions: {
            modifiers: [{ name: "flip", enabled: false }],
          },
        }}
        shouldShow={shouldShow}>
        <div className="min-w-[200px] rounded-md bg-white p-1 shadow-md">
          <button
            onClick={onAddColumnBefore}
            className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <Icon icon="lucide:arrow-left" className="mr-2 text-gray-600" />
            {t("Add Column Before")}
          </button>
          <button
            onClick={onAddColumnAfter}
            className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <Icon icon="lucide:arrow-right" className="mr-2 text-gray-600" />
            {t("Add Column After")}
          </button>
          <button
            onClick={onDeleteColumn}
            className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100">
            <Icon icon="mdi:trash" className="mr-2 text-red-600" />
            {t("Delete Column")}
          </button>
        </div>
      </BaseBubbleMenu>
    );
  },
);

TableColumnMenu.displayName = "TableColumnMenu";

export default TableColumnMenu;
