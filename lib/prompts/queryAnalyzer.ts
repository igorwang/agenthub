import { MessageType } from "@/types/chatTypes";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const queryAnalyzerPrompt = `You are an expert at converting user questions into full text search egine queries.
You have access to a database of knowledge base for building LLM-powered applications.

Focus on the user's latest intent. \
If the intent has shifted, ignore previous intents and retain only the current one. \
If the last intent is unclear, consider using context to infer the user's ultimate question intent. \
Based on the final question intent, perform query decomposition. \
Break down the final user question into distinct sub-questions that need to be answered to address the original question.
And Generate around 5 search keywords.

If there are acronyms or words you are not familiar with, do not try to rephrase them.
If the query is already well formed, do not try to decompose it further.`;

export const queryAnalyzer = async (
  messages: MessageType[],
  model?: string | null,
) => {
  const userMessages = messages.filter((message) => message.role == "user");
  // memory
  const histryContext =
    userMessages.length >= 3
      ? messages
          .slice(-3, -1)
          .map((message) => message.message)
          .join("\n")
      : "";

  const latestQuestion =
    messages.length > 1 ? messages[messages.length - 1].message : "";

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", queryAnalyzerPrompt],
    [
      "user",
      "Ensure the output language is consistent with the input language",
    ],
    // ["user", `HisotryQuestions: ${histryContext}`],
    ["user", `Input: ${latestQuestion}`],
  ]);

  const formattedPrompt = await promptTemplate.format({});

  const defaultModel = "meta-llama/Meta-Llama-3-8B-Instruct";
  const selectedModel = model || defaultModel;
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: selectedModel,
      prompt: formattedPrompt,
      isStream: false,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  return data;
};
