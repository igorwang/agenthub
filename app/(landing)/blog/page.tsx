// import createApolloClient from "@/app/lib/apolloClient";
import { fetchData } from "@/app/lib/apolloRequest";
import { auth } from "@/auth";
import { title } from "@/components/primitives";
import { GetAgentListByTypeDocument } from "@/graphql/generated/types";
import { circIn } from "framer-motion";
import { GetServerSideProps } from "next";
import { headers } from "next/headers";

interface BlogPageProps {
  data: object;
}

export default async function BlogPage() {
  const data = await fetchData(GetAgentListByTypeDocument);
  console.log(data);
  return (
    <div>
      <h1 className={title()}>Blog</h1>
    </div>
  );
}
