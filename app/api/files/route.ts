import { NextResponse } from "next/server";
// import files from "@/data/files.json";
import files from "../../../public/data/files.json";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  // categories=Alabama,Arizona
  const catsParam = searchParams.get("categories");
  const selected = (catsParam ? catsParam.split(",") : [])
    .map((s) => s.trim())
    .filter(Boolean);

  // AND logic: a file must include all selected categories
  const results = files.filter((f) =>
    selected.every((cat) =>
      f.categories.map((c) => c.toLowerCase()).includes(cat.toLowerCase())
    )
  );

  // if no filters, return all
  return NextResponse.json(selected.length ? results : files);
}
