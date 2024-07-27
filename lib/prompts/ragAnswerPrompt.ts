import { PromptTemplateType } from "@/components/PromptFrom";
import { SourceType } from "@/types/chatTypes";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { TokenTextSplitter } from "@langchain/textsplitters";
import { getEncoding } from "js-tiktoken";
export const DEFAULT_RAG_TEMPLATES: PromptTemplateType[] = [
  {
    id: 1,
    template:
      "You are a help AI assistant. \
You are given a user question, and please write clean, concise and accurate answer to the question. \
You will be given a set of related contexts to the question, each starting with a reference number like [[source:x]], where x is a number. \
Please use the context and cite the context at the end of each sentence if applicable. \
Your answer must be correct, accurate and written by an expert using an unbiased and professional tone. \
Please limit to 1024 tokens. \
Do not give any information that is not related to the question, and do not repeat. \
Say 'Sorry, I don't enough information to answer this question, please give me more ditails.' followed by the related topic, if the given context do not provide sufficient information. \
Please cite the contexts with the reference numbers, in the format [source:x]. \
If a sentence comes from multiple contexts, please list all applicable citations, like [source:3][source:5]. \
Other than code and specific names and citations, your answer must be written in the same language as the question.\
Remember, don't blindly repeat the contexts verbatim.",
    role: "system",
    status: "draft",
  },
];

async function messageTokenCounter(messages: [string, string][]) {
  const enc = getEncoding("cl100k_base");

  const totalString = messages.map((msg) => `${msg[0]}:${msg[1]}`).join("\n");
  return enc.encode(totalString).length;
}

async function createContext(sources: SourceType[]) {
  if (!sources || sources.length == 0) {
    return "";
  }
  const context = sources.map((source) => {
    const sourceUrl = source.url ? `(${source.url})` : "";
    const chunkText = source.contents
      .map((content, index) => `CHUNK-#${index + 1}:${content}`)
      .join("\n");
    return `\n[source:${source}]${sourceUrl}\n${source.fileName}\n\n${chunkText}\n`;
  });
  return context;
}

export async function createRagAnswerPrompt(
  templates: PromptTemplateType[],
  query: string,
  sources: SourceType[],
  refineQuery?: string,
  variables?: { [key: string]: string },
  tokenLimit: number = 4096,
) {
  const validTemplates = templates.filter((template) => {
    try {
      PromptTemplate.fromTemplate(template.template);
      return true;
    } catch {
      return false;
    }
  });
  const templateMessages: [string, string][] = validTemplates.map((template) => [
    template.role,
    template.template,
  ]);

  const context = await createContext(sources);
  const contextMessages = ["user", `Context: ${context}`];

  const latestMessageContent = refineQuery
    ? `Query Context:${refineQuery}\nQuestion:${query}`
    : `Question:${query}`;
  const latestMessages: [string, string] = ["user", latestMessageContent];

  const fixTokenCount = await messageTokenCounter([...templateMessages, latestMessages]);

  const leftTokenCount = tokenLimit - fixTokenCount - 300;

  const contextString = [contextMessages].map((msg) => `${msg[0]}:${msg[1]}`).join("\n");

  let promptFromContext = "";
  if (contextString && leftTokenCount > 0) {
    const textSplitter = new TokenTextSplitter({
      chunkSize: leftTokenCount,
      chunkOverlap: 0,
    });
    const texts = await textSplitter.splitText(contextString);
    promptFromContext = texts[0];
  }

  const promptTemplateFromTemplate = ChatPromptTemplate.fromMessages(templateMessages);

  const templateVariables = promptTemplateFromTemplate.inputVariables.map((value) =>
    variables && variables.hasOwnProperty(value)
      ? { value: variables[value] }
      : { value: "" },
  );

  const promptFromTemplate = await promptTemplateFromTemplate.format(templateVariables);

  const promptFromQuery = `${latestMessages[0]}:${latestMessages[1]}`;
  const prompt = `${promptFromTemplate}\n${promptFromContext}\n${promptFromQuery}`;
  return prompt;
}
