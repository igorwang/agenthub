"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button onClick={handleBack} className="rounded-full p-2 hover:bg-gray-100">
      <Icon icon="mdi:arrow-left" width="24" height="24" />
    </button>
  );
};

export default BackButton;
