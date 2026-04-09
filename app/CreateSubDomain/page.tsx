"use client";

import { useState } from "react";
import Container from "../Components/Container";
import AutomationHeader from "../Components/AutomationHeader";

export default function SubdomainGenerator() {
  const [count, setCount] = useState(4);
  const [names, setNames] = useState(`
top
elite
prime
ultimate
superior
premium
select
finest
leading
max
expert
advanced
master
specialist
savings 
proline
promax
authority
certified
skilled
proplus
advantage
gain
value
perk
reward
profit
boost
edge
analyze
`);
  const [domains, setDomains] = useState(
    "1stdomain.com\n2nddomain.com\n3rddomain.com",
  );
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const nameList = names
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean)
      .slice(0, count);

    const domainList = domains
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    let result = [];

    domainList.forEach((domain) => {
      nameList.forEach((name) => {
        result.push(`${name}.${domain}`);
      });
    });

    setOutput(result.join("\n"));
    setCopied(false);
  };

  const copyAll = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <Container>
      <AutomationHeader />
      <main
        style={{
          padding: "20px",
          background: "#fff",
          minHeight: "100vh",
        }}
      >
        {/* Count Input */}
        <div className="mt-6 flex gap-4 items-center">
          <label className="pt-[20px] text-xl text-black">
            Number of subdomains per domain
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="bg-white outline-none border-2 border-color p-4 rounded-[1.4rem] mt-6"
          />
        </div>

        {/* Names */}
        <div className="mt-4">
          <label className="pt-[20px] text-lg text-black">
            Subdomain Names (one per line)
          </label>
          <textarea
            value={names}
            onChange={(e) => setNames(e.target.value)}
            rows={6}
            className="bg-white outline-none border-2 border-color w-full p-6 rounded-[1.4rem] mt-6"
          />
        </div>

        {/* Domains */}
        <div className="mt-4">
          <label className="pt-[20px] text-lg text-black">
            Domains (one per line)
          </label>
          <textarea
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
            rows={6}
            className="bg-white outline-none border-2 border-color w-full p-6 rounded-[1.4rem] mt-6"
          />
        </div>

        <div className="flex gap-4">
          {/* Generate Button */}
          <button
            onClick={generate}
            className="cursor-pointer active rounded-full mt-4"
          >
            Generate
          </button>

          {/* Output */}

          <button
            onClick={copyAll}
            className="cursor-pointer active rounded-full mt-4"
          >
            {copied ? "Copied!" : "Copy All"}
          </button>
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
            {output}
          </pre>
        </div>
      </main>
    </Container>
  );
}
