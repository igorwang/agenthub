import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";
import { Avatar, AvatarProps } from "@nextui-org/react";


interface NameAvatarProps {
  name?: string;
  avatarProps?: AvatarProps;
}

export default function NameAvatar(props: NameAvatarProps) {
  const { name, avatarProps } = props;
  const avatar = useMemo(() => {
    return createAvatar(initials, {
      seed: name,
    }).toDataUri();
  }, [name]);

  return <Avatar src={avatar}  {...avatarProps} />;
}