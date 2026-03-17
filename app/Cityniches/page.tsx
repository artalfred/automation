"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MultiSelectChips from "../Components/MultiSelectChips";

type FileItem = {
  id: string;
  title: string;
  url: string; // Supabase public_url
  categories: string[];
};

export default function Page() {
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories from Supabase API route
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data || []))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-4xl pb-6 font-semibold main--color">
        Lead Lists Library
      </h1>
      <p className="text-gray-600 pb-2">
        Filter by one or more categories. Files must match all selected.
      </p>

      {categories.length > 0 ? (
        <ClientFilter options={categories} />
      ) : (
        <p className="text-gray-500">Loading categories…</p>
      )}
    </main>
  );
}

function ClientFilter({ options }: { options: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<FileItem[]>([]);
  const query = selected.join(",");

  useEffect(() => {
    const url = query
      ? `/api/files?categories=${encodeURIComponent(query)}`
      : "/api/files";

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || res.statusText);
        }
        return res.json();
      })
      .then((data) => setResults(data || []))
      .catch((err) => {
        console.error("Failed to load files:", err);
        setResults([]); // reset to empty if error
      });
  }, [query]);

  return (
    <div className="space-y-6">
      <MultiSelectChips options={options} onChange={setSelected} />

      <div className="border rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium main--color">Results</h2>
          <span className="text-sm text-gray-500">
            {results.length} file(s)
          </span>
        </div>

        <ul className="space-y-3">
          {results.map((f) => (
            <li
              key={f.id}
              className="p-3 border rounded hover:bg-gray-50 flex justify-between"
            >
              <div>
                <Link
                  href={`/files/${f.id}`}
                  className="font-medium hover:underline main--color"
                >
                  {f.title}
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  {f.categories.join(" • ")}
                </div>
              </div>

              {f.url ? (
                <a
                  href={f.url}
                  download
                  className="inline-flex items-center gap-2 px-3 py-2 rounded bg-teal-600 text-white text-sm active"
                  aria-label={`Download ${f.title}`}
                >
                  Download CSV
                </a>
              ) : (
                <span className="text-xs text-red-600">No file path</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
