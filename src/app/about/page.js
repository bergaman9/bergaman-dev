"use client";

import Head from 'next/head';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImageModal from "../components/ImageModal";
import Image from 'next/image';
import { useState } from 'react';

// Skill Categories Data
const skillCategories = [
  {
    title: "Frontend Development",
    icon: "fas fa-laptop-code",
    skills: [
      { name: "React/Next.js", level: 90 },
      { name: "JavaScript/TypeScript", level: 85 },
      { name: "HTML/CSS", level: 95 },
      { name: "Tailwind CSS", level: 88 }
    ]
  },
  {
    title: "Backend & Desktop",
    icon: "fas fa-server",
    skills: [
      { name: "Node.js", level: 80 },
      { name: "Python", level: 90 },
      { name: "C# / WPF", level: 85 },
      { name: "Database Design", level: 75 }
    ]
  },
  {
    title: "AI & Development Tools",
    icon: "fas fa-brain",
    skills: [
      { name: "AI-Powered Development", level: 85 },
      { name: "VS Code / Cursor", level: 95 },
      { name: "Machine Learning", level: 70 },
      { name: "Blockchain", level: 65 }
    ]
  },
  {
    title: "Hardware & IoT",
    icon: "fas fa-microchip",
    skills: [
      { name: "Arduino/ESP32", level: 80 },
      { name: "Circuit Design", level: 75 },
      { name: "Soldering", level: 85 },
      { name: "IoT Systems", level: 78 }
    ]
  }
];

// Experience Data
const experiences = [
  {
    title: "AI-Powered Software Developer",
    company: "Bergasoft & Personal Projects",
    period: "2023 - Present",
    description: "Developing AI-powered software solutions using modern development tools like VS Code and Cursor. Currently working on Bergasoft updates and MyToolSuite - a comprehensive C# WPF application.",
    technologies: ["C#", "WPF", "AI Tools", "VS Code", "Cursor"]
  },
  {
    title: "Full Stack Developer",
    company: "Freelance",
    period: "2022 - Present",
    description: "Developing modern web applications and Discord bots for various clients. Specializing in React, Next.js, and Python-based solutions with AI integration.",
    technologies: ["React", "Next.js", "Python", "Discord.py", "AI APIs"]
  },
  {
    title: "IoT & Hardware Developer",
    company: "Personal Projects",
    period: "2021 - Present",
    description: "Creating innovative IoT solutions using Arduino and ESP32. Focus on sensor integration, data logging, automation systems, and electric vehicle projects.",
    technologies: ["Arduino", "ESP32", "C++", "IoT", "Sensors", "EV Tech"]
  },
  {
    title: "Electrical Engineering Student",
    company: "University",
    period: "2019 - 2023",
    description: "Studied Electrical and Electronics Engineering with focus on mathematics, circuit design, and problem-solving. Transitioned to software development during studies.",
    technologies: ["Mathematics", "Circuit Design", "Problem Solving", "Engineering"]
  }
];

// Interests Data
const interests = [
  {
    title: "Artificial Intelligence",
    description: "Exploring machine learning, deep learning, and AI applications in real-world scenarios.",
    icon: "fas fa-robot"
  },
  {
    title: "Web Development",
    description: "Building modern, responsive web applications with cutting-edge technologies.",
    icon: "fas fa-globe"
  },
  {
    title: "IoT & Embedded",
    description: "Creating smart devices and automation systems with Arduino and Raspberry Pi.",
    icon: "fas fa-microchip"
  },
  {
    title: "Gaming",
    description: "Passionate gamer who enjoys exploring virtual worlds and game development concepts.",
    icon: "fas fa-gamepad"
  },
  {
    title: "Photography",
    description: "Capturing moments and exploring the world through the lens of creativity.",
    icon: "fas fa-camera"
  },
  {
    title: "Music",
    description: "Enjoying various music genres and exploring the intersection of technology and music.",
    icon: "fas fa-music"
  }
];

