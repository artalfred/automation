import { NextRequest, NextResponse } from "next/server";
import { sbAdmin } from "../../../../lib/supabase";

export const runtime = "nodejs";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1) Get storage path
  const { data, error } = await sbAdmin
    .from("files")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 2) Remove from storage (best effort)
  try {
    await sbAdmin.storage
      .from(process.env.SUPABASE_BUCKET!)
      .remove([data.storage_path]);
  } catch {}

  // 3) Delete database row
  const { error: delErr } = await sbAdmin.from("files").delete().eq("id", id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
