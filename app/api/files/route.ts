// app/api/files/route.ts
import { NextResponse } from "next/server";
import { sbAnon } from "../../lib/supabase";

export async function GET(req: Request) {
  const selected = (new URL(req.url).searchParams.get("categories") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Get files + categories in one query
  const { data, error } = await sbAnon
    .from("files")
    .select(
      `
      id, title, public_url,
      file_categories ( categories ( name ) )
    `
    )
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const shaped = (data || []).map((f: any) => ({
    id: f.id,
    title: f.title,
    url: f.public_url,
    categories: (f.file_categories || [])
      .map((fc: any) => fc.categories?.name)
      .filter(Boolean),
  }));

  const results = selected.length
    ? shaped.filter((f: any) =>
        selected.every((c) =>
          f.categories
            .map((x: string) => x.toLowerCase())
            .includes(c.toLowerCase())
        )
      )
    : shaped;

  return NextResponse.json(results);
}
