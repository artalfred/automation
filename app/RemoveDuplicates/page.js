'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';

export default function RemoveDuplicateEmails() {
  const [emailInput, setEmailInput] = useState('');
  const [cleanedEmails, setCleanedEmails] = useState([]);

  const handleCleanEmails = () => {
    const emailArray = emailInput
      .split('\n')
      .map(email => email.trim().toLowerCase())
      .filter(email => email !== '');

    const uniqueEmails = Array.from(new Set(emailArray));
    setCleanedEmails(uniqueEmails);
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(uniqueEmails.map(email => ({ Email: email })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'unique_emails.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:w-full md:w-full lg:w-4xl xl:w-5xl 2xl:w-5xl mx-auto pb-[4rem]">
      <Link href="/">
        <div className="flex items-center gap-4 justify-center pb-[2rem]">
          <h1 className="text-5xl pb-[1rem] pt-[2rem]">Automation</h1>
        </div>
      </Link>

        <div className='flex items-center justify-between'>

        <h1 className="text-2xl pb-[1rem]">Remove Duplicate Emails</h1>
        </div>

    <div className='flex gap-4 items-center justify-start'>
      <textarea
        rows={10}
        className="w-full bg-black p-6 rounded outline-none"
        placeholder="Paste your emails here, one per line..."
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded-full"
          onClick={handleCleanEmails}
        >
          Remove Duplicates
        </button>

        {/* {cleanedEmails.length > 0 && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleDownloadCSV}
          >
            Download CSV
          </button>
        )} */}
        
      </div>

       {cleanedEmails.length > 0 && (
            <h1 className="text-2xl pb-[1rem] mt-[2rem]">Unique Emails</h1>
        )}

      {cleanedEmails.length > 0 && (
          <div className="">
          <pre className="bg-black p-2 rounded max-h-60 overflow-y-auto">
            {cleanedEmails.join('\n')}
          </pre>
        </div>
      )}

      
    </div>
  );
}
