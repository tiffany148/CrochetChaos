import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "prod-1",
      name: "Neon Cotton Yarn",
      category: "yarn",
      price: 18.99,
      description: "Soft cotton yarn in bright neon shades.",
    },
    {
      id: "prod-2",
      name: "Glow Hook Set",
      category: "hook",
      price: 24.5,
      description: "Ergonomic hooks in a rainbow finish.",
    },
    {
      id: "prod-3",
      name: "Stitch Marker Bundle",
      category: "tool",
      price: 11.5,
      description: "Bright, easy-to-see markers for rows and rounds.",
    },
    {
      id: "prod-4",
      name: "Crochet Starter Guide",
      category: "book",
      price: 29.0,
      description: "A beginner-friendly guide for stitches and structure.",
    },
  ]);
}
