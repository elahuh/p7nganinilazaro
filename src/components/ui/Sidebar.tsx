"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>
        <Link href="/profile" className="hover:text-gray-300">
          Profile
        </Link>
        <Link href="/settings" className="hover:text-gray-300">
          Settings
        </Link>
      </nav>
    </aside>
  );
}
