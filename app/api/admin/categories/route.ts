// app/api/admin/categories/route.ts
import { NextResponse } from "next/server";
import { sbAdmin } from "../../../lib/supabase";

export async function GET() {
  const { data, error } = await sbAdmin
    .from("categories")
    .select("name")
    .order("name");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map((r) => r.name));
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const n = String(name || "").trim();
  if (!n) return NextResponse.json({ error: "Missing name" }, { status: 400 });
  const { error } = await sbAdmin.from("categories").insert({ name: n });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const { from, to } = await req.json();
  const f = String(from || "").trim();
  const t = String(to || "").trim();
  if (!f || !t)
    return NextResponse.json({ error: "Missing from/to" }, { status: 400 });

  const { data: cat, error: findErr } = await sbAdmin
    .from("categories")
    .select("id")
    .eq("name", f)
    .single();
  if (findErr || !cat)
    return NextResponse.json({ error: "Category not found" }, { status: 404 });

  const { error: updErr } = await sbAdmin
    .from("categories")
    .update({ name: t })
    .eq("id", cat.id);
  if (updErr)
    return NextResponse.json({ error: updErr.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { name } = await req.json();
  const n = String(name || "").trim();
  if (!n) return NextResponse.json({ error: "Missing name" }, { status: 400 });
  const { error } = await sbAdmin.from("categories").delete().eq("name", n);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
