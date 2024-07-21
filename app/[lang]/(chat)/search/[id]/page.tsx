import AISearch from "@/components/AISearch";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search...",
};

export default function SearchPage() {
  return <AISearch></AISearch>;
}
