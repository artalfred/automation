"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AutomationHeader() {
  const pathname = usePathname();

  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-semibold main--color">Automation</h1>

      <div className="flex gap-4">
        <Link
          href="/Automation"
          className={
            pathname === "/Automation"
              ? "nav-btn-active align-middle gap-2 flex rounded-full"
              : "flex align-middle gap-3 nav-btn rounded-full"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke={pathname === "/Automation" ? "#fff" : "#222"}
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          Remove Positive Leads
        </Link>

        <Link
          href="/CreateInboxes"
          className={
            pathname === "/CreateInboxes"
              ? "nav-btn-active align-middle gap-2 flex rounded-full"
              : "flex align-middle gap-3 nav-btn rounded-full"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke={pathname === "/CreateInboxes" ? "#fff" : "#222"}
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
          Create Inboxes
        </Link>

        <Link
          href="/RemoveDuplicateEmails"
          className={
            pathname === "/RemoveDuplicateEmails"
              ? "nav-btn-active align-middle gap-2 flex rounded-full"
              : "flex align-middle gap-3 nav-btn rounded-full"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke={pathname === "/RemoveDuplicateEmails" ? "#fff" : "#222"}
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Remove Duplicate Email
        </Link>
      </div>
    </div>
  );
}
