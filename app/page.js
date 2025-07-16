"use client"
import Image from "next/image";
import DeleteLeads from "./DeleteLeads/page";
import Link from "next/link";
import Footer from "./footer"
import Header from "./header"

export default function Home() {
  return (

    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header />
      
      <main className="flex flex-col gap-[32px] row-start-2 w-md">
 <Link href="/DeleteLeads" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
          
          Start Cleaning
        </Link>
        <Link href="/RemoveDuplicates" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
          
          Remove Duplicate Email
        </Link>
      </main>

      <Footer />
    </div>
  );
}
