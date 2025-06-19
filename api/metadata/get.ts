// api/metadata/get.ts
import { NextResponse } from "next/server";
import { getMetadata } from "@/lib/kv";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get("uuid");
  if (!uuid) return NextResponse.json({ error: "UUID required" }, { status: 400 });

  const metadata = await getMetadata(uuid);
  if (!metadata) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(metadata);
}
