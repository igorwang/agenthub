"use client";

import { Icon } from "@iconify/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import useContentItemActions from "./hooks/useContentItemActions";
import { useData } from "./hooks/useData";

export type ContentItemMenuProps = {
  editor: Editor;
};

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useData();
  const actions = useContentItemActions(editor, data.currentNode, data.currentNodePos);

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta("lockDragHandle", true);
    } else {
      editor.commands.setMeta("lockDragHandle", false);
    }
  }, [editor, menuOpen]);

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}>
      <div className="flex items-center gap-0.5">
        <Button
          isIconOnly
          variant="light"
          onClick={actions.handleAdd}
          // size="sm"
          className="h-6 w-6 min-w-6">
          <Icon icon="mdi:plus" fontSize={20} />
        </Button>
        <div className="flex w-6 cursor-move items-center justify-center">
          <Icon icon="mdi:drag-vertical" fontSize={20} />
        </div>
        <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownTrigger>
            <Button isIconOnly variant="light" className="h-6 w-6 min-w-6">
              <Icon icon="mdi:dots-vertical" fontSize={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Content Item Actions">
            <DropdownItem
              key="clear"
              startContent={<Icon icon="mdi:format-clear" />}
              onClick={actions.resetTextFormatting}>
              Clear formatting
            </DropdownItem>
            <DropdownItem
              key="copy"
              startContent={<Icon icon="mdi:clipboard" />}
              onClick={actions.copyNodeToClipboard}>
              Copy to clipboard
            </DropdownItem>
            <DropdownItem
              key="duplicate"
              startContent={<Icon icon="mdi:content-copy" />}
              onClick={actions.duplicateNode}>
              Duplicate
            </DropdownItem>
            <DropdownItem
              key="delete"
              startContent={<Icon icon="mdi:trash-can-outline" />}
              onClick={actions.deleteNode}
              className="text-danger"
              color="danger">
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </DragHandle>
  );
};
