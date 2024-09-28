import { NextResponse } from "next/server";
import { cerebras } from "@/app/api/inference";

export async function POST(req: Request) {
  const { messages, provider } = await req.json();
  const encoder = new TextEncoder();
  const startTime = Date.now();

  const stream = await cerebras.chat.completions.create({
    model: provider,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      ...messages, // Include the conversation history here
    ],
    stream: true,
    stream_options: {
      include_usage: true,
    },
  });

  const readable = new ReadableStream({
    async start(controller) {
      let usageInfo = null;

      for await (const chunk of stream) {
        if (chunk.usage) {
          // This is the special chunk with usage statistics
          usageInfo = chunk.usage;
          controller.enqueue(
            encoder.encode(
              `\n\nUSAGE_INFO:${JSON.stringify(usageInfo)}TIME:${
                Date.now() - startTime
              }`
            )
          );
        } else {
          const content = chunk.choices?.[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
