// api/metadata/delete.ts
import { deleteFromR2 } from "@/app/api/r2/r2";
import { deleteMetadata, getMetadata } from "@/lib/kv";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get("uuid");
  if (!uuid) return NextResponse.json({ error: "UUID required" }, { status: 400 });

  const metadata = await getMetadata(uuid);
  if (!metadata) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteFromR2(`${uuid}/${metadata.filename}`);
  await deleteMetadata(uuid);

  return NextResponse.json({ success: true });
}
