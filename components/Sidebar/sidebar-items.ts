"use client";
import { useTranslations } from "next-intl";

export interface SidebarItem {
  key: string;
  title: string;
  items?: SidebarItem[];
  href?: string;
  icon?: string;
  endContent?: string; // Using string for icon name to ensure serializability
}

export function useSidebarItems(roles: string[]): SidebarItem[] {
  const t = useTranslations("");

  const allItems: SidebarItem[] = [
    {
      key: "overview",
      title: t("Overview"),
      items: [
        {
          key: "chat",
          href: "/chat",
          icon: "tabler:message-2-plus",
          title: t("Chat"),
          endContent: "solar:add-circle-line-duotone",
        },
        {
          key: "library",
          href: "/library",
          icon: "ph:folder",
          title: t("Library"),
          endContent: "solar:add-circle-line-duotone",
        },
        {
          key: "discover",
          href: "/discover",
          icon: "weui:discover-outlined",
          title: t("Discover"),
          endContent: "solar:add-circle-line-duotone",
        },
        {
          key: "workflow",
          href: "/workflow",
          icon: "hugeicons:workflow-square-01",
          title: t("Workflow"),
          endContent: "solar:add-circle-line-duotone",
        },
        {
          key: "apiKey",
          href: "/key-management",
          icon: "solar:key-minimalistic-square-3-broken",
          title: t("API Key"),
          endContent: "solar:key-minimalistic-square-3-broken",
        },
        // You can add more items here
      ],
    },
    // You can add more sections here
  ];

  // Helper function to check if the item should be visible for given roles
  const isItemVisible = (item: SidebarItem, roles: string[]): boolean => {
    if (roles.includes("admin")) return true; // Admin can see everything
    if (item.key === "chat") return true; // All roles can see chat
    if (item.key === "library") return true;
    if (item.key === "discover") return true;
    if (item.key === "workflow") return true;
    if (item.key === "apiKey") return true;
    // Add more conditions here for other items
    return false;
  };

  // Filter items based on user roles
  const filteredItems = allItems
    .map((section) => ({
      ...section,
      items: section.items?.filter((item) => isItemVisible(item, roles)),
    }))
    .filter((section) => section.items && section.items.length > 0);

  return filteredItems;
}
