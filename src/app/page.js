"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ImageModal from './components/ImageModal';
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
      description: "Comprehensive Discord bot developed during the pandemic with advanced features",
      image: "/images/projects/contro.png",
      tech: ["Python", "Discord.py", "SQLite"],
      github: "https://github.com/bergaman9/contro-bot",
      demo: null
    },
    {
      id: 2,
      title: "Indoor Air Quality IoT Project",
      description: "GUI application with wireless data transfer and real-time monitoring using Arduino",
      image: "/images/projects/iaq.jpg",
      tech: ["Arduino", "C++", "IoT", "Sensors"],
      github: "https://github.com/bergaman9/arduino-projects",
      demo: null
    }
  ];

  // Skills data
  const skills = [
    { name: "React/Next.js", level: 90 },
    { name: "JavaScript/TypeScript", level: 85 },
    { name: "Python", level: 90 },
    { name: "C# / WPF", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "MongoDB", level: 75 }
  ];

  // Interests data
  const interests = [
    { name: "AI Development", icon: "fas fa-robot" },
    { name: "Game Development", icon: "fas fa-gamepad" },
    { name: "IoT Projects", icon: "fas fa-microchip" },
    { name: "Blockchain", icon: "fas fa-link" },
    { name: "Mobile Apps", icon: "fas fa-mobile-alt" },
    { name: "Web3", icon: "fas fa-cube" }
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
        <section className="text-center py-20 fade-in">
          <div className="mb-8">
            <Image
              src="/images/profile/profile.png"
              alt="Bergaman Profile"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => openModal("/images/profile/profile.png", "Bergaman Profile")}
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6 leading-tight">
            The Dragon's Domain
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Crafting technology inspired by the strength and wisdom of a dragon
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/portfolio"
              className="px-8 py-4 text-lg font-medium bg-[#e8c547] text-[#0e1b12] rounded-lg hover:bg-[#d4b445] transition-colors duration-300"
            >
              <i className="fas fa-briefcase mr-2"></i>
              View Portfolio
            </Link>
            <Link
              href="/blog"
              className="px-8 py-4 text-lg font-medium border border-[#3e503e] rounded-lg hover:border-[#e8c547] transition-colors duration-300"
            >
              <i className="fas fa-blog mr-2"></i>
              Read Blog
            </Link>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-16 slide-in-left">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text leading-tight">
              <i className="fas fa-blog mr-3"></i>
              Latest Blog Posts
            </h2>
            <Link
              href="/blog"
              className="text-[#e8c547] hover:text-[#d4b445] transition-colors duration-300"
            >
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mb-4"></i>
              <p className="text-gray-400">Loading blog posts...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-file-alt text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-400">No blog posts available yet.</p>
              {isAdminMode && (
                <Link
                  href="/admin/posts/new"
                  className="mt-4 inline-block bg-[#e8c547] text-[#0e1b12] px-4 py-2 rounded hover:bg-[#d4b445] transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <div key={post._id} className="relative">
                  {isAdminMode && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <Link
                        href={`/admin/posts/${post._id}/edit`}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                        title="Edit Post"
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </Link>
                    </div>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="glass p-6 rounded-lg hover-lift block"
                  >
                    {post.image && (
                      <div className="mb-4">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal(post.image, post.title);
                          }}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-[#e8c547]/20 text-[#e8c547] text-xs rounded-full">
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#e8c547] mb-3">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>
                        <i className="fas fa-clock mr-1"></i>
                        {post.readTime || '6 min read'}
                      </span>
                      <div className="flex items-center space-x-3">
                        <span>
                          <i className="fas fa-eye mr-1"></i>
                          {post.views || 0}
                        </span>
                        <span>
                          <i className="fas fa-heart mr-1"></i>
                          {post.likes || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Featured Projects Section */}
        <section className="py-16 slide-in-right">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-12 leading-tight">
            <i className="fas fa-star mr-3"></i>
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="glass p-6 rounded-lg hover-lift">
                <div className="mb-4">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer"
                    onClick={() => openModal(project.image, project.title)}
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#e8c547] mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#3e503e]/50 text-gray-300 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 bg-[#e8c547]/20 text-[#e8c547] rounded hover:bg-[#e8c547]/30 transition-colors duration-300"
                  >
                    <i className="fab fa-github mr-2"></i>
                    GitHub
                  </a>
                  {project.demo ? (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors duration-300"
                    >
                      <i className="fas fa-external-link-alt mr-2"></i>
                      Demo
                    </a>
                  ) : (
                    <div className="flex-1 text-center py-2 bg-gray-600/20 text-gray-400 rounded cursor-not-allowed">
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
        <section className="py-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-12 leading-tight">
            <i className="fas fa-code mr-3"></i>
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <div key={index} className="glass p-6 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-[#e8c547]">
                    {skill.name}
                  </h3>
                  <span className="text-gray-400">{skill.level}%</span>
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
        </section>

        {/* Interests Section */}
        <section className="py-16 slide-in-left">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-12 leading-tight">
            <i className="fas fa-heart mr-3"></i>
            Interests & Passions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interests.map((interest, index) => (
              <div key={index} className="glass p-6 rounded-lg text-center hover-lift">
                <i className={`${interest.icon} text-3xl text-[#e8c547] mb-4`}></i>
                <h3 className="text-lg font-semibold text-gray-300">
                  {interest.name}
                </h3>
              </div>
            ))}
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
