export const librarySearcher = async (
  query: string,
  agent_id?: string,
  user_id?: string,
  limit: number = 5,
) => {
  // Fetch the streaming data from the API
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      agent_id: agent_id,
      user_id: user_id,
      limit,
    }),
  }); // Adjust the endpoint as needed

  if (!response.body) {
    throw new Error("ReadableStream not supported by the browser.");
  }
  const data = await response.json();
  return data;
};
