export const dynamic = "force-dynamic"; // always run dynamically
import { ChatOpenAI } from "@langchain/openai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  const body = await req.json();

  const { model, prompt, isStream = true, modelParams = {} } = body;

  const llm = new ChatOpenAI({
    model: model,
    apiKey: process.env.LITELLM_APIKEY,
    configuration: {
      baseURL: process.env.LITELLM_ENDPOINT,
    },
  }).bind(modelParams);

  try {
    if (!isStream) {
      const response = await llm.invoke(prompt);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = await llm.stream(prompt);

    const customReadable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk.content.toString()));
        }
        controller.close();
      },
    });

    return new Response(customReadable, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("An error occurred while processing the stream:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