export default function About() {
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (imageSrc, imageAlt) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  return (
    <div className="min-h-screen text-[#d1d5db] page-container">
      <Head>
        <title>About Me - Bergaman | Full Stack Developer & Tech Enthusiast</title>
        <meta name="description" content="Learn more about Bergaman - a passionate full stack developer specializing in modern web technologies, AI integration, and innovative digital solutions." />
        <meta name="keywords" content="about bergaman, full stack developer, web developer, AI developer, tech enthusiast, biography" />
        <meta property="og:title" content="About Me - Bergaman | Full Stack Developer" />
        <meta property="og:description" content="Learn more about Bergaman - a passionate full stack developer specializing in modern web technologies." />
        <meta property="og:url" content="https://bergaman.dev/about" />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Me - Bergaman | Full Stack Developer" />
        <meta name="twitter:description" content="Learn more about Bergaman - a passionate full stack developer specializing in modern web technologies." />
        <link rel="canonical" href="https://bergaman.dev/about" />
      </Head>

      <Header />

      <main className="page-content py-8">
        
        {/* Hero Section */}
        <section className="text-center mb-16 fade-in">
          <div className="relative mb-8">
            <Image
              className="rounded-full border-4 border-[#e8c547] shadow-lg shadow-[#e8c547]/25 hover-scale mx-auto cursor-pointer"
              src="/images/profile.png"
              alt="Bergaman Profile Picture"
              width={200}
              height={200}
              priority
              onClick={() => openModal("/images/profile.png", "Bergaman Profile Picture")}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            About Me
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Passionate Full Stack Developer & Tech Enthusiast
          </p>
        </section>

        {/* Introduction */}
        <section className="mb-16 slide-in-left">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01]">
            <h2 className="text-3xl font-bold gradient-text mb-6">
              Who Am I?
            </h2>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                Hi, I'm <span className="text-[#e8c547] font-semibold">Omer</span>! My journey in the tech world began with a passion for video games, which sparked my curiosity about computers. This early interest led me to pursue a degree in <span className="text-[#e8c547] font-semibold">Electrical and Electronics Engineering</span>. However, during my studies, I realized that the future and opportunities were shifting toward software. So, I took the initiative to teach myself programming and started developing my skills in the field of software engineering.
              </p>
              <p>
                Today, I specialize in <span className="text-[#e8c547] font-semibold">full-stack development, artificial intelligence, and blockchain technologies</span>. I'm a constant learner, always exploring new domains and seeking innovative ways to apply my knowledge. My journey is one of continual improvement, always challenging myself with new, impactful projects to work on.
              </p>
              <p>
                In addition to my technical skills, I have a strong foundation in <span className="text-[#e8c547] font-semibold">mathematics</span> that helps me solve complex problems effectively. I also enjoy working with my hands, honing skills like <span className="text-[#e8c547] font-semibold">soldering and mechanical repairs</span>, and have a growing interest in the <span className="text-[#e8c547] font-semibold">Internet of Things (IoT) and electric vehicles</span>. I am always eager to learn and improve, not just in my technical skills but in my personal growth as well.
              </p>
              <p>
                Outside of tech, I enjoy a variety of hobbies including <span className="text-[#e8c547] font-semibold">fitness, gaming, movies, and connecting with nature</span>. I'm also an active community leader on Discord, where I engage in discussions related to gaming and engineering, eager to share insights and collaborate with others.
              </p>
              <p>
                I'm excited to contribute to the ever-evolving world of technology, building the future while adapting to the continuous advancements in the digital world. I develop <span className="text-[#e8c547] font-semibold">AI-powered software solutions</span> and am currently working on exciting projects like <span className="text-[#e8c547] font-semibold">Bergasoft updates</span> and <span className="text-[#e8c547] font-semibold">MyToolSuite</span> - a comprehensive C# WPF application.
              </p>
            </div>
          </div>
        </section>

        {/* Skills & Expertise */}
        <section className="mb-16 slide-in-right">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01]">
            <h2 className="text-3xl font-bold gradient-text mb-8">
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillCategories.map((category, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#e8c547] flex items-center">
                    <i className={`${category.icon} mr-2`}></i>
                    {category.title}
                  </h3>
                  <div className="space-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">{skill.name}</span>
                          <span className="text-[#e8c547] text-sm">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-[#0e1b12] rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#e8c547] to-[#d4b445] h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="mb-16 fade-in">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01]">
            <h2 className="text-3xl font-bold gradient-text mb-8">
              Experience & Journey
            </h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-[#3e503e]">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-[#e8c547] rounded-full"></div>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-xl font-semibold gradient-text">{exp.title}</h3>
                      <span className="text-sm text-gray-400">{exp.period}</span>
                    </div>
                    <p className="text-[#e8c547] font-medium">{exp.company}</p>
                    <p className="text-gray-300">{exp.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-[#0e1b12] border border-[#3e503e] rounded-full text-xs text-[#e8c547]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interests & Hobbies */}
        <section className="mb-16 slide-in-left">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01]">
            <h2 className="text-3xl font-bold gradient-text mb-8">
              Interests & Hobbies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interests.map((interest, index) => (
                <div
                  key={index}
                  className="border border-[#3e503e] p-6 rounded-lg bg-[#0e1b12] text-center card-hover group"
                >
                  <i className={`${interest.icon} text-4xl text-[#e8c547] mb-4 group-hover:scale-110 transition-transform duration-300`}></i>
                  <h3 className="text-lg font-semibold gradient-text mb-2">{interest.title}</h3>
                  <p className="text-gray-300 text-sm">{interest.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



      </main>

      <Footer />

      {/* Image Modal */}
      <ImageModal
        src={modalImage?.src}
        alt={modalImage?.alt}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
