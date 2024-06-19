"use client";

import PromptForm from "@/components/PromptFrom";
import { PromptTemplate } from "@langchain/core/prompts";

export default function Blog() {
  const prompt = PromptTemplate.fromTemplate("You are a help AI named {name}");
  return (
    <div className="h-full w-full">
      <PromptForm></PromptForm>
      {/* <PromptTemplateInput></PromptTemplateInput> */}
    </div>
  );
}
