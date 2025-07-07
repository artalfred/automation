"use client"
import { useState } from "react";
import Papa from "papaparse";
import Image from "next/image";
import Link from "next/link";

export default function DeleteLeads() {
  const [csvData, setCsvData] = useState([]);
  const [emailList, setEmailList] = useState("");
  const [cleanedData, setCleanedData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setCsvData(results.data);
      },
    });
  };

  const handleCleanData = () => {
    setIsCleaning(true);
    setProgress(1); // Start progress at 1%

    const emailsToRemove = emailList
      .split(/\s|,|\n/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    // Simulate progress
    let currentProgress = 1;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);

        const filtered = csvData.filter(
          (row) => !emailsToRemove.includes(row.EMAIL?.toLowerCase())
        );

        setCleanedData(filtered);
        setIsCleaning(false);
      }
    }, 50); // You can adjust the speed (ms) here
  };

  const handleDownload = () => {
    const csv = Papa.unparse(cleanedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "cleaned_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-10 font-sans">
      <Link href="/">
        <div className="flex items-center gap-4">
          <h1 className="text-5xl">Automation</h1>
          <h6 className="text-l mt-6">By Art Alfred</h6>
        </div>
      </Link>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4 bg-gray-400 mt-4 rounded-full p-4 text-center flex justify-center items-center text-white"
      />

      <textarea
        placeholder="Paste emails here to deletes..."
        value={emailList}
        onChange={(e) => setEmailList(e.target.value)}
        rows={10}
        className="w-full mb-4 rounded bg-black-500  p-[2rem] ring-2 ring-gray-500"
      />

      <div className="flex gap-4 items-center">
        <button
          onClick={handleCleanData}
          disabled={csvData.length === 0 || emailList.trim() === "" || isCleaning}
          className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto
            ${
              csvData.length === 0 || emailList.trim() === "" || isCleaning
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
            }`}
        >
          <Image
            className="dark:invert"
            src="/vercel.svg"
            alt="Vercel logomark"
            width={20}
            height={20}
          />
          {isCleaning ? "Cleaning..." : "Clean CSV"}
        </button>

        {isCleaning && (
          <span className="text-sm text-gray-600">{progress}% complete</span>
        )}

        {cleanedData.length > 0 && !isCleaning && (
          <button
            onClick={handleDownload}
            className="bg-gray-600 text-white px-4 py-2 rounded-full"
          >
            Download Cleaned CSV
          </button>
        )}
      </div>
    </div>
  );
}
