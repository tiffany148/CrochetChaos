import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "The AI helper is not configured. Add OPENAI_API_KEY in Vercel project settings." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const message = typeof body === "object" && body !== null && "message" in body && typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return NextResponse.json({ error: "Please enter a crochet question." }, { status: 400 });
  if (message.length > 2000) return NextResponse.json({ error: "Please keep your question under 2,000 characters." }, { status: 413 });

  try {
    const client = new OpenAI({ apiKey });
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 500,
      messages: [
        { role: "system", content: "You are a friendly crochet tutor. Explain stitches, gauge, increases, decreases, and pattern notation clearly. State uncertainty when needed. Do not claim to verify a pattern's correctness; advise users to check critical counts against their original pattern." },
        { role: "user", content: message },
      ],
    });
    return NextResponse.json({ reply: result.choices[0]?.message?.content || "No answer was returned." });
  } catch (error) {
    console.error("Crochet helper request failed", error);
    return NextResponse.json({ error: "The crochet helper could not answer right now. Check the API key and billing settings, then try again." }, { status: 502 });
  }
}
