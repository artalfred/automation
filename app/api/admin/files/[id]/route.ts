import { NextResponse } from "next/server";
import { sbAdmin } from "../../../../lib/supabase";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { data, error } = await sbAdmin
    .from("files")
    .select("storage_path")
    .eq("id", id)
    .single();
  if (error || !data)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await sbAdmin.storage
    .from(process.env.SUPABASE_BUCKET!)
    .remove([data.storage_path]);
  const { error: delErr } = await sbAdmin.from("files").delete().eq("id", id);
  if (delErr)
    return NextResponse.json({ error: delErr.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
