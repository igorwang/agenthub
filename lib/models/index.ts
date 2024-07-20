import { PromptTemplateType } from "@/components/PromptFrom";

export const DEFAULT_LLM_MODEL = "gpt-4o-mini";

export const DEFAULT_TEMPLATES: PromptTemplateType[] = [
  { id: 1, template: "You are a helpful AI.", role: "system", status: "draft" },
  {
    id: 2,
    template:
      "Let's think step by step.\
      Use the following pieces of retrieved context and your knowledge to answer the question.\
      But If you don't know the answer, just say that you don't know. \
      Return answer as markdown format and keep the answer concise. ",
    role: "user",
    status: "draft",
  },
];
