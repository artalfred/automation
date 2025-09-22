"use client";

import { useEffect, useState } from "react";

type FileItem = {
  id: string;
  title: string;
  path: string;
  categories: string[];
};

export default function ManagementPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  // upload form state
  const [title, setTitle] = useState("");
  const [csv, setCsv] = useState<File | null>(null);
  const [pick, setPick] = useState<string>(""); // select dropdown
  const [picked, setPicked] = useState<string[]>([]); // chosen categories
  const [newCat, setNewCat] = useState("");

  // category edit state
  const [renameFrom, setRenameFrom] = useState("");
  const [renameTo, setRenameTo] = useState("");

  const refresh = async () => {
    const [cats, files] = await Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/files").then((r) => r.json()),
    ]);
    setCategories(cats);
    setFiles(files);
  };
  useEffect(() => {
    refresh();
  }, []);

  const addPicked = () => {
    if (pick && !picked.includes(pick)) setPicked([...picked, pick]);
    setPick("");
  };
  const removePicked = (c: string) => setPicked(picked.filter((x) => x !== c));

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !csv) return alert("Title and CSV file are required.");
    const fd = new FormData();
    fd.append("title", title);
    fd.append("file", csv);
    fd.append("categories", JSON.stringify(picked));

    const res = await fetch("/api/admin/files", { method: "POST", body: fd });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return alert(`Upload failed: ${err.error || res.statusText}`);
    }
    setTitle("");
    setCsv(null);
    setPicked([]);
    await refresh();
    alert("Uploaded!");
  };

  // categories CRUD
  const addCategory = async () => {
    const name = newCat.trim();
    if (!name) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return alert(`Add failed: ${err.error || res.statusText}`);
    }
    setNewCat("");
    await refresh();
  };

  const doRename = async () => {
    if (!renameFrom || !renameTo) return;
    const res = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: renameFrom, to: renameTo }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return alert(`Rename failed: ${err.error || res.statusText}`);
    }
    setRenameFrom("");
    setRenameTo("");
    await refresh();
  };

  const deleteCategory = async (name: string) => {
    if (!confirm(`Delete category '${name}' and remove it from all files?`))
      return;
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return alert(`Delete failed: ${err.error || res.statusText}`);
    }
    await refresh();
  };

  const deleteFile = async (id: string) => {
    if (!confirm("Delete this file entry and its CSV?")) return;
    const res = await fetch(`/api/admin/files/${id}`, { method: "DELETE" }); // <-- path fix
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return alert(`Delete failed: ${body.error || res.statusText}`);
    await refresh();
  };

  return (
    <main className="p-6 space-y-10">
      <h1 className="text-3xl font-semibold main--color">Management</h1>

      {/* Upload CSV */}
      <section className="space-y-4 border rounded p-4">
        <h2 className="text-xl font-medium main--color">Upload a New Leads</h2>
        <form onSubmit={upload} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col">
              <span className="text-sm text-gray-600 pb-2">Title</span>
              <input
                className="rounded px-3 py-2 border-2 border-color bg-white main--color outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Phoenix Leads"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-600 pb-2">CSV File</span>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsv(e.target.files?.[0] || null)}
                className="rounded px-3 py-2 border-2 border-color bg-white text-gray-500 outline-none"
              />
            </label>
          </div>

          {/* pick categories from list (multi) */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                className="rounded px-3 py-2 border-2 border-color bg-white main--color outline-none"
                value={pick}
                onChange={(e) => setPick(e.target.value)}
              >
                <option value="">Add category…</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addPicked}
                className="px-3 py-2 rounded active"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {picked.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full nav-btn"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => removePicked(c)}
                    aria-label={`Remove ${c}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button className="px-4 py-2 rounded active text-white">
            Upload & Save
          </button>
        </form>
      </section>

      {/* Categories */}
      <section className="space-y-4 border rounded p-4">
        <h2 className="text-xl font-medium main--color">Categories</h2>

        {/* List + delete */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full nav-btn"
            >
              {c}
              <button
                className="text-red-600"
                title="Delete"
                onClick={() => deleteCategory(c)}
              >
                🗑
              </button>
            </span>
          ))}
        </div>

        {/* Add new */}
        <div className="flex gap-2 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 pb-2">New category</label>
            <input
              className="rounded px-3 py-3 border-2 border-color bg-white main--color outline-none"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
          </div>
          <button
            onClick={addCategory}
            className="px-3 py-2 rounded bg-gray-200 management-btn-active"
          >
            Add
          </button>
        </div>

        {/* Rename */}
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 pb-2">Rename from</label>
            <select
              className="rounded px-3 border-2 border-color bg-white main--color outline-none"
              value={renameFrom}
              onChange={(e) => setRenameFrom(e.target.value)}
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center align-middle gap-4">
            <label className="text-sm text-gray-600">=</label>
            <input
              className="rounded px-3 py-3 border-2 border-color bg-white main--color outline-none"
              value={renameTo}
              onChange={(e) => setRenameTo(e.target.value)}
            />
            <button
              onClick={doRename}
              className="px-3 py-2 rounded bg-teal-600 text-white management-btn-active"
            >
              Rename
            </button>
          </div>
        </div>
      </section>

      {/* Files list with Delete */}
      <section className="space-y-2 border rounded p-4">
        <h2 className="text-xl font-medium main--color">Files</h2>
        <ul className="space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="p-2 border rounded flex items-center justify-between"
            >
              <div>
                <div className="font-medium main--color">{f.title}</div>
                <div className="text-xs text-gray-700">
                  {f.categories.join(" • ")}
                </div>
              </div>
              <button
                onClick={() => deleteFile(f.id)}
                className="text-sm px-3 py-1 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
