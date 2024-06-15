"use client";
import { title } from "@/components/primitives";
import {
  GetAgentListByTypeDocument,
  useGetAgentListByTypeQuery,
} from "@/graphql/generated/types";
import { getSession } from "next-auth/react";

interface BlogPageProps {
  data: object;
}

export default function BlogPage() {
  const { data } = useGetAgentListByTypeQuery();

  console.log(data);
  return (
    <div>
      <h1 className={title()}>Blog</h1>
    </div>
  );
}
