"use client";

import PromptForm from "@/components/PromptFrom";
import { PromptTemplate } from "@langchain/core/prompts";

export default function Blog() {
  const prompt = PromptTemplate.fromTemplate("You are a help AI named {name}");
  return (
    <div className="h-full w-full">
      <PromptForm
        agentId="eb216259-9a28-4c1e-bb5e-ece9534b8a51"
        konwledgeBaseId="ce6163d9-b0c0-480f-93dc-c1665c5b6767"
      ></PromptForm>
      {/* <PromptTemplateInput></PromptTemplateInput> */}
    </div>
  );
}
