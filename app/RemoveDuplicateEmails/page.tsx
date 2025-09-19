"use client";

import { useState } from "react";
import Container from "../Components/Container";
import AutomationHeader from "../Components/AutomationHeader";

export default function RemoveDuplicateEmails() {
  const [emailInput, setEmailInput] = useState("");
  const [cleanedEmails, setCleanedEmails] = useState([]);

  const handleCleanEmails = () => {
    const emailArray = emailInput
      .split("\n")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email !== "");

    const uniqueEmails = Array.from(new Set(emailArray));
    setCleanedEmails(uniqueEmails);
  };

  return (
    <Container>
      <AutomationHeader />
      <div>
        <h1 className="text-2xl pt-[2rem] pb-4">Remove Duplicate Emails</h1>

        <div className="flex gap-4 items-center justify-start">
          <textarea
            rows={7}
            className="w-full bg-white border-2 border-color text-black outline-none p-6 rounded-[1.4rem]"
            placeholder="Paste your emails here, one per line..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            className="bg-gray-600 text-white pb-4 active rounded-full"
            onClick={handleCleanEmails}
          >
            Remove Duplicates
          </button>
        </div>

        {cleanedEmails.length > 0 && (
          <h1 className="text-2xl pb-[1rem] mt-[2rem]">Unique Emails</h1>
        )}

        {cleanedEmails.length > 0 && (
          <div className="">
            <pre className="w-full rounded bg-white border-2 border-color text-black outline-none p-6 placeholder:text-gray-400 overflow-y-auto">
              {cleanedEmails.join("\n")}
            </pre>
          </div>
        )}
      </div>
    </Container>
  );
}
