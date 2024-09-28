import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, expensive_model, cheap_model } = await req.json();

  console.log(message, expensive_model, cheap_model);

  const response = await fetch(`${process.env.MODEL_ROUTING_IP}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: message }),
  });

  const data = await response.json();

  return new NextResponse(JSON.stringify({ winrate: data.winrate }), {
    headers: { "Content-Type": "application/json" },
  });
}
