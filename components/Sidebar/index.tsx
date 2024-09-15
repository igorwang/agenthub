"use client";

import { AcmeLogo } from "../ui/icons";

import { Icon } from "@iconify/react";
import { Avatar, Button, Link, ScrollShadow, Spacer, Tooltip } from "@nextui-org/react";
import SidebarNav from "./sidebar-nav";

import { ThemeSwitch } from "@/components/theme-switch";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";
import { useSidebarItems } from "./sidebar-items";
// import { sectionItems, userSectionItems } from "./sidebar-items";

export default function SideBar() {
  const session = useSession();

  const t = useTranslations("");
  const userRoles = session.data?.user?.roles;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const sidebarItems = useSidebarItems(userRoles || []);

  const isAdmin = userRoles?.includes("admin");

  return (
    <div className="relative hidden h-screen w-14 flex-col items-center border-r-small border-divider px-2 py-4 sm:flex">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
        <AcmeLogo className="text-background" />
      </div>
      <Spacer y={4} />
      <ScrollShadow className="-mr-2 flex h-full max-h-full flex-col justify-between py-2 pr-2">
        <div>
          <div className="flex flex-col items-center gap-4">
            <Tooltip content={t("User Center")} placement="right">
              <Button
                isIconOnly
                // className="data-[hover=true]:text-foreground"
                href={process.env.AUTH_AUTHENTIK_HOST}
                target="_blank"
                as={Link}
                variant="light">
                <Avatar isBordered size="sm" name={session.data?.user?.name || "User"} />
              </Button>
            </Tooltip>
          </div>
          <Spacer y={2} />
          <SidebarNav isCompact defaultSelectedKey="chat" items={sidebarItems} />
        </div>
        <div className="mt-auto flex flex-col items-center gap-1">
          {isAdmin && (
            <Tooltip content="User Management" placement="right">
              <Button isIconOnly href="/user-management" as={Link} variant="light">
                <Icon className="text-default-500" icon="mdi:account-group" width={24} />
              </Button>
            </Tooltip>
          )}
          <ThemeSwitch className="hidden pb-2" />
          <LanguageSwitcher />
          <Tooltip content="GitHub" placement="right">
            <Button
              isIconOnly
              className="hidden"
              // className="data-[hover=true]:text-foreground"
              variant="light">
              <Icon className="text-default-500" icon="grommet-icons:github" width={24} />
            </Button>
          </Tooltip>
          <Tooltip content="Help & Feedback" placement="right">
            <Button
              isIconOnly
              className="hidden"
              // className="data-[hover=true]:text-foreground"
              variant="light">
              <Icon
                className="text-default-500"
                icon="solar:info-circle-line-duotone"
                width={24}
              />
            </Button>
          </Tooltip>
          <Tooltip content={t("Log Out")} placement="right">
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
