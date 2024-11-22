"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header({ showHomeLink = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menü açma/kapama durumu

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full max-w-3xl mx-auto flex justify-between items-center pb-6 border-b border-[#2a2e43] px-4 mt-12 relative">
      {/* Bergaman Başlığı Sol Tarafta */}
      <Link href="/" className="text-3xl font-extrabold text-[#e8c547] hover:text-[#c0a036] transition-colors">
        Bergaman
      </Link>

      {/* Hamburger Icon (Mobile) Sağda */}
      <button 
        className="sm:hidden text-[#e8c547] hover:text-[#c0a036] transition-colors absolute top-4 right-4 z-10 w-8 h-8"
        onClick={toggleMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Mobile Menu (for smaller screens) */}
      <div 
        className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-16 left-0 right-0 bg-[#2a3b22] p-6 bg-opacity-80`}>
        <nav className="flex flex-col items-center gap-4 text-lg">
          <Link href="/" className="text-[#e8c547] hover:text-[#00c8ff] hover:underline transition-colors py-2">
            Home
          </Link>
          <Link href="/about" className="text-[#e8c547] hover:text-[#00c8ff] hover:underline transition-colors py-2">
            About
          </Link>
          <Link href="/portfolio" className="text-[#e8c547] hover:text-[#00c8ff] hover:underline transition-colors py-2">
            Portfolio
          </Link>
          <Link href="/suggestions" className="text-[#e8c547] hover:text-[#00c8ff] hover:underline transition-colors py-2">
            Suggestions
          </Link>
          <Link href="/blog" className="text-[#e8c547] hover:text-[#00c8ff] hover:underline transition-colors py-2">
            Blog
          </Link>
        </nav>
      </div>

      {/* Desktop Menu (for larger screens) */}
      <nav className="hidden sm:flex gap-6 text-lg">
        {showHomeLink && (
          <Link href="/" className="text-[#e8c547] hover:text-[#00c8ff] hover:underline transition-colors">
            Home
          </Link>
        )}
        <Link href="/about" className="text-[#e8c547] hover:text-[#00c8ff] hover:underline transition-colors">
          About
        </Link>
        <Link href="/portfolio" className="text-[#e8c547] hover:text-[#00c8ff] hover:underline transition-colors">
          Portfolio
        </Link>
        <Link href="/suggestions" className="text-[#e8c547] hover:text-[#00c8ff] hover:underline transition-colors">
          Suggestions
        </Link>
        <Link href="/blog" className="text-[#e8c547] hover:text-[#00c8ff] hover:underline transition-colors">
          Blog
        </Link>
      </nav>
    </header>
  );
}
