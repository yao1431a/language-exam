import { NextResponse } from "next/server";
import { providerStatus } from "@/lib/coach/provider";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(providerStatus(), {
    headers: { "Cache-Control": "no-store" },
  });
}
