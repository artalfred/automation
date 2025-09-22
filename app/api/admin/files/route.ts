// app/api/admin/files/route.ts
import { NextResponse } from "next/server";
import { sbAdmin } from "../../../lib/supabase"; // or "../../../lib/supabase" if you don't use "@/"

export const runtime = "nodejs";

type ShapedFile = {
  id: string;
  title: string;
  path: string; // for your management list (uses public_url)
  categories: string[];
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function GET() {
  // list files for the management page
  const { data, error } = await sbAdmin
    .from("files")
    .select(
      `
      id, title, public_url, created_at,
      file_categories ( categories ( name ) )
    `
    )
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const shaped: ShapedFile[] = (data || []).map((f: any) => ({
    id: f.id,
    title: f.title,
    path: f.public_url, // your page expects "path" currently
    categories: (f.file_categories || [])
      .map((fc: any) => fc?.categories?.name)
      .filter(Boolean),
  }));

  return NextResponse.json(shaped);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const title = String(form.get("title") || "").trim();
    const cats = JSON.parse(String(form.get("categories") || "[]")) as string[];
    const file = form.get("file") as File | null;

    if (!title || !file) {
      return NextResponse.json(
        { error: "Missing title or file" },
        { status: 400 }
      );
    }

    // 1) Upload CSV to Supabase Storage
    const stamp = Date.now();
    const base = slug(title);
    const ext = (file.name.split(".").pop() || "csv").toLowerCase();
    const storagePath = `csv/${base}-${stamp}.${ext}`;

    const { error: upErr } = await sbAdmin.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(storagePath, await file.arrayBuffer(), {
        contentType: "text/csv",
        upsert: false,
      });

    if (upErr) {
      return NextResponse.json(
        { error: `Storage: ${upErr.message}` },
        { status: 500 }
      );
    }

    const { data: pub } = sbAdmin.storage
      .from(process.env.SUPABASE_BUCKET!)
      .getPublicUrl(storagePath);

    const public_url = pub?.publicUrl || "";

    // 2) Ensure categories exist (auto-create if missing)
    const catIds: string[] = [];
    for (const raw of cats) {
      const name = String(raw).trim();
      if (!name) continue;

      const { data: found, error: findErr } = await sbAdmin
        .from("categories")
        .select("id, name")
        .ilike("name", name)
        .maybeSingle();

      if (findErr)
        return NextResponse.json({ error: findErr.message }, { status: 500 });

      if (found?.id) {
        catIds.push(found.id);
      } else {
        const { data: inserted, error: insErr } = await sbAdmin
          .from("categories")
          .insert({ name })
          .select("id")
          .single();
        if (insErr)
          return NextResponse.json({ error: insErr.message }, { status: 500 });
        catIds.push(inserted!.id);
      }
    }

    // 3) Insert file row
    const { data: frow, error: finsertErr } = await sbAdmin
      .from("files")
      .insert({ title, storage_path: storagePath, public_url })
      .select("id")
      .single();

    if (finsertErr)
      return NextResponse.json({ error: finsertErr.message }, { status: 500 });

    // 4) Join rows
    if (catIds.length) {
      const rows = catIds.map((cid) => ({
        file_id: frow.id,
        category_id: cid,
      }));
      const { error: joinErr } = await sbAdmin
        .from("file_categories")
        .insert(rows);
      if (joinErr)
        return NextResponse.json({ error: joinErr.message }, { status: 500 });
    }

    return NextResponse.json(
      { ok: true, id: frow.id, url: public_url },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
