"use client";

import { PromptFormHandle } from "@/components/PromptFrom";
import { PromptTemplate } from "@langchain/core/prompts";
import { useRef, useState } from "react";
import "react-modern-drawer/dist/index.css";

export default function Blog() {
  // promptHubRef =useRef<>
  const promptFormRef = useRef<PromptFormHandle>(null);

  const prompt = PromptTemplate.fromTemplate("You are a help AI named {name}");
  const content =
    "The lift coefficient $C_L$ is a dimensionless coefficient. aa **bb** \n  #1222 \name";

  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClick = () => {
    console.log("handleClick", promptFormRef);
    if (promptFormRef.current) {
      promptFormRef.current.clickButton();
    }
  };

  return (
    <div className="h-full w-full">
      {/* <Button onClick={handleClick}>Test</Button>
      <PromptForm
        agentId="eb216259-9a28-4c1e-bb5e-ece9534b8a51"
        // hiddenSaveButton={true}
        // hiddeTitle={true}
        ref={promptFormRef}></PromptForm> */}
      {/* <PromptTemplateInput></PromptTemplateInput> */}
      {/* <LibrarySideBar></LibrarySideBar> */}
      {/* <UploadZone></UploadZone> */}
      {/* <SourceSection title="Sources"></SourceSection> */}
      {/* <MarkdownRenderer content={content}></MarkdownRenderer> */}
      {/* <LibraryCart agentId={"8434fd80-1f07-43b9-af55-2fee55314d59"}></LibraryCart> */}
      {/* <button onClick={toggleDrawer}>Show</button> */}
      {/* <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        className="bla bla bla min-w-[800px]">
        <div>Hello World</div>
        <Button variant="bordered" color="primary" />
      </Drawer> */}
    </div>
  );
}
