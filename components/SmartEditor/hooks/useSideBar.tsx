import { useMemo, useState } from "react";

export type EditorSidebarState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useEditorSidebar = (): EditorSidebarState => {
  const [isOpen, setIsOpen] = useState(false);
  return useMemo(() => {
    return {
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    };
  }, [isOpen]);
};
