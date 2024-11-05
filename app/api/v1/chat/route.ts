export const dynamic = "force-dynamic"; // always run dynamically
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { ChatPromptValue } from "@langchain/core/dist/prompt_values";
import { ChatOpenAI } from "@langchain/openai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  const body = await req.json();

  const {
    model,
    messages,
    modelParams = {},
    maxTokens = 4096,
    temperature = 0,
    topP = 1,
  } = body;

  const newMessages = messages.map((message: any) => {
    if (message.id[message.id.length - 1] == "SystemMessage") {
      return new SystemMessage(message.kwargs);
    } else if (message.id[message.id.length - 1] == "AIMessage") {
      return new AIMessage(message.kwargs);
    } else if (message.id[message.id.length - 1] == "HumanMessage") {
      return new HumanMessage(message.kwargs);
    } else {
      return new HumanMessage(message.kwargs);
    }
  });

  // For testing image_url freature
  // const newMessages = [
  //   new HumanMessage({
  //     content: [
  //       { type: "text", text: "这个图里面有什么" },
  //       {
  //         type: "image_url",
  //         image_url: {
  //           url: "https://s3api.techower.com/public/004659d0e13842349fe877b6fe578de2.png",
  //         },
  //       },
  //     ],
  //   }),
  // ];

  //  FOR testing ephemeral freature
  // const newMessages = [
  //   new HumanMessage({
  //     content: [
  //       {
  //         type: "text",
  //         text: "这个文档讲了什么",
  //       },
  //       {
  //         type: "text",
  //         text: "NOT all that Mrs. NOTNOT all that Mrs. Bennet, however,NOT all that Mrs. Bennet, however,NOT all that Mrs. Bennet, however,NOT all that Mrs. Bennet, however,NOT all that Mrs. Bennet, however, all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways; with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all; and they were at last obliged to accept the second-hand intelligence of their neighbour Lady Lucas. Her report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party. Nothing could be more delightful! To be fond of dancing was a certain step towards falling in love; and very lively hopes of Mr. Bingley's heart were entertainedNOT all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways; with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all; and they were at last obliged to accept the second-hand intelligence of their neighbour Lady Lucas. Her report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party. Nothing could be more delightful! To be fond of dancing was a certain step towards falling in love; and very lively hopes of Mr. Bingley's heart were entertainedBennet, however, with the assistance of her five daughters, could ask on the subject was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways; with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all; and they were at last obliged to accept the second-hand intelligence of their neighbour Lady Lucas. Her report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party. Nothing could be more delightful! To be fond of dancing was a certain step towards falling in love; and very lively hopes of Mr. Bingley's heart were entertainedNOT all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways; with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all; and they were at last obliged to accept the second-hand intelligence of their neighbour Lady Lucas. Her report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party. Nothing could be more delightful! To be fond of dancing was a certain step towards falling in love; and very lively hopes of Mr. Bingley's heart were entertainedNOT all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways; with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all; and they were at last obliged to accept the second-hand intelligence of their neighbour Lady Lucas. Her report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party. Nothing could be more delightful! To be fond of dancing was a certain step towards falling in love; and very lively hopes of Mr. Bingley's heart were entertainedNOT all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways; with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all; and they were at last obliged to accept the second-hand intelligence of their neighbour Lady Lucas. Her report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party. Nothing could be more delightful! To be fond of dancing was a certain step towards falling in love; and very lively hopes of Mr. Bingley's heart were entertainedNOT all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways; with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all; and they were at last obliged to accept the second-hand intelligence of their neighbour Lady Lucas. Her report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party. Nothing could be more delightful! To be fond of dancing was a certain step towards falling in love; and very lively hopes of Mr. Bingley's heart were entertainedNOT all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways; with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all; and they were at last obliged to accept the second-hand intelligence of their neighbour Lady Lucas. Her report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party. Nothing could be more delightful! To be fond of dancing was a certain step towards falling in love; and very lively hopes of Mr. Bingley's heart were entertained",
  //         cache_control: { type: "ephemeral" },
  //       },
  //     ],
  //   }),
  // ];

  const llm = new ChatOpenAI({
    model: model,
    apiKey: process.env.LITELLM_APIKEY,
    configuration: {
      baseURL: process.env.LITELLM_ENDPOINT,
    },
    maxTokens: maxTokens,
    temperature: temperature,
    topP: topP,
  }).bind(modelParams);

  try {
    const stream = await llm.stream(newMessages);
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
    if (error instanceof Error) {
      if (
        (error.hasOwnProperty("status") && error.message.includes("400")) ||
        error.message.includes("405")
      ) {
        console.error("An error occurred while processing the stream:", error);
        return new Response("Invalid LLM Request", { status: 400 });
      } else {
        console.error("An error occurred while processing the stream:", error);
        return new Response("System Error, please try again later", { status: 500 });
      }
    }
  }
}
