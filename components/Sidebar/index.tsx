"use client";

import { AcmeLogo } from "../ui/icons";

import { Icon } from "@iconify/react";
import { Avatar, Button, ScrollShadow, Spacer, Tooltip } from "@nextui-org/react";
import SidebarNav from "./sidebar-nav";

import { ThemeSwitch } from "@/components/theme-switch";
import { Role_Enum } from "@/graphql/generated/types";
import { signOut, useSession } from "next-auth/react";
import { sectionItems, userSectionItems } from "./sidebar-items";

export default function SideBar() {
  const session = useSession();
  const userRoles = session.data?.user?.roles;
  const isCreatorView =
    userRoles &&
    userRoles.some((role) =>
      [Role_Enum.Admin, Role_Enum.Creator].includes(role as Role_Enum),
    );
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="relative hidden h-screen w-14 flex-col items-center border-r-small border-divider px-2 py-4 sm:flex">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
        <AcmeLogo className="text-background" />
      </div>
      <Spacer y={4} />
      <ScrollShadow className="-mr-2 flex h-full max-h-full flex-col justify-between py-2 pr-2">
        <div>
          <div className="flex flex-col items-center gap-4">
            <Tooltip content="User" placement="right">
              <Button
                isIconOnly
                // className="data-[hover=true]:text-foreground"
                variant="light">
                <Avatar
                  isBordered
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                />
              </Button>
            </Tooltip>
          </div>
          <Spacer y={2} />
          <SidebarNav
            isCompact
            defaultSelectedKey="chat"
            items={isCreatorView ? sectionItems : userSectionItems}
          />
        </div>
        <div className="mt-auto flex flex-col items-center gap-1">
          <ThemeSwitch className="pb-2" />
          <Tooltip content="GitHub" placement="right">
            <Button
              isIconOnly
              // className="data-[hover=true]:text-foreground"
              variant="light">
              <Icon className="text-default-500" icon="grommet-icons:github" width={24} />
            </Button>
          </Tooltip>
          <Tooltip content="Help & Feedback" placement="right">
            <Button
              isIconOnly
              // className="data-[hover=true]:text-foreground"
              variant="light">
              <Icon
                className="text-default-500"
                icon="solar:info-circle-line-duotone"
                width={24}
              />
            </Button>
          </Tooltip>
          <Tooltip content="Log Out" placement="right">
            <Button
              isIconOnly
              onPress={handleSignOut}
              // className="data-[hover=true]:text-foreground"
              variant="light">
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
