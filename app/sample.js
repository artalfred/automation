'use client'

import { useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [csvData, setCsvData] = useState([]);
  const [emailList, setEmailList] = useState("");
  const [cleanedData, setCleanedData] = useState([]);

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
    const emailsToRemove = emailList
      .split(/\s|,|\n/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const filtered = csvData.filter(
      (row) => !emailsToRemove.includes(row.EMAIL?.toLowerCase())
    );

    setCleanedData(filtered);
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
      <h1 className="text-4xl font-bold mb-4">CSV Email Cleaner</h1>
      <div className="flex items-center gap-4">
        <h1 className="text-5xl">Automation</h1>
        <h6 className="text-l mt-6">By Art Alfred</h6>
</div>

      <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />

      <textarea
        placeholder="Paste emails here..."
        value={emailList}
        onChange={(e) => setEmailList(e.target.value)}
        rows={10}
        className="w-full border p-2 mb-4"
      />

      <div className="flex gap-4">
        <button onClick={handleCleanData} className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
          <Image
                        className="dark:invert"
                        src="/vercel.svg"
                        alt="Vercel logomark"
                        width={20}
                        height={20}
                      />
          Clean CSV
        </button>

        {cleanedData.length > 0 && (
          <button onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded">
            Download Cleaned CSV
          </button>
        )}
      </div>
    </div>
  );
}
