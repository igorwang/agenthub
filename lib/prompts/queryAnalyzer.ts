import { DEFAULT_LLM_MODEL } from "@/lib/models";
import { MessageType } from "@/types/chatTypes";
import { AIMessage } from "@langchain/core/dist/messages";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const QueryAnalyzeResultSchema = z.object({
  isRelated: z
    .boolean()
    .default(false)
    .describe("Does the given database contain information relevant to the query?"),
  isFollowUp: z
    .boolean()
    .default(false)
    .describe(
      "Is the user's latest question related to the previous question, and does it require a new database search?",
    ),
  refineQuery: z
    .union([z.string(), z.array(z.string())])
    .describe(
      `Redefine and create subqueries based on a user's current intent to enhance precision and relevance.`,
    ),
  keywords: z
    .union([z.string(), z.array(z.string())])
    .describe("3-8 search keywords that refine and improve the search results."),
  knowledge_base_ids: z
    .array(z.string())
    .default([])
    .describe(
      "List of knowledge base IDs to specify for the search. Return an empty array if you don't have permission.",
    ),
});

const parser = StructuredOutputParser.fromZodSchema(QueryAnalyzeResultSchema);

export async function queryAnalyzer(
  messages: MessageType[],
  model?: string | null,
  knowledge_bases?: string,
) {
  const queryAnalyzerPrompt = `You are an expert at analyzing user questions as an AI. \
  You just have full access to the knowledge bases: {knowledge_bases}
  
  Follow these steps for query analysis:
  
  1. Analyze the user's historical and latest queries to determine the current intent. If the intent has changed, disregard previous queries and focus on the current intent. Use context to infer the ultimate question if unclear.
  2. Refine the query by breaking down the final question into distinct sub-questions that address the original query.
  3. Generate 3-8 keywords based on the overall intent and final query.
  4. Search relevant knowledge bases for answers, ensuring high-precision matching across domain and content. Only search databases with consistent domains.
  5. isFollowUp: Is the user's latest question related to the previous question, and does it require a new database search?
  Please output strictly in JSON format, for example:
  {{"isRelated":boolean,"isFollowUp":boolean ,"refineQuery":String | [String], "keywords":[String], "knowledge_base_ids":[String]}}
  6. If the user's input language is not English, generate bilingual refineQuery in both the original language and English.
  `;

  const tools = [
    {
      type: "function",
      function: {
        name: "search_library",
        description: "Search information from knowledge base",
        parameters: zodToJsonSchema(QueryAnalyzeResultSchema),
      },
    },
  ];

  const modelParams = {
    // tools: tools,
    // tool_choice: knowledge_bases ? "auto" : "none",
    // stop: ["```", "} ```"],
  };

  const userMessages = messages.filter((message) => message.role == "user");
  // memory
  const histryContext =
    userMessages.length >= 3
      ? messages
          .slice(-3, -1)
          .map((message) => message.message)
          .join("\n")
      : "";
  const latestQuestion = messages[messages.length - 1].message;

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", queryAnalyzerPrompt],
    ["user", `HisotryQuestions: ${histryContext}`],
    ["user", `Input: ${latestQuestion} Output: \`\`\`json `],
  ]);
  const formattedPrompt = await promptTemplate.format({
    knowledge_bases: knowledge_bases || "",
    // format_instructions: parser.getFormatInstructions(),
  });

  const selectedModel = model || DEFAULT_LLM_MODEL;
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: selectedModel,
      prompt: formattedPrompt,
      isStream: false,
      modelParams: modelParams,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const message: AIMessage = data.kwargs;

  // console.log("tool_calls", message.tool_calls);
  // const tool_calls = message.tool_calls
  //   ?.filter((item) => {
  //     const parseArguments = QueryAnalyzeResultSchema.safeParse(item.args);
  //     console.log(parseArguments.data, parseArguments.success);
  //     return item.name == "search_library" && parseArguments.success;
  //   })
  //   .map((item) => QueryAnalyzeResultSchema.parse(item.args));

  let queriesFromContent = null;
  try {
    const response = await parser.parse(message.content?.toString());
    queriesFromContent = {
      isRelated: response.isRelated,
      refineQuery: response.refineQuery.toString(),
      keywords: response.keywords.toString(),
      knowledge_base_ids: response.knowledge_base_ids || [],
      isFollowUp: response.isFollowUp,
    };
  } catch (error) {
    console.error(`parse error:${error}`);
    queriesFromContent = {
      isRelated: false,
      refineQuery: "",
      keywords: "",
      knowledge_base_ids: [],
      isFollowUp: false,
    };
  }

  // const structuredQueries =
  //   tool_calls && tool_calls.length > 0
  //     ? tool_calls
  //     : queriesFromContent
  //       ? [queriesFromContent]
  //       : [];

  return queriesFromContent;
}
