"use client";

import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import PlaceholderImage from '../components/PlaceholderImage';
import ImageModal from '../components/ImageModal';
import { useState } from 'react';

export default function Portfolio() {
  const projects = [
    {
      id: 1,
      title: "Contro Bot",
      description: "A comprehensive Discord bot developed during the pandemic period with advanced moderation, music, and utility features.",
      image: "/images/contro.png",
      technologies: ["Python", "Discord.py", "SQLite", "Heroku"],
      status: "Active",
      category: "Bot Development",
      features: [
        "Advanced moderation system",
        "Music streaming capabilities", 
        "Custom command creation",
        "Server statistics tracking"
      ],
      links: {
        demo: "https://discord.com/api/oauth2/authorize?client_id=your-bot-id",
        github: "https://github.com/bergaman9/contro-bot"
      }
    },
    {
      id: 2,
      title: "Ligroup",
      description: "My first full-stack web development project, marking the transition from bot development to comprehensive web solutions.",
      image: "/images/ligroup.png",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      status: "Completed",
      category: "Full Stack Web",
      features: [
        "User authentication system",
        "Real-time messaging",
        "Group management",
        "File sharing capabilities"
      ],
      links: {
        demo: "https://ligroup-eta.vercel.app/",
        github: "https://github.com/bergaman9/ligroup"
      }
    },
    {
      id: 3,
      title: "RVC & Stable Diffusion Projects",
      description: "Experimental AI projects exploring voice conversion and image generation during the rise of generative AI.",
      image: "/images/generative-ai.png",
      technologies: ["Python", "PyTorch", "Stable Diffusion", "RVC"],
      status: "Experimental",
      category: "AI/ML",
      features: [
        "Voice cloning and conversion",
        "AI image generation",
        "Custom model training",
        "Real-time processing"
      ],
      links: {
        demo: "#",
        github: "https://github.com/bergaman9?tab=repositories"
      }
    },
    {
      id: 4,
      title: "Indoor Air Quality IoT Project",
      description: "IoT solution using Arduino Uno R4 WiFi for wireless data transfer and real-time air quality monitoring.",
      image: "/images/iaq.jpg",
      technologies: ["Arduino", "C++", "WiFi", "Sensors", "GUI"],
      status: "Completed",
      category: "IoT/Embedded",
      features: [
        "Real-time air quality monitoring",
        "Wireless data transmission",
        "Custom GUI application",
        "Data logging and analysis"
      ],
      links: {
        demo: "#",
        github: "https://github.com/bergaman9/indoor-air-quality-monitoring"
      }
    },
    {
      id: 5,
      title: "Bergaman Website",
      description: "Personal portfolio website built with Next.js featuring modern design and interactive elements.",
      image: "placeholder",
      technologies: ["Next.js", "React", "Tailwind CSS", "Vercel"],
      status: "Active",
      category: "Web Development",
      features: [
        "Responsive design",
        "Circuit board animations",
        "Blog system",
        "Interactive UI elements"
      ],
      links: {
        demo: "https://bergaman.dev",
        github: "https://github.com/bergaman9/bergaman-dev"
      }
    },
    {
      id: 6,
      title: "Disboard Auto Bumper",
      description: "Automated Discord bot for bumping servers on Disboard when you're tired of using the /bump command.",
      image: "placeholder",
      technologies: ["Python", "Discord.py", "Automation"],
      status: "Completed",
      category: "Bot Development",
      features: [
        "Automatic server bumping",
        "Customizable intervals",
        "Error handling",
        "Easy setup"
      ],
      links: {
        demo: "#",
        github: "https://github.com/bergaman9/disboard-auto-bumper"
      }
    },
    {
      id: 7,
      title: "Arduino Projects Collection",
      description: "A collection of diverse Arduino projects that cater to different levels of expertise.",
      image: "placeholder",
      technologies: ["Arduino", "C++", "Sensors", "Electronics"],
      status: "Ongoing",
      category: "IoT/Embedded",
      features: [
        "Multiple project examples",
        "Beginner to advanced levels",
        "Detailed documentation",
        "Circuit diagrams"
      ],
      links: {
        demo: "#",
        github: "https://github.com/bergaman9/Arduino-Projects"
      }
    },
    {
      id: 8,
      title: "Front-End Projects",
      description: "Collection of various front-end projects built using HTML, CSS, JavaScript, and React.js.",
      image: "placeholder",
      technologies: ["HTML", "CSS", "JavaScript", "React"],
      status: "Completed",
      category: "Web Development",
      features: [
        "Pure front-end focus",
        "Multiple technologies",
        "Responsive designs",
        "Modern UI/UX"
      ],
      links: {
        demo: "#",
        github: "https://github.com/bergaman9/Front-End-Projects"
      }
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter projects based on category and search
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = ['all', ...new Set(projects.map(project => project.category))];

  return (
    <div className="min-h-screen text-[#d1d5db] page-container">
      <Head>
        <title>Portfolio - Bergaman | Full Stack Development Projects</title>
        <meta name="description" content="Explore Bergaman's portfolio featuring full stack web applications, AI projects, Discord bots, and innovative digital solutions." />
        <meta name="keywords" content="portfolio, full stack projects, web development, AI projects, Discord bots, bergaman projects" />
        <meta property="og:title" content="Portfolio - Bergaman | Full Stack Development Projects" />
        <meta property="og:description" content="Explore Bergaman's portfolio featuring full stack web applications, AI projects, and innovative solutions." />
        <meta property="og:url" content="https://bergaman.dev/portfolio" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio - Bergaman | Full Stack Development Projects" />
        <meta name="twitter:description" content="Explore Bergaman's portfolio featuring full stack web applications and AI projects." />
        <link rel="canonical" href="https://bergaman.dev/portfolio" />
      </Head>

      <Header />

      <main className="page-content py-8">
        
        {/* Page Header */}
        <section className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            My Portfolio
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            A showcase of my projects, from full-stack web applications to AI experiments and everything in between.
          </p>
        </section>

        {/* Filter Controls */}
        <section className="mb-8 slide-in-left">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01]">
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Search Bar */}
              <div className="flex-1 relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-scale ${
                      selectedCategory === category
                        ? 'bg-[#e8c547] text-[#0e1b12] shadow-lg shadow-[#e8c547]/25'
                        : 'bg-[#0e1b12] border border-[#3e503e] text-[#d1d5db] hover:border-[#e8c547]/50 hover:text-[#e8c547]'
                    }`}
                  >
                    {category === 'all' ? 'All Projects' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 text-sm text-gray-400">
              {filteredProjects.length === 0 ? (
                <span>No projects found matching your criteria.</span>
              ) : (
                <span>Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="slide-in-right">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Projects Found</h3>
              <p className="text-gray-400">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div
                  key={index}
                  className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01] group"
                >
                  {/* Project Image/Icon */}
                  <div className="relative h-48 bg-gradient-to-br from-[#2e3d29] to-[#0e1b12] flex items-center justify-center overflow-hidden cursor-pointer"
                       onClick={() => project.image && project.image !== "placeholder" && openModal(project.image, project.title)}>
                    {project.image === "placeholder" ? (
                      <PlaceholderImage
                        width={400}
                        height={192}
                        text={project.title}
                        category={project.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <i className={`${project.icon} text-4xl text-[#e8c547] group-hover:scale-110 transition-transform duration-300`}></i>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#e8c547] text-[#0e1b12] rounded-full text-xs font-medium uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold gradient-text mb-3 group-hover:text-[#e8c547] transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-xs text-[#e8c547]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-sm hover:border-[#e8c547]/50 hover:text-[#e8c547] transition-all duration-300 hover-scale"
                      >
                        <i className="fab fa-github"></i>
                        Code
                      </a>
                      
                      {project.links.demo && project.links.demo !== "#" ? (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#e8c547] text-[#0e1b12] rounded-lg text-sm hover:bg-[#d4b445] transition-all duration-300 hover-scale"
                        >
                          <i className="fas fa-external-link-alt"></i>
                          Demo
                        </a>
                      ) : (
                        <span className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm cursor-not-allowed">
                          <i className="fas fa-external-link-alt"></i>
                          Demo N/A
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
