"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

const ReturnToWorkflow = () => {
  return (
    <Link href="/workflow" className="inline-flex items-center">
      <Icon icon="mdi:arrow-left" className="mr-2 text-blue-500" />
      <span className="text-sm font-medium text-blue-500">Return to Workflow List</span>
    </Link>
  );
};

export default ReturnToWorkflow;
