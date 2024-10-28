import { SelectIcon } from "@/components/ui/icons";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import React, { useRef } from "react";

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
    index: number;
    isLast: boolean;
    isDisabled?: boolean;
    template: PromptTemplateType;
    handleDeleteMessage?: (id: number | string) => void;
    handleValueChange?: (id: number | string, newValue: string) => void;
    handleRoleSelect?: (id: number | string, newRole: string) => void;
    onTemplateMove?: (id: number | string, direction: "up" | "down") => void;
  }
>(
  (
    {
      index,
      isLast,
      isDisabled,
      template,
      handleDeleteMessage,
      handleValueChange,
      handleRoleSelect,
      onTemplateMove,
      ...props
    },
    ref,
  ) => {
    const refTextarea = useRef(null);

    return (
      <div className="relative w-full">
        <Textarea
          key={template.id}
          ref={refTextarea}
          variant={isDisabled ? "faded" : "bordered"}
          placeholder="Enter your template"
          className="relative col-span-12 mb-2 md:col-span-6 md:mb-0"
          disabled={isDisabled}
          classNames={{ label: "mt-[-0.5em] h-6", input: "resize-y" }}
          onValueChange={(value) =>
            handleValueChange && handleValueChange(template.id, value)
          }
          endContent={
            <div className="absolute right-0 top-0 flex hidden flex-row items-center justify-center gap-0 group-hover:block">
              {index > 0 && (
                <Button
                  isIconOnly
                  variant="light"
                  className="data-[hover=true]:bg-transparent"
                  onClick={() => onTemplateMove && onTemplateMove(template.id, "up")}
                  startContent={<Icon icon="mdi:arrow-up" />}></Button>
              )}
              {!isLast && (
                <Button
                  isIconOnly
                  variant="light"
                  className="data-[hover=true]:bg-transparent"
                  onClick={() => onTemplateMove && onTemplateMove(template.id, "down")}
                  startContent={<Icon icon="mdi:arrow-down" />}></Button>
              )}
              <Button
                isIconOnly
                variant="light"
                color="danger"
                className="data-[hover=true]:bg-transparent"
                onClick={() => handleDeleteMessage && handleDeleteMessage(template.id)}
                startContent={<Icon icon="ic:outline-delete" />}></Button>
            </div>
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
                  className="flex max-w-full items-center justify-start p-0 data-[hover=true]:bg-transparent" // 使用 space-x-1 来添加文字和图标之间的间距
                >
                  <div className="flex flex-row items-center justify-center text-medium text-slate-400">
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
                  handleRoleSelect && handleRoleSelect(template.id, key.toString())
                }>
                <DropdownItem key="system">system</DropdownItem>
                <DropdownItem key="user">user</DropdownItem>
                <DropdownItem key="assistant">assistant</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          }></Textarea>
      </div>
    );
  },
);

PromptTemplateInput.displayName = "PromptTemplateInput";

export default PromptTemplateInput;
