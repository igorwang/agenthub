import { DropIndicator } from "@/components/PromptFrom/drop-indicator";
import { DeleteOutlineIcon, SelectIcon } from "@/components/ui/icons";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

type TemplateStatus = "draft" | "saved";

export type PromptTemplateType = {
  id: number | string;
  template: string;
  role: string;
  status: TemplateStatus;
};

const PromptTemplateInput = React.forwardRef<
  HTMLDivElement,
  {
    isDisabled?: boolean;
    template: PromptTemplateType;
    handleDeleteMessage?: (id: number | string) => void;
    handleValueChange?: (id: number | string, newValue: string) => void;
    handleRoleSelect?: (id: number | string, newRole: string) => void;
  }
>(
  (
    {
      isDisabled,
      template,
      handleDeleteMessage,
      handleValueChange,
      handleRoleSelect,
      ...props
    },
    ref,
  ) => {
    const refTextarea = useRef(null);
    const [dragging, setDragging] = useState<boolean>(false); // NEW
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const [closestEdge, setClosestEdge] = useState<Edge | null>();

    useEffect(() => {
      const el = refTextarea.current;
      invariant(el);
      return combine(
        draggable({
          //Make element draggable
          element: el,
          getInitialData() {
            return { templateId: template.id };
          },
          onDragStart: () => setDragging(true),
          onDrop: () => setDragging(false),
        }),

        dropTargetForElements({
          element: el,
          canDrop({ source }) {
            // not allowing dropping on yourself
            if (source.element === el) {
              return false;
            }
            // only allowing tasks to be dropped on me
            return true;
          },
          onDragEnter({ self }) {
            setIsDraggedOver(true);
            const closestEdge = extractClosestEdge(self.data);
            setClosestEdge(closestEdge);
          },
          onDragLeave: () => setIsDraggedOver(false),
          onDrop({ self }) {
            setIsDraggedOver(false);
          },
          getData({ input }) {
            const data = { templateId: template.id };
            return attachClosestEdge(data, {
              element: el,
              input,
              allowedEdges: ["top", "bottom"],
            });
          },
        }),
      );
    }, [template]);
    return (
      <div className="relative w-full px-2">
        <Textarea
          key={template.id}
          ref={refTextarea}
          variant={dragging || isDisabled ? "faded" : "bordered"}
          placeholder="Enter your template"
          className={clsx("relative col-span-12 md:col-span-6 mb-2 md:mb-0 ", {
            // "bg-slate-200": dragging,
          })}
          disabled={dragging || isDisabled}
          classNames={{ label: "mt-[-0.5em] h-6", input: "resize-y" }}
          onValueChange={(value) =>
            handleValueChange && handleValueChange(template.id, value)
          }
          endContent={
            <Button
              isIconOnly
              variant="light"
              className="data-[hover=true]:bg-transparent absolute top-0 right-0 group-hover:block hidden hover:cursor-pointer"
              onClick={() =>
                handleDeleteMessage && handleDeleteMessage(template.id)
              }
              startContent={<DeleteOutlineIcon />}
            ></Button>
          }
          value={template.template}
          label={
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  size="sm"
                  // disableAnimation
                  disableRipple
                  className="flex items-center justify-start p-0  max-w-full data-[hover=true]:bg-transparent" // 使用 space-x-1 来添加文字和图标之间的间距
                >
                  <div className="flex flex-row justify-center items-center text-slate-400 text-medium">
                    {template.role}
                    {<SelectIcon></SelectIcon>}
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                disallowEmptySelection
                selectedKeys={template.role}
                onAction={(key) =>
                  handleRoleSelect &&
                  handleRoleSelect(template.id, key.toString())
                }
              >
                <DropdownItem key="system">system</DropdownItem>
                <DropdownItem key="user">user</DropdownItem>
                <DropdownItem key="assistant">assistant</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          }
        ></Textarea>
        {isDraggedOver && (
          <DropIndicator edge={"bottom"} gap={"8px"}></DropIndicator>
        )}
      </div>
    );
  },
);

PromptTemplateInput.displayName = "PromptTemplateInput";

export default PromptTemplateInput;
