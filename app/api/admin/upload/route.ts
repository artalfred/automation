// app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { sbAdmin } from "../../../lib/supabase";

export async function POST(req: Request) {
  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const cats = JSON.parse(String(form.get("categories") || "[]")) as string[];
  const file = form.get("file") as File | null;

  if (!title || !file)
    return NextResponse.json(
      { error: "Missing title or file" },
      { status: 400 }
    );

  const stamp = Date.now();
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const ext = (file.name.split(".").pop() || "csv").toLowerCase();
  const storagePath = `csv/${base}-${stamp}.${ext}`;

  // 1) Upload to Storage
  const { error: upErr } = await sbAdmin.storage
    .from(process.env.SUPABASE_BUCKET!)
    .upload(storagePath, await file.arrayBuffer(), {
      contentType: "text/csv",
      upsert: false,
    });

  if (upErr)
    return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: pub } = sbAdmin.storage
    .from(process.env.SUPABASE_BUCKET!)
    .getPublicUrl(storagePath);

  const public_url = pub?.publicUrl || "";

  // 2) Ensure categories exist and collect their IDs
  const catIds: string[] = [];
  for (const name of cats) {
    const n = String(name).trim();
    if (!n) continue;
    const { data: found } = await sbAdmin
      .from("categories")
      .select("id")
      .eq("name", n)
      .maybeSingle();
    if (found?.id) {
      catIds.push(found.id);
    } else {
      const { data: inserted, error } = await sbAdmin
        .from("categories")
        .insert({ name: n })
        .select("id")
        .single();
      if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
      catIds.push(inserted.id);
    }
  }

  // 3) Insert file
  const { data: fileRow, error: fileErr } = await sbAdmin
    .from("files")
    .insert({ title, storage_path: storagePath, public_url })
    .select("id")
    .single();

  if (fileErr)
    return NextResponse.json({ error: fileErr.message }, { status: 500 });

  // 4) Join rows
  if (catIds.length) {
    const rows = catIds.map((cid) => ({
      file_id: fileRow.id,
      category_id: cid,
    }));
    const { error: jErr } = await sbAdmin.from("file_categories").insert(rows);
    if (jErr)
      return NextResponse.json({ error: jErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: fileRow.id, url: public_url });
}
