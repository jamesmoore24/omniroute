import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, expensive_model, cheap_model } = await req.json();

  const response = await fetch(`http://0.0.0.0:8000/route`, {
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
  });

  const data = await response.json();

  return new NextResponse(JSON.stringify({ routed_model: data.routed_model }), {
    headers: { "Content-Type": "application/json" },
  });
}
