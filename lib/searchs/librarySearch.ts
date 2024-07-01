import { SearchRequestSchema } from "@/restful/generated";

export const librarySearcher = async (body: SearchRequestSchema) => {
  // Fetch the streaming data from the API
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
    }),
  }); // Adjust the endpoint as needed

  if (!response.body) {
    throw new Error("ReadableStream not supported by the browser.");
  }
  const data = await response.json();
  return data;
};
