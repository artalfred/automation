import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import filesJson from "../../../../public/data/files.json";
import categoriesJson from "../../../../public/data/categories.json";

const FILES_PATH = path.join(process.cwd(), "public", "data", "files.json");
const PUBLIC_CSV_DIR = path.join(process.cwd(), "public", "csv");

type FileItem = {
  id: string;
  title: string;
  path: string;
  categories: string[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function GET() {
  return NextResponse.json(filesJson);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const title = String(form.get("title") || "").trim();
    const catsRaw = String(form.get("categories") || "[]");
    const cats = JSON.parse(catsRaw) as string[];
    const file = form.get("file") as File | null;
    if (!title || !file)
      return NextResponse.json(
        { error: "Missing title or file" },
        { status: 400 }
      );

    // validate categories exist
    const known = new Set(
      (categoriesJson as string[]).map((c) => c.toLowerCase())
    );
    for (const c of cats) {
      if (!known.has(String(c).toLowerCase())) {
        return NextResponse.json(
          { error: `Unknown category: ${c}` },
          { status: 400 }
        );
      }
    }

    await fs.mkdir(PUBLIC_CSV_DIR, { recursive: true });
    const ext = path.extname(file.name) || ".csv";
    const base = slugify(title);
    const stamp = Date.now();
    const filename = `${base}-${stamp}${ext}`;
    const abs = path.join(PUBLIC_CSV_DIR, filename);
    const data = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(abs, data);

    const id = `${base}-${stamp}`;
    const newItem: FileItem = {
      id,
      title,
      path: `/csv/${filename}`,
      categories: cats,
    };

    const current = filesJson as FileItem[];
    const updated = [...current, newItem];
    await fs.writeFile(FILES_PATH, JSON.stringify(updated, null, 2), "utf8");

    return NextResponse.json(newItem, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const current = filesJson as FileItem[];
  const file = current.find((f) => f.id === id);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // remove the CSV on disk
  try {
    const abs = path.join(
      process.cwd(),
      "public",
      file.path.replace(/^\//, "")
    );
    await fs.unlink(abs);
  } catch {
    // ignore if already gone
  }

  const next = current.filter((f) => f.id !== id);
  await fs.writeFile(FILES_PATH, JSON.stringify(next, null, 2), "utf8");

  return NextResponse.json({ ok: true });
}
