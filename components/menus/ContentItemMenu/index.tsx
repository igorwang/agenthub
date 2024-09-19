"use client";

import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import { Editor } from "@tiptap/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import useContentItemActions from "./hooks/useContentItemActions";
import { useData } from "./hooks/useData";

export type ContentItemMenuProps = {
  editor: Editor;
};

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
  const t = useTranslations("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const data = useData();
  const actions = useContentItemActions(editor, data.currentNode, data.currentNodePos);

  useEffect(() => {
    editor.commands.setMeta("lockDragHandle", menuOpen);
  }, [editor, menuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}>
      <div className="flex items-center gap-0.5" ref={menuRef}>
        <Button
          isIconOnly
          variant="light"
          onClick={actions.handleAdd}
          className="h-6 w-6 min-w-6">
          <Icon icon="mdi:plus" fontSize={20} />
        </Button>
        <div
          className="flex w-6 cursor-move items-center justify-center"
          onClick={toggleMenu}>
          <Icon icon="mdi:drag-vertical" fontSize={20} />
        </div>
        {menuOpen && (
          <div className="absolute mt-6 rounded-md bg-white p-2 shadow-lg">
            <Button
              variant="light"
              onClick={actions.resetTextFormatting}
              className="mb-1 w-full justify-start">
              <Icon icon="mdi:format-clear" className="mr-2" />
              {t("Clear formatting")}
            </Button>
            <Button
              variant="light"
              onClick={actions.copyNodeToClipboard}
              className="mb-1 w-full justify-start">
              <Icon icon="mdi:clipboard" className="mr-2" />
              {t("Copy to clipboard")}
            </Button>
            <Button
              variant="light"
              onClick={actions.duplicateNode}
              className="mb-1 w-full justify-start">
              <Icon icon="mdi:content-copy" className="mr-2" />
              {t("Duplicate")}
            </Button>
            <Button
              variant="light"
              onClick={actions.deleteNode}
              className="w-full justify-start text-danger">
              <Icon icon="mdi:trash-can-outline" className="mr-2" />
              {t("Delete")}
            </Button>
          </div>
        )}
      </div>
    </DragHandle>
  );
};
