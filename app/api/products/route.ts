import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: "yarn-1", name: "Cotton yarn bundle", category: "Yarn", price: 18.99, description: "A sample listing for colorful cotton yarn." },
    { id: "hook-1", name: "Ergonomic hook set", category: "Hooks", price: 24.5, description: "A sample listing for a comfortable hook set." },
    { id: "tool-1", name: "Stitch marker pack", category: "Tools", price: 7.99, description: "A sample listing for marking rows and rounds." },
  ]);
}
