export const dynamic = "force-dynamic"; // always run dynamically

export async function GET() {
  // This encoder will stream your text
  const encoder = new TextEncoder();
  //   const customReadable = new ReadableStream({
  //     start(controller) {
  //       // Start encoding 'Basic Streaming Test',
  //       // and add the resulting stream to the queue
  //       controller.enqueue(
  //         encoder.encode(
  //           "Basic Streaming Test Basic Streaming Test Basic Streaming Test Basic Streaming Test"
  //         )
  //       );
  //       // Prevent anything else being added to the stream
  //       controller.close();
  //     },
  //   });
  const customReadable = new ReadableStream({
    async start(controller) {
      const messages = ["Basic", " Streaming", " Test"];
      for (const message of messages) {
        controller.enqueue(encoder.encode(message));
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 延时1秒
      }
      controller.close();
    },
  });

  return new Response(customReadable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
