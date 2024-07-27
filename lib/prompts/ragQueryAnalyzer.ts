import { DEFAULT_LLM_MODEL } from "@/lib/models";
import { AIMessage } from "@langchain/core/dist/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

const QueryAnalyzeResultSchema = z.object({
  refineQuery: z
    .union([z.string(), z.array(z.string())])
    .describe(
      `Redefine and generate subqueries aligned with the user's present intent to improve accuracy and relevance, uniquely rephrasing the original question.`,
    ),
  keywords: z
    .union([z.string(), z.array(z.string())])
    .default([])
    .describe("3-8 search keywords that refine and improve the search results."),
});

const parser = StructuredOutputParser.fromZodSchema(QueryAnalyzeResultSchema);

export async function ragQueryAnalyzer(
  query: string,
  model?: string | null,
  knowledge_bases?: string, // not used for now
): Promise<z.infer<typeof QueryAnalyzeResultSchema>> {
  const queryAnalyzerPrompt = `You are an expert at analyzing user questions as an AI. \  
  Follow these steps for query analysis:
  
  1. Perform query expansion. 
  If there are multiple common ways of phrasing a user question or common synonyms for key words in the question, make sure to return multiple versions of the query with the different phrasings.
  3. Generate 3-8 keywords based on the overall intent and final query for search.
  
  Examples:
  

  {format_instructions}
  `;

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", queryAnalyzerPrompt],
    ["user", `Input: ${query} Output: \`\`\`json `],
  ]);
  const formattedPrompt = await promptTemplate.format({
    format_instructions: parser.getFormatInstructions(),
  });

  const modelParams = {
    stop: ["```", "} ```"],
  };
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

  let result;
  try {
    result = await parser.parse(message.content?.toString());
  } catch (error) {
    console.error(`parse error:${error}`);
    result = { refineQuery: query, keywords: [] };
  }

  return result;
}
