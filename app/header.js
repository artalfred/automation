import Link from "next/link"

export default function Header() {
  return (
<div className="flex gap-4">
        <Link href="/">
        <div className="flex items-center gap-4">
            <h1 className="text-5xl">Automation</h1>
            <h6 className="text-l mt-6">By Art Alfred</h6>
        </div>
        </Link>
        </div>
  );
}