"use client";

import Head from 'next/head';
import Image from 'next/image';
import PlaceholderImage from '../components/PlaceholderImage';
import ImageModal from '../components/ImageModal';
import { useState } from 'react';

export default function Portfolio() {
  // Comprehensive project categories based on your data
  const projectCategories = [
    {
      id: 'bots',
      name: 'Bots & Automation',
      description: 'Automated solutions across various platforms, including Discord bots, web scrapers, and automation tools',
      icon: 'fas fa-robot',
      projects: [
        {
          id: 'contro-bot',
          title: 'Contro Bot',
          description: 'A multipurpose Discord bot with moderation, fun commands, and a versatile economy system developed during the pandemic.',
          image: '/images/projects/contro.png',
          technologies: ['Python', 'Discord.py', 'MongoDB'],
          status: 'Active',
          category: 'Discord Bot',
          date: '2020 - Present',
          featured: true,
          links: {
            demo: 'https://discord.gg/vXhwuxJk88',
            github: 'https://github.com/bergaman9/contro-bot'
          },
          features: [
            'Advanced moderation system',
            'Economy and gaming features',
            'Custom command creation',
            'Multi-server support'
          ]
        },
        {
          id: 'timekeepers-bot',
          title: 'Timekeepers Bot',
          description: 'Advanced ticket management bot for handling user support requests and tracking issues.',
          image: 'placeholder',
          technologies: ['Python', 'Discord.py', 'MongoDB'],
          status: 'Completed',
          category: 'Discord Bot',
          date: '2023',
          isClientProject: true,
          links: {
            demo: '#',
            github: '#'
          }
        },
        {
          id: 'stardust-rp-bot',
          title: 'Stardust RP Bot',
          description: 'A Discord bot designed specifically for roleplaying servers with inventory systems.',
          image: 'placeholder',
          technologies: ['Python', 'Discord.py', 'MongoDB'],
          status: 'Completed',
          category: 'Discord Bot',
          date: '2023',
          isClientProject: true,
          links: {
            demo: '#',
            github: '#'
          }
        },
        {
          id: 'disboard-auto-bumper',
          title: 'Disboard Auto Bumper',
          description: 'Automated Discord bot for bumping servers on Disboard when you\'re tired of using the /bump command.',
          image: 'placeholder',
          technologies: ['Python', 'Discord.py', 'Automation'],
          status: 'Completed',
          category: 'Discord Bot',
          date: '2021',
          links: {
            demo: '#',
            github: 'https://github.com/bergaman9/disboard-auto-bumper'
          }
        }
      ]
    },
    {
      id: 'web-applications',
      name: 'Web Applications',
      description: 'Modern web applications built with the latest technologies',
      icon: 'fas fa-globe',
      projects: [
        {
          id: 'contro-dashboard',
          title: 'Contro Dashboard',
          description: 'Advanced dashboard application for managing Contro bot instances, server configurations, and analytics.',
          image: 'placeholder',
          technologies: ['Python', 'Flask', 'JavaScript', 'MongoDB'],
          status: 'Active',
          category: 'Web Application',
          date: '2023',
          featured: true,
          links: {
            demo: 'https://contro.space',
            github: 'https://github.com/bergaman9/contro-dashboard'
          }
        },
        {
          id: 'ligroup',
          title: 'Ligroup',
          description: 'My first full-stack web development project, marking the transition from bot development to comprehensive web solutions.',
          image: '/images/projects/ligroup.png',
          technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
          status: 'Completed',
          category: 'Web Application',
          date: '2022',
          featured: true,
          links: {
            demo: 'https://ligroup-eta.vercel.app/',
            github: 'https://github.com/bergaman9/ligroup'
          }
        },
        {
          id: 'bergaman-website',
          title: 'Bergaman Portfolio',
          description: 'Personal portfolio website built with Next.js featuring modern design and interactive elements.',
          image: 'placeholder',
          technologies: ['Next.js', 'React', 'Tailwind CSS', 'MongoDB'],
          status: 'Active',
          category: 'Web Application',
          date: '2024',
          links: {
            demo: 'https://bergaman.dev',
            github: 'https://github.com/bergaman9/bergaman-dev'
          }
        }
      ]
    },
    {
      id: 'iot-applications',
      name: 'IoT & Embedded',
      description: 'Hardware and software solutions for Internet of Things devices and systems',
      icon: 'fas fa-microchip',
      projects: [
        {
          id: 'air-quality-monitoring',
          title: 'Indoor Air Quality Monitoring',
          description: 'IoT solution using Arduino Uno R4 WiFi for wireless data transfer and real-time air quality monitoring.',
          image: '/images/projects/iaq.jpg',
          technologies: ['Arduino', 'C++', 'WiFi', 'Sensors', 'PyQt5'],
          status: 'Completed',
          category: 'IoT Project',
          date: '2024',
          featured: true,
          links: {
            demo: '#',
            github: 'https://github.com/bergaman9/indoor-air-quality-monitoring'
          },
          features: [
            'Real-time air quality monitoring',
            'Wireless data transmission',
            'Custom GUI application',
            'Data logging and analysis'
          ]
        },
        {
          id: 'arduino-projects',
          title: 'Arduino Projects Collection',
          description: 'A collection of diverse Arduino projects that cater to different levels of expertise.',
          image: 'placeholder',
          technologies: ['Arduino', 'C++', 'Sensors', 'Electronics'],
          status: 'Ongoing',
          category: 'IoT Project',
          date: '2022 - Present',
          links: {
            demo: '#',
            github: 'https://github.com/bergaman9/Arduino-Projects'
          }
        }
      ]
    },
    {
      id: 'ai-ml-projects',
      name: 'AI & Machine Learning',
      description: 'Experimental AI projects and machine learning applications',
      icon: 'fas fa-brain',
      projects: [
        {
          id: 'rvc-stable-diffusion',
          title: 'RVC & Stable Diffusion Projects',
          description: 'Experimental AI projects exploring voice conversion and image generation during the rise of generative AI.',
          image: '/images/projects/generative-ai.png',
          technologies: ['Python', 'PyTorch', 'Stable Diffusion', 'RVC'],
          status: 'Experimental',
          category: 'AI/ML',
          date: '2023',
          featured: true,
          links: {
            demo: '#',
            github: 'https://github.com/bergaman9?tab=repositories'
          },
          features: [
            'Voice cloning and conversion',
            'AI image generation',
            'Custom model training',
            'Real-time processing'
          ]
        }
      ]
    },
    {
      id: 'graphic-design',
      name: 'Graphic Design',
      description: 'Digital design work including emojis, icons, banners, and social media content',
      icon: 'fas fa-palette',
      projects: [
        {
          id: 'text-emojis',
          title: 'Text Expression Emojis',
          description: 'Custom text expression emoji designs for Discord servers, including various emotional expressions and commonly used phrases.',
          image: 'placeholder',
          technologies: ['Photoshop', 'Illustrator'],
          status: 'Completed',
          category: 'Graphic Design',
          date: '2023',
          purchasable: true,
          links: {
            demo: '#',
            github: '#'
          }
        },
        {
          id: 'button-emojis',
          title: 'Button Emojis',
          description: 'Custom interactive button designs for Discord bots and server navigation.',
          image: 'placeholder',
          technologies: ['Photoshop', 'Illustrator'],
          status: 'Completed',
          category: 'Graphic Design',
          date: '2023',
          purchasable: true,
          isClientProject: true,
          links: {
            demo: '#',
            github: '#'
          }
        },
        {
          id: 'role-icons',
          title: 'Role Icons',
          description: 'Distinctive role and badge icons for Discord servers, designed to visually differentiate user roles.',
          image: 'placeholder',
          technologies: ['Photoshop', 'Illustrator', 'Blender'],
          status: 'Completed',
          category: 'Graphic Design',
          date: '2023',
          isClientProject: true,
          links: {
            demo: '#',
            github: '#'
          }
        }
      ]
    },
    {
      id: 'umbrella-brands',
      name: 'My Brands',
      description: 'Personal initiatives and community platforms I created and manage',
      icon: 'fas fa-building',
      projects: [
        {
          id: 'bergasoft',
          title: 'Bergasoft',
          description: 'My personal software development brand and portfolio showcasing projects and services.',
          image: 'placeholder',
          technologies: ['Branding', 'Web Development', 'Business'],
          status: 'Active',
          category: 'Brand',
          date: '2023 - Present',
          links: {
            demo: 'https://bergasoft.dev',
            github: 'https://github.com/bergaman9'
          }
        },
        {
          id: 'turk-oyuncu-toplulugu',
          title: 'Türk Oyuncu Topluluğu',
          description: 'Active Discord community and Instagram page bringing together Turkish gamers and gaming enthusiasts.',
          image: 'placeholder',
          technologies: ['Community Management', 'Social Media', 'Discord'],
          status: 'Active',
          category: 'Community',
          date: '2022 - Present',
          links: {
            demo: 'https://discord.gg/turkoyuncutoplulugu',
            github: '#'
          }
        },
        {
          id: 'teknominator',
          title: 'Teknominatör',
          description: 'Educational YouTube channel and blog focused on science, technology and engineering topics.',
          image: 'placeholder',
          technologies: ['Content Creation', 'Education', 'YouTube'],
          status: 'Completed',
          category: 'Education',
          date: '2023 - 2024',
          links: {
            demo: 'https://teknominator.com',
            github: '#'
          }
        }
      ]
    }
  ];

  // Get all projects from all categories
  const allProjects = projectCategories.flatMap(category => 
    category.projects.map(project => ({
      ...project,
      categoryName: category.name,
      categoryIcon: category.icon
    }))
  );

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
  const filteredProjects = allProjects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || 
                           selectedCategory === project.categoryName ||
                           projectCategories.find(cat => cat.name === selectedCategory)?.id === 
                           projectCategories.find(cat => cat.projects.includes(project))?.id;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Get categories for filter
  const categories = ['all', ...projectCategories.map(cat => cat.name)];

  // Get featured projects
  const featuredProjects = allProjects.filter(project => project.featured);

  return (
    <div className="min-h-screen text-[#d1d5db] page-container">
      <Head>
        <title>Portfolio - Bergaman | Full Stack Development Projects</title>
        <meta name="description" content="Explore Bergaman's comprehensive portfolio featuring Discord bots, web applications, IoT projects, AI experiments, and graphic design work." />
        <meta name="keywords" content="portfolio, discord bots, web development, IoT projects, AI projects, graphic design, bergaman projects" />
        <meta property="og:title" content="Portfolio - Bergaman | Full Stack Development Projects" />
        <meta property="og:description" content="Explore Bergaman's comprehensive portfolio featuring Discord bots, web applications, IoT projects, and AI experiments." />
        <meta property="og:url" content="https://bergaman.dev/portfolio" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio - Bergaman | Full Stack Development Projects" />
        <meta name="twitter:description" content="Explore Bergaman's comprehensive portfolio featuring Discord bots, web applications, and IoT projects." />
        <link rel="canonical" href="https://bergaman.dev/portfolio" />
      </Head>

      <main className="page-content py-8">
        
        {/* Page Header */}
        <section className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 leading-tight flex items-center justify-center gap-3">
            <i className="fas fa-briefcase text-[#e8c547]"></i>
            My Portfolio
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            A comprehensive showcase of my projects spanning Discord bots, web applications, IoT solutions, AI experiments, and creative design work.
          </p>
        </section>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-12 slide-in-left">
            <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-3">
              <i className="fas fa-star text-[#e8c547]"></i>
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map((project, index) => (
                <div
                  key={index}
                  className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#2e3d29] to-[#0e1b12] flex items-center justify-center overflow-hidden cursor-pointer"
                       onClick={() => project.image && project.image !== "placeholder" && openModal(project.image, project.title)}>
                    {project.image === "placeholder" ? (
                      <PlaceholderImage
                        width={400}
                        height={192}
                        text={project.title}
                        category={project.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                        className="w-full h-full object-cover"
                      />
                    ) : project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <i className={`${project.categoryIcon} text-4xl text-[#e8c547]`}></i>
                    )}
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#e8c547] text-[#0e1b12] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <i className="fas fa-star"></i>
                        Featured
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-[#0e1b12]/80 backdrop-blur-sm text-[#e8c547] rounded-full text-xs font-medium border border-[#3e503e]/50">
                        <i className="fas fa-calendar-alt mr-1"></i>
                        {project.date}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold gradient-text mb-3">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-xs text-[#e8c547]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-xs text-gray-400">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {project.links.github && project.links.github !== "#" && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-sm hover:border-[#e8c547]/50 hover:text-[#e8c547] transition-colors duration-300"
                        >
                          <i className="fab fa-github"></i>
                          Code
                        </a>
                      )}
                      
                      {project.links.demo && project.links.demo !== "#" ? (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#e8c547] text-[#0e1b12] rounded-lg text-sm hover:bg-[#d4b445] transition-colors duration-300"
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
          </section>
        )}

        {/* Project Categories Overview */}
        <section className="mb-12 slide-in-right">
          <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-3">
            <i className="fas fa-th-large text-[#e8c547]"></i>
            Project Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectCategories.map((category, index) => (
              <div
                key={index}
                className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg hover:border-[#3e503e]/50 transition-colors duration-300 cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="flex items-center mb-4">
                  <i className={`${category.icon} text-[#e8c547] text-2xl mr-3`}></i>
                  <h3 className="text-xl font-semibold text-[#e8c547]">{category.name}</h3>
                </div>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {category.projects.length} project{category.projects.length !== 1 ? 's' : ''}
                  </span>
                  <i className="fas fa-arrow-right text-[#e8c547] text-sm"></i>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter Controls */}
        <section className="mb-8 slide-in-left">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
            
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative max-w-2xl mx-auto">
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search projects by name, description, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300 text-base"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    selectedCategory === category
                      ? 'bg-[#e8c547] text-[#0e1b12]'
                      : 'bg-[#0e1b12] border border-[#3e503e] text-[#d1d5db] hover:border-[#e8c547]/50 hover:text-[#e8c547]'
                  }`}
                >
                  {category === 'all' ? 'All Projects' : category}
                </button>
              ))}
            </div>

            {/* Results Info */}
            <div className="mt-4 text-sm text-gray-400 text-center">
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
                  className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden hover:border-[#3e503e]/50 transition-all duration-300"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#2e3d29] to-[#0e1b12] flex items-center justify-center overflow-hidden cursor-pointer"
                       onClick={() => project.image && project.image !== "placeholder" && openModal(project.image, project.title)}>
                    {project.image === "placeholder" ? (
                      <PlaceholderImage
                        width={400}
                        height={192}
                        text={project.title}
                        category={project.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                        className="w-full h-full object-cover"
                      />
                    ) : project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <i className={`${project.categoryIcon} text-4xl text-[#e8c547]`}></i>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#e8c547] text-[#0e1b12] rounded-full text-xs font-medium uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>

                    {/* Status & Date */}
                    <div className="absolute top-4 right-4 flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        project.status === 'Completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {project.status}
                      </span>
                      <span className="px-2 py-1 bg-[#0e1b12]/80 backdrop-blur-sm text-[#e8c547] rounded-full text-xs font-medium border border-[#3e503e]/50">
                        {project.date}
                      </span>
                    </div>

                    {/* Special Badges */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {project.isClientProject && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium border border-purple-500/30">
                          Client Work
                        </span>
                      )}
                      {project.purchasable && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
                          For Sale
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold gradient-text mb-3">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-xs text-[#e8c547]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-xs text-gray-400">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {project.links.github && project.links.github !== "#" && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-sm hover:border-[#e8c547]/50 hover:text-[#e8c547] transition-colors duration-300"
                        >
                          <i className="fab fa-github"></i>
                          Code
                        </a>
                      )}
                      
                      {project.links.demo && project.links.demo !== "#" ? (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#e8c547] text-[#0e1b12] rounded-lg text-sm hover:bg-[#d4b445] transition-colors duration-300"
                        >
                          <i className="fas fa-external-link-alt"></i>
                          {project.links.demo.includes('discord') ? 'Discord' : 'Demo'}
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
