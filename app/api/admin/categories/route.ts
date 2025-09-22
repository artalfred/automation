import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import categoriesJson from "../../../../public/data/categories.json";
import filesJson from "../../../../public/data/files.json";

const CATEGORIES_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "categories.json"
);
const FILES_PATH = path.join(process.cwd(), "public", "data", "files.json");

const clean = (s: string) => s.trim();

export async function GET() {
  return NextResponse.json(categoriesJson);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const n = clean(String(name || ""));
  if (!n) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  const categories = categoriesJson as string[];
  if (categories.some((c) => c.toLowerCase() === n.toLowerCase())) {
    return NextResponse.json({ error: "Category exists" }, { status: 409 });
  }
  const updated = [...categories, n].sort();
  await fs.writeFile(CATEGORIES_PATH, JSON.stringify(updated, null, 2), "utf8");
  return NextResponse.json({ ok: true, categories: updated });
}

export async function PATCH(req: Request) {
  const { from, to } = await req.json();
  const f = clean(String(from || ""));
  const t = clean(String(to || ""));
  if (!f || !t)
    return NextResponse.json({ error: "Missing from/to" }, { status: 400 });

  const categories = categoriesJson as string[];
  if (!categories.includes(f)) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  if (categories.some((c) => c.toLowerCase() === t.toLowerCase())) {
    return NextResponse.json(
      { error: "Target name already exists" },
      { status: 409 }
    );
  }

  // rename in categories.json
  const renamed = categories.map((c) => (c === f ? t : c)).sort();
  await fs.writeFile(CATEGORIES_PATH, JSON.stringify(renamed, null, 2), "utf8");

  // also update all file tags referencing that category
  const files = filesJson as any[];
  const filesRenamed = files.map((file) => ({
    ...file,
    categories: (file.categories || []).map((c: string) => (c === f ? t : c)),
  }));
  await fs.writeFile(FILES_PATH, JSON.stringify(filesRenamed, null, 2), "utf8");

  return NextResponse.json({ ok: true, categories: renamed });
}

export async function DELETE(req: Request) {
  const { name } = await req.json();
  const n = clean(String(name || ""));
  if (!n) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  const categories = categoriesJson as string[];
  if (!categories.includes(n)) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  const filtered = categories.filter((c) => c !== n);
  await fs.writeFile(
    CATEGORIES_PATH,
    JSON.stringify(filtered, null, 2),
    "utf8"
  );

  // remove the tag from all files that had it
  const files = filesJson as any[];
  const filesUpdated = files.map((f) => ({
    ...f,
    categories: (f.categories || []).filter((c: string) => c !== n),
  }));
  await fs.writeFile(FILES_PATH, JSON.stringify(filesUpdated, null, 2), "utf8");

  return NextResponse.json({ ok: true, categories: filtered });
}
