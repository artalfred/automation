"use client"
import Image from "next/image";
import DeleteLeads from "./DeleteLeads/page";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2">

<div className="flex gap-4">
        <h1 className="text-5xl">Automation</h1>
        <h6 className="text-l mt-6">By Art Alfred</h6>
</div>
 <Link href="/DeleteLeads" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
          
          Start Cleaning
        </Link>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        © Copyright 2025 Art Alfred - All Right Reserved
      </footer>
    </div>
  );
}
