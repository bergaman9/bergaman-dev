"use client";

import Link from "next/link";  // Link importu
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react"; // useState importu
import ImageViewer from "react-simple-image-viewer"; // ImageViewer importu

export default function PortfolioPage() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const projects = [
    {
      title: "Teknominatör",
      description: "A technology and science blog built with WordPress, featuring the latest news and updates.",
      image: "/images/teknominator.png",
      link: "https://teknominator.com/", 
      techStack: ["WordPress", "PHP", "MySQL", "CSS", "JavaScript"], // Tech stack güncellendi
      date: "2022-2024", // Add date property
    },
    {
      title: "Ligroup",
      description: "A social media directory application built with EJS and Express.",
      image: "/images/ligroup.png",
      link: "https://ligroup.herokuapp.com/", 
      techStack: ["EJS", "Express", "Node.js", "MongoDB"], // Tech stack güncellendi
      date: "2022", // Add date property
    },
    {
      title: "Contro Dashboard",
      description: "A dashboard application built with Flask and HTML/CSS.",
      image: "/images/contro-dashboard.png",
      link: "https://contro.space/",
      techStack: ["Python", "Flask", "HTML", "CSS", "JavaScript"], // Tech stack güncellendi
      date: "2025-present", // Add date property
    },
  ];

  const discordBots = [
    {
      title: "Contro Bot",
      description: "An advanced Discord bot developed during the pandemic.",
      image: "/images/contro.png",
      link: "https://github.com/bergaman9/contro-bot",
      techStack: ["Python", "Discord.py", "MongoDB"],
      date: "2021-present", // Add date property
    },
    {
      title: "Timekeepers Bot",
      description: "A ticket bot for game coin sales.",
      image: "/images/timekeepers.png",
      link: "https://github.com/bergaman9/timekeepers-bot",
      techStack: ["Python", "Discord.py", "MongoDB"],
      date: "2024-present", // Add date property
    },
    // Add more bots here as needed
  ];

  const openImageViewer = (src) => {
    setCurrentImage(src);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setCurrentImage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      <Header showHomeLink={true}/>

      <main className="flex flex-col items-center w-full max-w-3xl mx-auto flex-1 px-4 mt-12">
        {/* Sayfa Başlığı */}
        <h1 className="text-3xl font-bold text-[#e8c547] mb-8 text-center">
          Portfolio
        </h1>

        {/* Proje Kartları */}
        <div className={`grid grid-cols-1 ${projects.length > 1 ? 'sm:grid-cols-2' : ''} gap-6 w-full`}>
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-[#2e3d29] border border-[#3e503e] rounded-lg overflow-hidden shadow-lg relative"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 object-cover cursor-pointer"
                style={{ objectFit: 'cover', height: 'auto', aspectRatio: '16/9' }} // Adjust image styling
                onClick={() => openImageViewer(project.image)}
              />
              <div className="p-4">
                {/* Proje başlığını Link etiketiyle sardım */}
                <h2 className="text-lg font-bold text-[#e8c547] mb-2 flex justify-between items-center">
                  <Link href={project.link} className="hover:text-[#00c8ff] transition-colors">
                    {project.title}
                  </Link>
                  {/* Date Bölümü */}
                  <span className="text-sm text-[#d1d5db] italic">{project.date}</span>
                </h2>
                <p className="text-sm text-[#d1d5db]">{project.description}</p>
                {/* Tech Stack Bölümü */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techStack.map((tech, techIndex) => (
                    <span key={techIndex} className="border border-[#e8c547] px-2 py-1 rounded text-sm text-[#e8c547] bg-[#2e3d29]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Discord Bots Genel Kartı */}
          <div className={`bg-[#2e3d29] border border-[#3e503e] rounded-lg overflow-hidden shadow-lg w-full ${projects.length > 1 ? 'sm:col-span-2' : ''}`}>
            <div className="p-4">
              <h2 className="text-lg font-bold text-[#e8c547] mb-2">
                Discord Bots
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {discordBots.map((bot, index) => (
                  <div
                    key={index}
                    className="bg-[#2e3d29] border border-[#3e503e] rounded-lg overflow-hidden shadow-lg relative"
                  >
                    <img
                      src={bot.image}
                      alt={bot.title}
                      className="w-full h-40 object-cover cursor-pointer"
                      style={{ objectFit: 'cover', height: 'auto', aspectRatio: '16/9' }} // Adjust image styling
                      onClick={() => openImageViewer(bot.image)}
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-bold text-[#e8c547] mb-2 flex justify-between items-center">
                        <Link href={bot.link} className="hover:text-[#00c8ff] transition-colors">
                          {bot.title}
                        </Link>
                        {/* Date Bölümü */}
                        <span className="text-sm text-[#d1d5db] italic">{bot.date}</span>
                      </h2>
                      <p className="text-sm text-[#d1d5db]">{bot.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {bot.techStack.map((tech, techIndex) => (
                          <span key={techIndex} className="border border-[#e8c547] px-2 py-1 rounded text-sm text-[#e8c547] bg-[#2e3d29]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {isViewerOpen && (
        <ImageViewer
          src={[currentImage]}
          currentIndex={0}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)"
          }}
          className="rounded-lg" // Add this line to apply rounded corners
        />
      )}

      <Footer />
    </div>
  );
}
