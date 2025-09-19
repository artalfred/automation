"use client";
import Link from "next/link";
import Star from "../public/Images/star.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div>
      <Link href="/">
        <div className="pb-7 flex gap-3 border-b-2">
          <Image src={Star} alt="Primary--Logo" height={26} />
          <h1 className="text-center text-[#060318] text-2xl font-medium">
            Menu
          </h1>
        </div>
      </Link>

      <div className="mt-[2rem]">
        <div className="text-center">
          <div className="grid gap-3">
            <Link
              href="/"
              className={
                pathname === "/"
                  ? "active align-middle gap-3 flex rounded-full"
                  : "flex align-middle gap-3 nav-link rounded-full"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={pathname === "/" ? "#fff" : "#222"}
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Home
            </Link>
            <Link
              href="/Cityniches"
              className={
                pathname === "/Cityniches"
                  ? "active align-middle gap-3 flex rounded-full"
                  : "flex align-middle gap-3 nav-link rounded-full"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke={pathname === "/Cityniches" ? "#fff" : "#222"}
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>
              City Niches
            </Link>
            <Link
              href="/Automation"
              className={
                pathname === "/Automation" ||
                pathname === "/CreateInboxes" ||
                pathname === "/RemoveDuplicateEmails"
                  ? "active align-middle gap-3 flex rounded-full"
                  : "flex align-middle gap-3 nav-link rounded-full"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke={
                  pathname === "/Automation" ||
                  pathname === "/CreateInboxes" ||
                  pathname === "/RemoveDuplicateEmails"
                    ? "#fff"
                    : "#222"
                }
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                />
              </svg>
              Automation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
