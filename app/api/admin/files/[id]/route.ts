import { NextResponse } from "next/server";
import { sbAdmin } from "../../../../lib/supabase";
export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  // Get storage path for cleanup
  const { data, error } = await sbAdmin
    .from("files")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Try removing from storage
  try {
    await sbAdmin.storage
      .from(process.env.SUPABASE_BUCKET!)
      .remove([data.storage_path]);
  } catch {}

  // Delete DB row
  const { error: delErr } = await sbAdmin.from("files").delete().eq("id", id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
