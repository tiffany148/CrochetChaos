import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Please ask a crochet question." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set. Add it to your environment and restart the app." },
        { status: 500 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful crochet teacher and pattern editor. Explain stitches, rows, rounds, increases, decreases, gauge, and turning chains clearly.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content ?? "No answer returned.";
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: "The AI helper is unavailable right now. Please check your API key." },
      { status: 500 }
    );
  }
}
