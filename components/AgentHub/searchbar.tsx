"use client";

import { Icon } from "@iconify/react";
import { Input } from "@nextui-org/input";
import React from "react";

export interface SearchBarProps {
  placeholder?: string;
  iconClassName?: string;
  inputClassName?: string;
  iconWidth?: number;
  ariaLabel?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  iconClassName = "text-default-500 [&>g]:stroke-[2px]",
  inputClassName = "px-2",
  iconWidth = 14,
  ariaLabel = "search",
}) => {
  return (
    <Input
      fullWidth
      aria-label={ariaLabel}
      className={inputClassName}
      labelPlacement="outside"
      placeholder={placeholder}
      startContent={
        <Icon className={iconClassName} icon="solar:magnifer-linear" width={iconWidth} />
      }
    />
  );
};

export default SearchBar;
