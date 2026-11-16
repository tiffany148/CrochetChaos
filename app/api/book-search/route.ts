import { NextRequest, NextResponse } from "next/server";
import { searchChapters } from "../../../lib/book-load";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const needle = query.trim();
  if (needle.length < 2 || needle.length > 80) return NextResponse.json({ results: [], total: 0 });
  return NextResponse.json(searchChapters(needle));
}