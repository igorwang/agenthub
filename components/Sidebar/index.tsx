"use client";

import { AcmeLogo } from "../ui/icons";

import React from "react";
import {
  Avatar,
  Button,
  ScrollShadow,
  Spacer,
  Tooltip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import SidebarNav from "./sidebar-nav";

import { sectionItems } from "./sidebar-items";

export default function SideBar() {
  return (
    <div className="hidden sm:flex relative h-full w-14 flex-col items-center border-r-small border-divider px-2 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
        <AcmeLogo className="text-background" />
      </div>
      <Spacer y={4} />
      <ScrollShadow className="-mr-2 h-full max-h-full py-2 pr-2 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center gap-4">
            <Avatar
              isBordered
              size="sm"
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
            />
          </div>
          <Spacer y={2} />

          <SidebarNav
            isCompact
            defaultSelectedKey="chat"
            items={sectionItems}
          />
        </div>
        <div className="mt-auto flex flex-col items-center">
          <Tooltip content="GitHub" placement="right">
            <Button
              isIconOnly
              className="data-[hover=true]:text-foreground"
              variant="light"
            >
              <Icon
                className="text-default-500"
                icon="grommet-icons:github"
                width={24}
              />
            </Button>
          </Tooltip>

          <Tooltip content="Help & Feedback" placement="right">
            <Button
              isIconOnly
              className="data-[hover=true]:text-foreground"
              variant="light"
            >
              <Icon
                className="text-default-500 "
                icon="solar:info-circle-line-duotone"
                width={24}
              />
            </Button>
          </Tooltip>
          <Tooltip content="Log Out" placement="right">
            <Button
              isIconOnly
              className="data-[hover=true]:text-foreground"
              variant="light"
            >
              <Icon
                className="rotate-180 text-default-500"
                icon="solar:minus-circle-line-duotone"
                width={24}
              />
            </Button>
          </Tooltip>
        </div>
      </ScrollShadow>
    </div>
  );
}
