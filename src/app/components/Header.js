"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full max-w-3xl mx-auto flex justify-between items-center pb-6 border-b border-[#2a2e43] px-4 mt-12">
      <Link href="/" className="text-3xl font-extrabold text-[#e8c547] hover:text-[#c0a036] transition-colors">
    Bergaman
      </Link>
      <nav className="flex gap-6 text-lg">
        <Link href="/about" className="hover:text-[#e8c547] transition-colors">
          About
        </Link>
        <Link href="/portfolio" className="hover:text-[#e8c547] transition-colors">
          Portfolio
        </Link>
        <Link href="/suggestions" className="hover:text-[#e8c547] transition-colors">
          Suggestions
        </Link>
        <Link href="/blog" className="hover:text-[#e8c547] transition-colors">
          Blog
        </Link>
      </nav>
    </header>
  );
}
