"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import ImageModal from './components/ImageModal';
import BlogImageGenerator from './components/BlogImageGenerator';
import { useAdminMode } from '../hooks/useAdminMode';

export default function Home() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const { isAdminMode, exitEditMode } = useAdminMode();

  // Featured projects data
  const featuredProjects = [
    {
      id: 1,
      title: "Contro Bot",
      description: "A comprehensive Discord bot developed during the pandemic with advanced moderation, entertainment, and utility features. Built with Python and Discord.py.",
      image: "/images/projects/contro.png",
      tech: ["Python", "Discord.py", "SQLite", "Async Programming"],
      github: "https://github.com/bergaman9/contro-bot",
      demo: null,
      date: "2020 - 2022",
      status: "Completed"
    },
    {
      id: 2,
      title: "Ligroup",
      description: "My first full-stack web development project - a social platform for group management and communication with real-time features.",
      image: "/images/projects/ligroup.png",
      tech: ["React", "Node.js", "MongoDB", "Express", "Socket.io"],
      github: "https://github.com/bergaman9/ligroup",
      demo: null,
      date: "2022",
      status: "Completed"
    },
    {
      id: 3,
      title: "AI & ML Experiments",
      description: "Collection of experimental projects exploring RVC voice conversion, Stable Diffusion image generation, and various machine learning models.",
      image: "/images/projects/ai-projects.png",
      tech: ["Python", "TensorFlow", "PyTorch", "RVC", "Stable Diffusion"],
      github: "https://github.com/bergaman9/ai-projects",
      demo: null,
      date: "2023",
      status: "Ongoing"
    },
    {
      id: 4,
      title: "IoT Air Quality Monitor",
      description: "Real-time indoor air quality monitoring system using Arduino Uno R4 WiFi with wireless data transmission and GUI application.",
      image: "/images/projects/iaq.jpg",
      tech: ["Arduino", "C++", "IoT", "Sensors", "WiFi"],
      github: "https://github.com/bergaman9/arduino-projects",
      demo: null,
      date: "2024",
      status: "Completed"
    }
  ];

  // Skills data with categories
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        { name: "Python", level: 85, icon: "fab fa-python" },
        { name: "JavaScript", level: 80, icon: "fab fa-js-square" },
        { name: "C#", level: 70, icon: "fas fa-code" },
        { name: "C++", level: 65, icon: "fas fa-code" }
      ]
    },
    {
      title: "Web Technologies",
      skills: [
        { name: "React", level: 85, icon: "fab fa-react" },
        { name: "Next.js", level: 80, icon: "fas fa-layer-group" },
        { name: "Node.js", level: 75, icon: "fab fa-node-js" },
        { name: "HTML & CSS", level: 90, icon: "fab fa-html5" }
      ]
    },
    {
      title: "Tools & Databases",
      skills: [
        { name: "MongoDB", level: 75, icon: "fas fa-database" },
        { name: "Git", level: 85, icon: "fab fa-git-alt" },
        { name: "Docker", level: 60, icon: "fab fa-docker" },
        { name: "SQL", level: 70, icon: "fas fa-database" }
      ]
    }
  ];

  // Interests data with descriptions
  const interests = [
    { 
      name: "Artificial Intelligence", 
      icon: "fas fa-robot",
      description: "Exploring machine learning, neural networks, and AI applications"
    },
    { 
      name: "Embedded Systems", 
      icon: "fas fa-microchip",
      description: "Arduino, IoT devices, and hardware-software integration"
    },
    { 
      name: "Full Stack Development", 
      icon: "fas fa-code",
      description: "Modern web applications with React, Node.js, and databases"
    },
    { 
      name: "Cybersecurity", 
      icon: "fas fa-shield-alt",
      description: "Security protocols, ethical hacking, and system protection"
    },
    { 
      name: "Blockchain Technology", 
      icon: "fas fa-link",
      description: "Cryptocurrency, smart contracts, and decentralized systems"
    },
    { 
      name: "Robotics", 
      icon: "fas fa-cogs",
      description: "Automation, control systems, and robotic applications"
    }
  ];

  // Experience timeline
  const experiences = [
    {
      year: "2024",
      title: "Electrical & Electronics Engineering Student",
      company: "University",
      description: "Focusing on embedded systems, signal processing, and IoT applications",
      type: "education"
    },
    {
      year: "2023",
      title: "AI & ML Explorer",
      company: "Personal Projects",
      description: "Developed various AI projects including voice conversion and image generation",
      type: "project"
    },
    {
      year: "2022",
      title: "Full-Stack Developer",
      company: "Freelance",
      description: "Built web applications using modern technologies and frameworks",
      type: "work"
    },
    {
      year: "2020",
      title: "Discord Bot Developer",
      company: "Community Projects",
      description: "Created and maintained Discord bots for various communities",
      type: "project"
    }
  ];

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts?limit=3&published=true');
      const data = await response.json();
      
      if (data.posts) {
        setBlogPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (imageSrc, imageAlt) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="page-container">
      <Head>
        <title>Bergaman - The Dragon's Domain | Electrical & Electronics Engineer</title>
        <meta name="description" content="Welcome to Bergaman's digital domain. Electrical & Electronics Engineer based in İstanbul, Turkey. Explore cutting-edge technical solutions and innovative full-stack development." />
        <meta name="keywords" content="bergaman, electrical electronics engineer, istanbul, turkey, full-stack developer, web development, portfolio, dragon domain, ai, iot, embedded systems" />
        <meta property="og:title" content="Bergaman - The Dragon's Domain | Electrical & Electronics Engineer" />
        <meta property="og:description" content="Electrical & Electronics Engineer - Crafting innovative technical solutions and web applications" />
        <meta property="og:url" content="https://bergaman.dev" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bergaman - The Dragon's Domain | Electrical & Electronics Engineer" />
        <meta name="twitter:description" content="Electrical & Electronics Engineer - Crafting innovative technical solutions and web applications" />
        <link rel="canonical" href="https://bergaman.dev" />
      </Head>

      {/* Admin Edit Mode Bar */}
      {isAdminMode && (
        <div className="fixed top-0 left-0 right-0 bg-[#e8c547] text-[#0e1b12] px-4 py-2 z-50 flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-edit mr-2"></i>
            <span className="font-medium">Admin Edit Mode Active</span>
          </div>
          <button
            onClick={exitEditMode}
            className="bg-[#0e1b12] text-[#e8c547] px-3 py-1 rounded hover:bg-[#1a2a1a] transition-colors"
          >
            <i className="fas fa-times mr-1"></i>
            Exit
          </button>
        </div>
      )}

      <div className={`page-content ${isAdminMode ? 'pt-16' : ''}`}>
        {/* Hero Section */}
        <section className="text-center py-12 sm:py-16 lg:py-20 fade-in px-4 sm:px-6">
          <div className="mb-6 sm:mb-8">
            <Image
              src="/images/profile/profile.png"
              alt="Bergaman Profile"
              width={120}
              height={120}
              className="rounded-full mx-auto mb-4 sm:mb-6 w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 border-4 border-[#e8c547]/20"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-4 sm:mb-6 leading-tight px-2">
            Bergaman - The Dragon's Domain
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-3 sm:mb-4 max-w-4xl mx-auto px-4">
            Electrical & Electronics Engineering Student | Full-Stack Developer | AI Enthusiast
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Crafting innovative technical solutions with the strength and wisdom of a dragon. 
            Specializing in embedded systems, web development, and artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/portfolio"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium bg-[#e8c547] text-[#0e1b12] rounded-lg hover:bg-[#d4b445] transition-colors duration-300"
            >
              <i className="fas fa-briefcase mr-2"></i>
              View Portfolio
            </Link>
            <Link
              href="/about"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border border-[#3e503e] rounded-lg hover:border-[#e8c547] transition-colors duration-300"
            >
              <i className="fas fa-user mr-2"></i>
              About Me
            </Link>
            <Link
              href="/contact"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border border-[#3e503e] rounded-lg hover:border-[#e8c547] transition-colors duration-300"
            >
              <i className="fas fa-envelope mr-2"></i>
              Get in Touch
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 sm:py-16 slide-in-up px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 sm:mb-6 leading-tight">
              <i className="fas fa-dragon mr-2 sm:mr-3"></i>
              About The Dragon
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
              Welcome to my digital domain! I'm a passionate Electrical & Electronics Engineering student with a deep fascination for cutting-edge technology. 
              My journey spans from building comprehensive Discord bots to exploring the frontiers of artificial intelligence and embedded systems.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="glass p-4 sm:p-6 rounded-lg text-center">
              <i className="fas fa-microchip text-3xl sm:text-4xl text-[#e8c547] mb-3 sm:mb-4"></i>
              <h3 className="text-lg sm:text-xl font-semibold text-[#e8c547] mb-2 sm:mb-3">Embedded Systems</h3>
              <p className="text-sm sm:text-base text-gray-300">
                Arduino, IoT devices, and hardware-software integration for real-world applications.
              </p>
            </div>
            <div className="glass p-4 sm:p-6 rounded-lg text-center">
              <i className="fas fa-code text-3xl sm:text-4xl text-[#e8c547] mb-3 sm:mb-4"></i>
              <h3 className="text-lg sm:text-xl font-semibold text-[#e8c547] mb-2 sm:mb-3">Full-Stack Development</h3>
              <p className="text-sm sm:text-base text-gray-300">
                Modern web applications using React, Next.js, Node.js, and MongoDB.
              </p>
            </div>
            <div className="glass p-4 sm:p-6 rounded-lg text-center">
              <i className="fas fa-robot text-3xl sm:text-4xl text-[#e8c547] mb-3 sm:mb-4"></i>
              <h3 className="text-lg sm:text-xl font-semibold text-[#e8c547] mb-2 sm:mb-3">Artificial Intelligence</h3>
              <p className="text-sm sm:text-base text-gray-300">
                Machine learning, neural networks, and AI applications in various domains.
              </p>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="py-12 sm:py-16 slide-in-left px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-8 sm:mb-12 leading-tight">
            <i className="fas fa-timeline mr-2 sm:mr-3"></i>
            Journey Timeline
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#e8c547]/30"></div>
              
              {experiences.map((exp, index) => (
                <div key={index} className="relative flex items-start mb-8 sm:mb-12">
                  {/* Timeline dot */}
                  <div className={`absolute left-2 w-4 h-4 rounded-full border-2 border-[#e8c547] ${
                    exp.type === 'education' ? 'bg-blue-500' :
                    exp.type === 'work' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  
                  {/* Content */}
                  <div className="ml-12 glass p-4 sm:p-6 rounded-lg flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#e8c547]">{exp.title}</h3>
                      <span className="text-sm text-gray-400 bg-[#3e503e]/50 px-2 py-1 rounded">{exp.year}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{exp.company}</p>
                    <p className="text-gray-300 text-sm sm:text-base">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section className="py-12 sm:py-16 slide-in-up px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 sm:mb-0 leading-tight">
              <i className="fas fa-blog mr-2 sm:mr-3"></i>
              Latest Blog Posts
            </h2>
            <Link
              href="/blog"
              className="text-[#e8c547] hover:text-[#d4b445] transition-colors duration-300 text-sm sm:text-base"
            >
              View All Posts <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e8c547] mx-auto mb-4"></div>
              <p className="text-gray-400">Loading blog posts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogPosts.map((post) => (
                <div key={post._id} className="glass rounded-lg overflow-hidden">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          width={400}
                          height={200}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                      ) : (
                        <BlogImageGenerator title={post.title} className="w-full h-40 sm:h-48" />
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="bg-[#e8c547] text-[#0e1b12] px-2 py-1 rounded text-xs font-medium">
                          {post.category || 'Tech'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#e8c547] mb-2 sm:mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3">
                        {post.excerpt || post.content?.substring(0, 150) + '...'}
                      </p>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                        <span>
                          <i className="fas fa-calendar mr-1"></i>
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <span>
                            <i className="fas fa-eye mr-1"></i>
                            {post.views || 0}
                          </span>
                          <span>
                            <i className="fas fa-comments mr-1"></i>
                            {post.comments?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Featured Projects Section */}
        <section className="py-12 sm:py-16 slide-in-right px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 sm:mb-0 leading-tight">
              <i className="fas fa-star mr-2 sm:mr-3"></i>
              Featured Projects
            </h2>
            <Link
              href="/portfolio"
              className="text-[#e8c547] hover:text-[#d4b445] transition-colors duration-300 text-sm sm:text-base"
            >
              View All Projects <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="glass p-4 sm:p-6 rounded-lg">
                <div className="mb-3 sm:mb-4">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={200}
                    className="w-full h-40 sm:h-48 object-cover rounded-lg cursor-pointer"
                    onClick={() => openModal(project.image, project.title)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#e8c547]">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs sm:text-sm">
                      <i className="fas fa-calendar mr-1"></i>
                      {project.date}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'Ongoing' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#3e503e]/50 text-gray-300 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 bg-[#e8c547]/20 text-[#e8c547] rounded hover:bg-[#e8c547]/30 transition-colors duration-300 text-sm sm:text-base"
                  >
                    <i className="fab fa-github mr-2"></i>
                    GitHub
                  </a>
                  {project.demo ? (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors duration-300 text-sm sm:text-base"
                    >
                      <i className="fas fa-external-link-alt mr-2"></i>
                      Demo
                    </a>
                  ) : (
                    <div className="flex-1 text-center py-2 bg-gray-600/20 text-gray-400 rounded cursor-not-allowed text-sm sm:text-base">
                      <i className="fas fa-ban mr-2"></i>
                      Demo N/A
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-12 sm:py-16 fade-in px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-8 sm:mb-12 leading-tight">
            <i className="fas fa-code mr-2 sm:mr-3"></i>
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="glass p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-[#e8c547] mb-4 sm:mb-6">
                  {category.title}
                </h3>
                <div className="space-y-4">
                  {category.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <i className={`${skill.icon} text-[#e8c547] mr-2`}></i>
                          <span className="text-sm sm:text-base font-medium text-gray-300">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-[#3e503e] rounded-full h-2">
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
        </section>

        {/* Interests Section */}
        <section className="py-12 sm:py-16 slide-in-left px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-8 sm:mb-12 leading-tight">
            <i className="fas fa-heart mr-2 sm:mr-3"></i>
            Interests & Passions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {interests.map((interest, index) => (
              <div key={index} className="glass p-4 sm:p-6 rounded-lg text-center hover:scale-105 transition-transform duration-300">
                <i className={`${interest.icon} text-2xl sm:text-3xl text-[#e8c547] mb-3 sm:mb-4`}></i>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-[#e8c547] mb-2">
                  {interest.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  {interest.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-12 sm:py-16 fade-in px-4 sm:px-6">
          <div className="glass p-6 sm:p-8 lg:p-12 rounded-lg text-center">
            <div className="mb-6">
              <i className="fas fa-dragon text-3xl sm:text-4xl text-[#e8c547] mb-4"></i>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 leading-tight">
                Let's Build Something Amazing Together
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto px-2">
                Ready to bring your ideas to life? Whether it's a web application, embedded system, or AI project, 
                I'm here to help you create innovative solutions that make a difference.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
              <Link
                href="/contact"
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium bg-[#e8c547] text-[#0e1b12] rounded-lg hover:bg-[#d4b445] transition-colors duration-300"
              >
                <i className="fas fa-envelope mr-2"></i>
                Get in Touch
              </Link>
              <Link
                href="/portfolio"
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border border-[#3e503e] rounded-lg hover:border-[#e8c547] transition-colors duration-300"
              >
                <i className="fas fa-briefcase mr-2"></i>
                View My Work
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
