"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PortfolioPage() {
  const projects = [
    {
      title: "Contro Bot",
      description: "An advanced Discord bot developed during the pandemic.",
      image: "/images/contro.png",
    },
    {
      title: "Ligroup",
      description: "A full-stack web project exploring new horizons.",
      image: "/images/ligroup.png",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      <Header showHomeLink={true}/>

      <main className="flex flex-col items-center w-full max-w-3xl mx-auto flex-1 px-4 mt-12">
        {/* Sayfa Başlığı */}
        <h1 className="text-3xl font-bold text-[#e8c547] mb-8 text-center">
          Portfolio
        </h1>

        {/* Proje Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-[#2e3d29] border border-[#3e503e] rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold text-[#e8c547] mb-2">
                  {project.title}
                </h2>
                <p className="text-sm text-[#d1d5db]">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
