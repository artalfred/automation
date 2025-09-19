"use client";
import { usePathname } from "next/navigation";
import Container from "../Components/Container";
import { useMemo, useState } from "react";
import Papa from "papaparse";
import Image from "next/image";
import Link from "next/link";
import AutomationHeader from "../Components/AutomationHeader";

type Row = Record<string, string>;

const EMAIL_HEADER_REGEX = /(^|\b)(e[-_ ]?mail|email address)\b/i;
const EMAIL_VALUE_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi; // case-insensitive via 'i'

export default function Cityniches() {
  const pathname = usePathname();
  const [originalText, setOriginalText] = useState("");
  const [removeText, setRemoveText] = useState("");
  const [csvData, setCsvData] = useState<Row[]>([]);
  const [cleanedData, setCleanedData] = useState<Row[]>([]);
  const [progress, setProgress] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);
  const [originalFileName] = useState("pasted_data");

  // --- Helpers ---
  const parseText = (text: string): Row[] => {
    if (!text.trim()) return [];
    const result = Papa.parse<Row>(text, {
      header: true, // try to use headers if present
      skipEmptyLines: true,
      dynamicTyping: false,
      delimiter: "", // auto-detect
    });

    // If header parse produced a single column like "a,b,c" header,
    // or obviously failed, fallback to no-header guess.
    const data = (result.data || []).filter(Boolean);
    if (data.length > 0) return data;

    // Fallback: parse without header, then create generic headers
    const alt = Papa.parse<string[]>(text, {
      header: false,
      skipEmptyLines: true,
      dynamicTyping: false,
      delimiter: "",
    });
    const rows = alt.data as string[][];
    if (!rows || rows.length === 0) return [];

    const maxLen = Math.max(...rows.map((r) => r.length));
    const headers = Array.from({ length: maxLen }, (_, i) => `col_${i + 1}`);
    return rows.map((r) =>
      headers.reduce<Row>((acc, h, i) => {
        acc[h] = (r[i] ?? "").toString();
        return acc;
      }, {})
    );
  };

  const findEmailHeader = (rows: Row[]): string | null => {
    if (!rows.length) return null;
    const headers = Object.keys(rows[0] || {});
    // 1) obvious header name
    const obvious = headers.find((h) => EMAIL_HEADER_REGEX.test(h));
    if (obvious) return obvious;

    // 2) heuristic: choose the header whose values most look like emails
    let best: { header: string; score: number } | null = null;
    for (const h of headers) {
      let score = 0;
      for (const r of rows.slice(0, 50)) {
        const v = (r[h] ?? "").toString();
        if (v.match(EMAIL_VALUE_REGEX)) score++;
      }
      if (!best || score > best.score) best = { header: h, score };
    }
    if (best && best.score > 0) return best.header;
    return null;
  };

  const extractEmailsFromRows = (rows: Row[]): string[] => {
    const found: string[] = [];
    for (const r of rows) {
      for (const v of Object.values(r)) {
        if (!v) continue;
        const matches = v.toString().match(EMAIL_VALUE_REGEX);
        if (matches) {
          for (const m of matches) found.push(m.toLowerCase());
        }
      }
    }
    return Array.from(new Set(found));
  };

  const handleCleanData = () => {
    // Parse both text blocks right when user clicks (keeps UI snappy while typing)
    const originalRows = parseText(originalText);
    const removalRows = parseText(removeText);

    if (originalRows.length === 0 || removalRows.length === 0) {
      alert("Paste both: original data and the list of emails.");
      return;
    }
    setCsvData(originalRows);
    setIsCleaning(true);
    setProgress(1);

    const emailsToRemove = new Set(extractEmailsFromRows(removalRows));

    const emailHeader = findEmailHeader(originalRows);

    // Simulate progress for UX
    let currentProgress = 1;
    const interval = setInterval(() => {
      currentProgress += 7;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);

        const filtered = originalRows.filter((row) => {
          // Prefer the detected email column
          if (emailHeader) {
            const v = (row[emailHeader] ?? "").toString().toLowerCase();
            if (v && emailsToRemove.has(v)) return false;
            return true;
          }
          // Fallback: check every cell in the row for any email that matches
          for (const v of Object.values(row)) {
            if (!v) continue;
            const matches = v.toString().toLowerCase().match(EMAIL_VALUE_REGEX);
            if (matches && matches.some((m) => emailsToRemove.has(m))) {
              return false;
            }
          }
          return true;
        });

        setCleanedData(filtered);
        setIsCleaning(false);
      }
    }, 40);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(cleanedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = originalFileName
      ? `${originalFileName}_cleaned.csv`
      : "cleaned_data.csv";
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    const before = csvData.length || parseText(originalText).length;
    const after = cleanedData.length;
    const removed = before > 0 && after >= 0 ? before - after : 0;
    return { before, after, removed };
  }, [csvData.length, cleanedData.length, originalText]);

  return (
    <Container>
      <AutomationHeader />
      <div>
        {/* ORIGINAL DATA */}
        <label className="block mt-6 mb-2 font-medium">
          Paste Original data from the CSV File
        </label>
        <textarea
          placeholder={`email,first_name,last_name\njohn@acme.com,John,Doe\njane@acme.com,Jane,Doe`}
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          rows={7}
          className="w-full mb-4 rounded-[1.4rem] border-2 border-color bg-white text-black outline-none p-6 placeholder:text-gray-400"
        />

        {/* EMAILS TO REMOVE */}
        <label className="block mb-2 font-medium">
          Paste Emails to remove (can be a list or any multi‑column text
          containing emails):
        </label>
        <textarea
          placeholder={`john@acme.com\nfoo@example.org\nor paste a CSV column that contains emails`}
          value={removeText}
          onChange={(e) => setRemoveText(e.target.value)}
          rows={8}
          className="w-full mb-6 rounded-[1.4rem] bg-white border-2 border-color text-black outline-none p-6 placeholder:text-gray-400"
        />

        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={handleCleanData}
            disabled={
              originalText.trim() === "" ||
              removeText.trim() === "" ||
              isCleaning
            }
            className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto ${
              originalText.trim() === "" ||
              removeText.trim() === "" ||
              isCleaning
                ? "bg-gray-slight text-gray-500 cursor-not-allowed"
                : "active align-middle gap-3 flex rounded-full"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>

            {isCleaning ? "Cleaning..." : "Clean Data"}
          </button>

          {isCleaning && (
            <span className="text-sm text-gray-600">{progress}% complete</span>
          )}

          {cleanedData.length > 0 && !isCleaning && (
            <button
              onClick={handleDownload}
              className="active align-middle gap-3 flex rounded-full"
            >
              Download Cleaned CSV
            </button>
          )}

          {cleanedData.length > 0 && (
            <span className="text-sm text-gray-700">
              Removed <b>{stats.removed}</b> of <b>{stats.before}</b> rows. Kept{" "}
              <b>{stats.after}</b>.
            </span>
          )}
        </div>
      </div>
    </Container>
  );
}
