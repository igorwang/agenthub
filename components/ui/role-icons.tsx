import { Icon } from "@iconify/react";
import { Avatar, Chip } from "@nextui-org/react";
import React from "react";

type Role = "agent" | "creator" | "user" | "admin";

interface RoleConfig {
  icon: string;
  bgColor: string;
  textColor: string;
}

type RoleConfigMap = {
  [key in Role]: RoleConfig;
};

const roleConfig: RoleConfigMap = {
  agent: {
    icon: "fluent:bot-20-filled",
    bgColor: "#E8F5FE",
    textColor: "#0078D4",
  },
  creator: {
    icon: "fluent:person-add-20-filled",
    bgColor: "#FFF4E5",
    textColor: "#B95000",
  },
  user: {
    icon: "fluent:person-20-filled",
    bgColor: "#E8F6EF",
    textColor: "#107C41",
  },
  admin: {
    icon: "fluent:shield-person-20-filled",
    bgColor: "#F3E5F5",
    textColor: "#7B1FA2",
  },
};

interface RoleChipProps {
  role: string;
}

export const RoleChip: React.FC<RoleChipProps> = ({ role }) => {
  const lowerRole = role.toLowerCase() as Role;
  const config = roleConfig[lowerRole] || roleConfig.user; // 默认为 user

  return (
    <Chip
      variant="flat"
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: "none",
      }}
      avatar={
        <Avatar
          size="sm"
          icon={
            <Icon icon={config.icon} width="16" height="16" color={config.textColor} />
          }
          style={{ backgroundColor: "transparent" }}
        />
      }>
      {role}
    </Chip>
  );
};
