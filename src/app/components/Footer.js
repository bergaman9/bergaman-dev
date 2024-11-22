"use client";

import dynamic from "next/dynamic";

const FaGithub = dynamic(() => import("react-icons/fa").then((mod) => mod.FaGithub), { ssr: false });
const FaLinkedin = dynamic(() => import("react-icons/fa").then((mod) => mod.FaLinkedin), { ssr: false });
const FaEnvelope = dynamic(() => import("react-icons/fa").then((mod) => mod.FaEnvelope), { ssr: false });
const FaMedium = dynamic(() => import("react-icons/fa").then((mod) => mod.FaMedium), { ssr: false });

export default function Footer() {
  return (
    <footer className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6 py-8 px-6 text-center">
      <div className="flex gap-6 justify-center">
        <a
          href="https://github.com/bergaman9"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#e8c547] text-2xl"
        >
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com/in/omerguler"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#e8c547] text-2xl"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://medium.com/@bergaman9"
          className="hover:text-[#e8c547] text-2xl"
        >
          <FaMedium />
        </a>
        <a
          href="mailto:omerguler53@gmail.com"
          className="hover:text-[#e8c547] text-2xl"
        >
          <FaEnvelope />
        </a>
      </div>

      <div className="mt-4 text-xs text-[#c4c4a8]">
      "Crafting technology inspired by the strength and wisdom of a dragon."
        </div>
    </footer>
  );
}
