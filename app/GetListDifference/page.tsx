"use client";

import { useState } from "react";
import Container from "../Components/Container";
import AutomationHeader from "../Components/AutomationHeader";

export default function Home() {
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [output, setOutput] = useState("");

  const normalize = (text: string) => {
    return text
      .split("\n")
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e !== "");
  };

  const compareLists = () => {
    const a = normalize(listA);
    const b = new Set(normalize(listB));

    const result = a.filter((email) => !b.has(email));

    setOutput(result.join("\n"));
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert("Copied to clipboard!");
  };

  return (
    <Container>
      <AutomationHeader />
      <main
        style={{
          padding: "20px",
          background: "#fff",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        <h1 className="pt-[20px] text-2xl text-black">Get List Difference</h1>

        <textarea
          value={listA}
          onChange={(e) => setListA(e.target.value)}
          placeholder="List A (Original Emails)"
          style={{
            width: "100%",
            height: "150px",
            marginBottom: "15px",
            padding: "10px",
            color: "#000",
          }}
          className="bg-white outline-none border-2 border-color w-full p-6 rounded-[1.4rem] mt-6"
        />

        <textarea
          value={listB}
          onChange={(e) => setListB(e.target.value)}
          placeholder="List B (Emails to Remove)"
          style={{
            width: "100%",
            height: "150px",
            marginBottom: "15px",
            padding: "10px",
            color: "#000",
          }}
          className="bg-white outline-none border-2 border-color w-full p-6 rounded-[1.4rem] mt-6"
        />

        <div className="flex gap-4">
          <button
            onClick={compareLists}
            className="cursor-pointer active rounded-full"
          >
            Compare
          </button>

          <button
            onClick={copyOutput}
            className="cursor-pointer active rounded-full"
          >
            Copy All
          </button>
        </div>

        <h3 style={{ marginTop: "20px" }}>Output (A NOT in B)</h3>
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
              color: "#000",
            }}
          >
            {output}
          </pre>
        </div>
      </main>
    </Container>
  );
}
