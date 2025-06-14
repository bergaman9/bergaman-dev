"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2e3d29]/30 backdrop-blur-md border-b border-[#3e503e]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-300">
            Bergaman
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 hover:scale-105 transform flex items-center space-x-2">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
            <Link href="/about" className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 hover:scale-105 transform flex items-center space-x-2">
              <i className="fas fa-user"></i>
              <span>About</span>
            </Link>
            <Link href="/portfolio" className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 hover:scale-105 transform flex items-center space-x-2">
              <i className="fas fa-briefcase"></i>
              <span>Portfolio</span>
            </Link>
            <Link href="/suggestions" className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 hover:scale-105 transform flex items-center space-x-2">
              <i className="fas fa-lightbulb"></i>
              <span>Suggestions</span>
            </Link>
            <Link href="/blog" className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 hover:scale-105 transform flex items-center space-x-2">
              <i className="fas fa-blog"></i>
              <span>Blog</span>
            </Link>
          </nav>



          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-[#3e503e] pt-4">
                         <div className="flex flex-col space-y-4">
               <Link 
                 href="/" 
                 className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 flex items-center space-x-2"
                 onClick={() => setIsMenuOpen(false)}
               >
                 <i className="fas fa-home"></i>
                 <span>Home</span>
               </Link>
               <Link 
                 href="/about" 
                 className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 flex items-center space-x-2"
                 onClick={() => setIsMenuOpen(false)}
               >
                 <i className="fas fa-user"></i>
                 <span>About</span>
               </Link>
               <Link 
                 href="/portfolio" 
                 className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 flex items-center space-x-2"
                 onClick={() => setIsMenuOpen(false)}
               >
                 <i className="fas fa-briefcase"></i>
                 <span>Portfolio</span>
               </Link>
               <Link 
                 href="/suggestions" 
                 className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 flex items-center space-x-2"
                 onClick={() => setIsMenuOpen(false)}
               >
                 <i className="fas fa-lightbulb"></i>
                 <span>Suggestions</span>
               </Link>
               <Link 
                 href="/blog" 
                 className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 flex items-center space-x-2"
                 onClick={() => setIsMenuOpen(false)}
               >
                 <i className="fas fa-blog"></i>
                 <span>Blog</span>
               </Link>
              
                             {/* Mobile Social Links */}
               <div className="flex space-x-6 pt-4 border-t border-[#3e503e]">
                 <a
                   href="https://github.com/bergaman9"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300"
                   aria-label="GitHub"
                 >
                   <i className="fab fa-github text-xl"></i>
                 </a>
                 <a
                   href="https://linkedin.com/in/bergaman"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300"
                   aria-label="LinkedIn"
                 >
                   <i className="fab fa-linkedin text-xl"></i>
                 </a>
                 <a
                   href="mailto:contact@bergaman.dev"
                   className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300"
                   aria-label="Email"
                 >
                   <i className="fas fa-envelope text-xl"></i>
                 </a>
               </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
