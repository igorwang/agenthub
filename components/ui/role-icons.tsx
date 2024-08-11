import { Icon } from "@iconify/react";
import { Avatar, Chip, ChipProps } from "@nextui-org/react";
import React from "react";

type Role = "agent" | "creator" | "user" | "admin";

interface RoleConfig {
  icon: string;
  color: ChipProps["color"];
}

type RoleConfigMap = {
  [key in Role]: RoleConfig;
};

const roleConfig: RoleConfigMap = {
  agent: { icon: "mdi:robot", color: "primary" },
  creator: { icon: "mdi:account-star", color: "warning" },
  user: { icon: "mdi:account", color: "success" },
  admin: { icon: "mdi:shield-account", color: "danger" },
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
      color={config.color}
      avatar={
        <Avatar size="sm" icon={<Icon icon={config.icon} width="20" height="20" />} />
      }>
      {role}
    </Chip>
  );
};
