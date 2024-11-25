import { PromptTemplateType } from "@/components/PromptFrom";
import { Message_Role_Enum } from "@/graphql/generated/types";
import { checkHasContextCacheFunction } from "@/lib/models/contextCacheLLM";
import { checkHasVisionFunction } from "@/lib/models/visionLLM";
import { MessageType, SourceType } from "@/types/chatTypes";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

async function createSourceContext(sources: SourceType[]) {
  if (!sources || sources.length == 0) {
    return "";
  }
  const context = sources.map((source, index: number) => {
    const sourceUrl = source.url ? `(${source.url})` : "";
    const sourceTitle = source?.title || "";
    const chunkText = source.contents
      .map((content, index) => `<Chunk-${index + 1}>\n${content}\n</Chunk>`)
      .join("\n");
    return `\n<Source-${index + 1} title="${sourceTitle}">\nSource URL: ${sourceUrl}\nSource Metadata: ${source.metadata}\n\n Source Content: ${chunkText}\n</Source>\n`;
  });
  return context.join("\n");
}

export async function createMessages(
  model: string,
  templates: PromptTemplateType[],
  messages: MessageType[],
  sources: SourceType[],
  chatContext?: string,
  sessionFilesContext?: string,
) {
  let chatMessages: (HumanMessage | AIMessage | SystemMessage)[] = [];

  const hasVisionFunction = checkHasVisionFunction(model);
  const hasContextCacheFunction = checkHasContextCacheFunction(model);

  templates.forEach((template) => {
    if (template.role == Message_Role_Enum.System) {
      chatMessages.push(new SystemMessage(template.template));
    } else if (template.role == Message_Role_Enum.User) {
      chatMessages.push(new HumanMessage(template.template));
    } else if (template.role == Message_Role_Enum.Assistant) {
      chatMessages.push(new AIMessage(template.template));
    } else {
      chatMessages.push(new SystemMessage(template.template));
    }
  });

  if (chatContext) {
    if (hasContextCacheFunction && chatContext.length > 4000) {
      chatMessages.push(
        new HumanMessage({
          content: [
            {
              type: "text",
              text: `Chat Context: ${chatContext}`,
              cache_control: { type: "ephemeral" },
            },
          ],
        }),
      );
    } else {
      chatMessages.push(new HumanMessage(`Chat Context: ${chatContext}`));
    }
  }
  if (sources && sources.length > 0) {
    const sourceContext = await createSourceContext(sources);
    if (hasContextCacheFunction && sourceContext && sourceContext.length > 4000) {
      chatMessages.push(
        new HumanMessage({
          content: [
            {
              type: "text",
              text: `Reference Sources: ${sourceContext}`,
              cache_control: { type: "ephemeral" },
            },
          ],
        }),
      );
    } else {
      chatMessages.push(new HumanMessage(`Reference Sources: ${sourceContext}`));
    }
  }

  if (sessionFilesContext) {
    chatMessages.push(new HumanMessage(`Uploaded File Metedata: ${sessionFilesContext}`));
  }
  messages.forEach((message) => {
    if (hasVisionFunction && message.imageUrls && message.imageUrls.length > 0) {
      const imageContent = message.imageUrls.map((imageUrl) => {
        return {
          type: "image_url",
          image_url: {
            url: imageUrl,
          },
        };
      });
      chatMessages.push(
        new HumanMessage({
          content: [
            {
              type: "text",
              text: message.message || "",
            },
            ...imageContent,
          ],
        }),
      );
    } else if (
      hasContextCacheFunction &&
      message.message &&
      message.message.length > 4000
    ) {
      chatMessages.push(
        new HumanMessage({
          content: [
            { type: "text", text: message.message, cache_control: { type: "ephemeral" } },
          ],
        }),
      );
    } else {
      chatMessages.push(new HumanMessage(message.message || ""));
    }
  });

  return chatMessages;
}
