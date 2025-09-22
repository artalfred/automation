import { NextResponse } from "next/server";
import { sbAdmin } from "../../../../lib/supabase";

export const runtime = "nodejs";

type Ctx = { params: { id: string } };

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = params;

  // Get storage path so we can remove the blob too
  const { data, error } = await sbAdmin
    .from("files")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // best-effort delete the CSV from storage
  try {
    await sbAdmin.storage
      .from(process.env.SUPABASE_BUCKET!)
      .remove([data.storage_path]);
  } catch {}

  const { error: delErr } = await sbAdmin.from("files").delete().eq("id", id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
