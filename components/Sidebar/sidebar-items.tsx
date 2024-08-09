import { Icon } from "@iconify/react";

import { type SidebarItem } from "@/components/Sidebar/sidebar-nav";

export const sectionItems: SidebarItem[] = [
  {
    key: "overview",
    title: "Overview",
    items: [
      {
        key: "chat",
        href: "/chat",
        icon: "tabler:message-2-plus",
        title: "Chat",
        endContent: (
          <Icon
            className="text-default-400"
            icon="solar:add-circle-line-duotone"
            width={24}
          />
        ),
      },
      // {
      //   key: "search",
      //   href: "/search",
      //   icon: "mingcute:search-3-line",
      //   title: "Search",
      //   endContent: (
      //     <Icon
      //       className="text-default-400"
      //       icon="solar:add-circle-line-duotone"
      //       width={24}
      //     />
      //   ),
      // },
      {
        key: "library",
        href: "/library",
        icon: "ph:folder",
        title: "Library",
        endContent: (
          <Icon
            className="text-default-400"
            icon="solar:add-circle-line-duotone"
            width={24}
          />
        ),
      },
      {
        key: "discover",
        href: "/discover",
        icon: "iconamoon:discover",
        title: "Discover",
        endContent: (
          <Icon
            className="text-default-400"
            icon="solar:add-circle-line-duotone"
            width={24}
          />
        ),
      },
    ],
  },
];

export const userSectionItems: SidebarItem[] = [
  {
    key: "overview",
    title: "Overview",
    items: [
      {
        key: "chat",
        href: "/chat",
        icon: "tabler:message-2-plus",
        title: "Chat",
        endContent: (
          <Icon
            className="text-default-400"
            icon="solar:add-circle-line-duotone"
            width={24}
          />
        ),
      },
    ],
  },
  //   {
  //     key: "organization",
  //     title: "Organization",
  //     items: [
  //       {
  //         key: "cap_table",
  //         href: "#",
  //         title: "Cap Table",
  //         icon: "solar:pie-chart-2-outline",
  //         items: [
  //           {
  //             key: "shareholders",
  //             href: "#",
  //             title: "Shareholders",
  //           },
  //           {
  //             key: "note_holders",
  //             href: "#",
  //             title: "Note Holders",
  //           },
  //           {
  //             key: "transactions_log",
  //             href: "#",
  //             title: "Transactions Log",
  //           },
  //         ],
  //       },
  //       {
  //         key: "analytics",
  //         href: "#",
  //         icon: "solar:chart-outline",
  //         title: "Analytics",
  //       },
  //       {
  //         key: "perks",
  //         href: "/perks",
  //         icon: "solar:gift-linear",
  //         title: "Perks",
  //         endContent: (
  //           <Chip size="sm" variant="flat">
  //             3
  //           </Chip>
  //         ),
  //       },
  //       {
  //         key: "expenses",
  //         href: "#",
  //         icon: "solar:bill-list-outline",
  //         title: "Expenses",
  //       },
  //       {
  //         key: "settings",
  //         href: "/settings",
  //         icon: "solar:settings-outline",
  //         title: "Settings",
  //       },
  //     ],
  //   },
];

// export const sectionItemsWithTeams: SidebarItem[] = [
//   ...sectionItems,
//   {
//     key: "your-teams",
//     title: "Your Teams",
//     items: [
//       {
//         key: "nextui",
//         href: "#",
//         title: "NextUI",
//         startContent: <TeamAvatar name="Next UI" />,
//       },
//       {
//         key: "tailwind-variants",
//         href: "#",
//         title: "Tailwind Variants",
//         startContent: <TeamAvatar name="Tailwind Variants" />,
//       },
//       {
//         key: "nextui-pro",
//         href: "#",
//         title: "NextUI Pro",
//         startContent: <TeamAvatar name="NextUI Pro" />,
//       },
//     ],
//   },
// ];
