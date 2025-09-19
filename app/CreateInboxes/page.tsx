"use client";

import { useMemo, useState } from "react";
import Header from "../header";
import Container from "../Components/Container";
import AutomationHeader from "../Components/AutomationHeader";

function cleanLine(s: string) {
  // trim, collapse spaces, keep dots in names, lowercase
  return s.trim().replace(/\s+/g, "").toLowerCase();
}

function parseLines(s: string) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function Page() {
  const [namesInput, setNamesInput] = useState(`Abigail.foster
Harper.collins
Ella.hayes
Scarlett.james`);
  const [domainsInput, setDomainsInput] = useState(`accessboostyourbenefits.org
accesspurelycovered.org
accesstotalbenefitsnow.org`);

  const emails = useMemo(() => {
    const rawNames = parseLines(namesInput);
    const rawDomains = parseLines(domainsInput);

    const names = rawNames.map(cleanLine);
    const domains = rawDomains.map((d) => cleanLine(d).replace(/^@/, ""));

    const out: string[] = [];
    for (const domain of domains) {
      for (const name of names) {
        // basic guard: ensure looks like "x.y" or "word"
        const local = name.replace(/[^a-z0-9._-]/g, "");
        if (!local || !domain) continue;
        out.push(`${local}@${domain}`);
      }
    }
    return out;
  }, [namesInput, domainsInput]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(emails.join("\n"));
    alert("Emails copied to clipboard.");
  };

  const downloadCSV = () => {
    const rows = emails.map((e) => [e]);
    const csv = ["email", ...rows.map((r) => r.join(",")).join("\n")].join(
      "\n"
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emails.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <AutomationHeader />
      <main>
        <h1 className="pt-[20px] text-2xl">Bulk Email Generator</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          Paste names (one per line) and domains (one per line). We'll generate{" "}
          <i>name@domain</i> for all combinations.
        </p>

        <div
          style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}
        >
          <div className="grid gap-4">
            <label className="font-regular">Names (one per line)</label>
            <textarea
              value={namesInput}
              onChange={(e) => setNamesInput(e.target.value)}
              placeholder={`Abigail.foster\nHarper.collins\nElla.hayes\nScarlett.james`}
              rows={10}
              className="bg-white outline-none border-2 border-color w-full p-6 rounded-[1.4rem]"
            />
            <small style={{ color: "#666" }}>
              Tip: Use <b>First.last</b> (e.g., <code>Harper.collins</code>).
              We'll lowercase and remove spaces automatically.
            </small>
          </div>

          <div className="grid gap-4">
            <label className="font-regular">Domains (one per line)</label>
            <textarea
              value={domainsInput}
              onChange={(e) => setDomainsInput(e.target.value)}
              placeholder={`accessboostyourbenefits.org\naccesspurelycovered.org\naccesstotalbenefitsnow.org`}
              rows={10}
              className="bg-white outline-none border-2 border-color placeholder:text-gray-400 w-full p-6 rounded-[1.4rem]"
            />
            <small style={{ color: "#666" }}>
              Don't include <code>http://</code> or <code>@</code> — just the
              domain (e.g., <code>example.org</code>).
            </small>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <button onClick={copyAll} className="active rounded-full">
            Copy All
          </button>
          <div style={{ color: "#555" }}>
            Generated: <b>{emails.length}</b> emails
          </div>
        </div>

        <div
          className="bg-white outline-none border-2 border-color placeholder:text-gray-400 w-full p-6 rounded-[1.4rem]"
          style={{
            marginTop: 20,
          }}
        >
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {emails.join("\n")}
          </pre>
        </div>
      </main>
    </Container>
  );
}
