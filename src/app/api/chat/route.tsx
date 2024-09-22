import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log("Received messages:", messages);

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      ...messages, // Include the conversation history here
    ],
    stream: true,
    stream_options: {
      include_usage: true,
    },
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let usageInfo = null;
      for await (const chunk of stream) {
        if (chunk.usage) {
          // This is the special chunk with usage statistics
          usageInfo = chunk.usage;
          controller.enqueue(
            encoder.encode(`\n\nUSAGE_INFO:${JSON.stringify(usageInfo)}`)
          );
        } else {
          const content = chunk.choices[0]?.delta?.content || "";
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
