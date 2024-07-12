"use client";

import { LibraryCart } from "@/components/LibraryCart";
import { PromptTemplate } from "@langchain/core/prompts";

export default function Blog() {
  const prompt = PromptTemplate.fromTemplate("You are a help AI named {name}");
  const content =
    "The lift coefficient $C_L$ is a dimensionless coefficient. aa **bb** \n  #1222 \name";
  return (
    <div className="h-full w-full">
      {/* <PromptForm agentId="eb216259-9a28-4c1e-bb5e-ece9534b8a51"></PromptForm> */}
      {/* <PromptTemplateInput></PromptTemplateInput> */}
      {/* <LibrarySideBar></LibrarySideBar> */}
      {/* <UploadZone></UploadZone> */}
      {/* <SourceSection title="Sources"></SourceSection> */}
      {/* <MarkdownRenderer content={content}></MarkdownRenderer> */}
      <LibraryCart agentId={"8434fd80-1f07-43b9-af55-2fee55314d59"}></LibraryCart>
    </div>
  );
}
