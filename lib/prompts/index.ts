import { PromptTemplateType } from "@/components/PromptFrom";
import { MessageType, SourceType } from "@/types/chatTypes";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { TokenTextSplitter } from "@langchain/textsplitters";
import { getEncoding } from "js-tiktoken";

async function messageTokenCounter(messages: [string, string][]) {
  const enc = getEncoding("cl100k_base");

  const totalString = messages.map((msg) => `${msg[0]}:${msg[1]}`).join("\n");
  return enc.encode(totalString).length;
}

async function createContext(sources: SourceType[]) {
  if (!sources || sources.length == 0) {
    return "";
  }
  const context = sources.map((source, index) => {
    const sourceUrl = source.url ? `(${source.url})` : "";
    const chunkText = source.contents
      .map((content, index) => `CHUNK-#${index + 1}:${content}`)
      .join("\n");
    return `\n[source:${source.index}]${sourceUrl}\n${source.metadata}\n\n${chunkText}\n`;
  });
  return context;
}

export async function createPrompt(
  templates: PromptTemplateType[],
  messages: MessageType[],
  sources: SourceType[],
  tokenLimit: number = 4096,
  refineQuery?: string,
  variables?: { [key: string]: string },
  sessionFilesContext?: string,
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

  const sourceContext = await createContext(sources);
  let contextMessages = ["user", `Context: ${sourceContext}`];
  if (sessionFilesContext) {
    contextMessages = [
      "user",
      `I have uploaed the following files in this session: ${sessionFilesContext}`,
      ...contextMessages,
    ];
  }

  const historyMessages = messages.slice(0, -1).map((msg) => [msg.role, msg.message]);

  const contextString = [contextMessages, ...historyMessages]
    .map((msg) => `${msg[0]}:${msg[1]}`)
    .join("\n");

  const latestQuery = messages.length > 0 ? messages[messages.length - 1].message : "";
  const latestMessageContent = refineQuery
    ? `Query Context:${refineQuery}\nQuestion:${latestQuery}`
    : `Question:${latestQuery}`;

  const latestMessages: [string, string] = ["user", latestMessageContent];

  const fixTokenCount = await messageTokenCounter([...templateMessages, latestMessages]);

  const leftTokenCount = tokenLimit - fixTokenCount - 500;

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
  console.log("prompt", prompt);
  return prompt;
}
