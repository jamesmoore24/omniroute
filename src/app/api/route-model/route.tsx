import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, expensive_model, cheap_model } = await req.json();

  const response = await fetch(
    `${process.env.ROUTING_SERVER_IP}:${process.env.ROUTING_SERVER_PORT}/route`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: message,
        threshold: 0.1,
        strong_model: expensive_model,
        weak_model: cheap_model,
      }),
    }
  );

  const data = await response.json();
  console.log(data);

  return new NextResponse(JSON.stringify({ routed_model: data.routed_model }), {
    headers: { "Content-Type": "application/json" },
  });
}
