import { Icon } from "@iconify/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Key } from "react";

const FONT_SIZES = [
  { key: "12px", label: "Smaller", value: "12px" },
  { key: "14px", label: "Small", value: "14px" },
  { key: "", label: "Medium", value: "" },
  { key: "18px", label: "Large", value: "18px" },
  { key: "24px", label: "Extra Large", value: "24px" },
];

export type FontSizePickerProps = {
  onChange: (value: string) => void;
  value: string;
};

export const FontSizePicker = ({ onChange, value }: FontSizePickerProps) => {
  const currentValue = FONT_SIZES.find((size) => size.value === value);
  const currentSizeLabel = currentValue?.label.split(" ")[0] || "Medium";

  const handleSelectionChange = (keys: "all" | Set<Key>) => {
    const selectedKey = keys instanceof Set ? Array.from(keys)[0] : null;
    const selectedSize = FONT_SIZES.find((size) => size.key === selectedKey);
    if (selectedSize) {
      onChange(selectedSize.value);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="flat"
          endContent={<Icon className="h-4 w-4" icon="lucide:chevron-down" />}>
          {currentSizeLabel}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Font size selection"
        selectionMode="single"
        selectedKeys={[value]}
        onSelectionChange={handleSelectionChange}>
        {FONT_SIZES.map((size) => (
          <DropdownItem key={size.key} aria-label={size.label}>
            <span style={{ fontSize: size.value }}>{size.label}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default FontSizePicker;
