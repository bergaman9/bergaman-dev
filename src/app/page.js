"use client";

// Force dynamic rendering to prevent initialization errors
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import ImageModal from './components/ImageModal';
import BlogImageGenerator from './components/BlogImageGenerator';
import FloatingSkills from './components/FloatingSkills';
import { useAdminMode } from '../hooks/useAdminMode';
import Card from './components/Card';
import Button from './components/Button';
import BlogPostCard from './components/BlogPostCard';
import ProjectCard from './components/ProjectCard';
import RecommendationCard from './components/RecommendationCard';

export default function Home() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const { isAdminMode, exitEditMode } = useAdminMode();
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Skills data with categories
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: "fas fa-code",
      skills: [
        { name: "Python", level: 85 },
        { name: "JavaScript", level: 80 },
        { name: "C#", level: 70 },
        { name: "C++", level: 65 }
      ]
    },
    {
      title: "Web Technologies",
      icon: "fas fa-globe",
      skills: [
        { name: "React", level: 85 },
        { name: "Next.js", level: 80 },
        { name: "Node.js", level: 75 },
        { name: "HTML & CSS", level: 90 }
      ]
    },
    {
      title: "Tools & Databases",
      icon: "fas fa-database",
      skills: [
        { name: "MongoDB", level: 75 },
        { name: "Git", level: 85 },
        { name: "Docker", level: 60 },
        { name: "SQL", level: 70 }
      ]
    }
  ];

  // Interests data
  const interests = [
    { 
      name: "Artificial Intelligence", 
      icon: "fas fa-robot",
      description: "Machine learning, neural networks, and AI applications"
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

  // Format category name for display
  const formatCategoryName = (category) => {
    switch(category) {
      case 'ai': return 'AI';
      case 'web-development': return 'Web Development';
      case 'technology': return 'Technology';
      case 'tutorial': return 'Tutorial';
      case 'programming': return 'Programming';
      case 'blockchain': return 'Blockchain';
      case 'mobile': return 'Mobile';
      case 'design': return 'Design';
      default: return category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Tech';
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchBlogPosts();
    fetchRecommendations();
    fetchFeaturedProjects();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/posts?limit=3');
      const data = await response.json();
      
      if (data.posts) {
        // Fetch comment count for each post
        const postsWithCommentCount = await Promise.all(
          data.posts.map(async (post) => {
            try {
              const commentResponse = await fetch(`/api/comments?postSlug=${post.slug}`);
              const commentData = await commentResponse.json();
              return {
                ...post,
                commentCount: commentData.comments?.length || 0
              };
            } catch (error) {
              console.error(`Error fetching comments for ${post.slug}:`, error);
              return {
                ...post,
                commentCount: 0
              };
            }
          })
        );
        
        setBlogPosts(postsWithCommentCount);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const response = await fetch('/api/recommendations');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.recommendations) {
        // Shuffle array and pick 3 random items
        const shuffled = [...data.recommendations].sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const fetchFeaturedProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await fetch('/api/portfolio?featured=true&limit=4', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.portfolios) {
        setFeaturedProjects(data.portfolios);
      } else {
        console.error('Failed to fetch projects:', data.error || 'Unknown error');
        setFeaturedProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setFeaturedProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const openModal = (imageSrc, imageAlt) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <>
      <Head>
        <title>Bergaman - The Dragon's Domain</title>
      </Head>

      <main className="flex-grow">
        <div className="bg-grid-pattern-dark">
          <div className="page-container">
            <div className="page-content pt-12">
              {/* Hero Section - Enhanced */}
              <section className="text-center py-16 md:py-24 fade-in relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8c547' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>

                {/* Profile Image - Cleaner Design */}
                <div className="relative mb-8 flex justify-center">
                  <div className="relative">
                    {/* Animated Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#e8c547]/15 to-[#f4d76b]/15 rounded-full blur-2xl animate-pulse scale-125"></div>
                    
                    {/* Main Profile Image */}
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
                      <Image
                        className="relative rounded-full border-4 border-[#e8c547]/40 shadow-xl shadow-[#0e1b12]/30 transition-all duration-500 hover:scale-105 hover:border-[#e8c547]/60"
                        src="/images/profile/profile.png"
                        alt="Ömer Faruk Güler - Bergaman"
                        width={256}
                        height={256}
                        priority
                      />
                      
                      {/* Floating Skills - Enhanced positioning */}
                      <FloatingSkills />
                    </div>
                  </div>
                </div>

                {/* Text Content - Enhanced Typography */}
                <div className="relative z-10">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-[#e8c547] via-[#f4d76b] to-[#e8c547] bg-clip-text text-transparent animate-gradient bg-300">
                      Bergaman
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-300 mb-6 font-light">
                    The Dragon's Domain
                  </p>
                  
                  <div className="flex flex-wrap justify-center items-center gap-3 text-gray-400 mb-6">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-bolt text-[#e8c547]"></i>
                      Electrical & Electronics Engineer
                    </span>
                    <span className="hidden sm:inline text-gray-600">•</span>
                    <span className="flex items-center gap-2">
                      <i className="fas fa-code text-[#e8c547]"></i>
                      Full-Stack Developer
                    </span>
                    <span className="hidden sm:inline text-gray-600">•</span>
                    <span className="flex items-center gap-2">
                      <i className="fas fa-brain text-[#e8c547]"></i>
                      AI Enthusiast
                    </span>
                  </div>
                  
                  <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Crafting innovative technical solutions with the strength and wisdom of a dragon. 
                    Specializing in embedded systems, web development, and artificial intelligence.
                  </p>
                  
                  {/* CTA Buttons - Enhanced */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button href="/portfolio" size="lg" className="group">
                      <i className="fas fa-briefcase mr-2 group-hover:rotate-12 transition-transform"></i>
                      View Portfolio
                    </Button>
                    <Button href="/about" variant="secondary" size="lg" className="group">
                      <i className="fas fa-user mr-2 group-hover:scale-110 transition-transform"></i>
                      About Me
                    </Button>
                    <Button href="/contact" variant="secondary" size="lg" className="group">
                      <i className="fas fa-envelope mr-2 group-hover:translate-x-1 transition-transform"></i>
                      Get in Touch
                    </Button>
                  </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <i className="fas fa-chevron-down text-2xl text-[#e8c547]/50"></i>
                </div>
              </section>

              {/* Latest Blog Posts */}
              <section className="mb-12 slide-in-right">
                <h2 className="text-3xl font-bold gradient-text mb-6 text-center">
                  <i className="fas fa-blog mr-3"></i>
                  Latest Blog Posts
                </h2>
                {loading ? (
                  <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e8c547] mx-auto mb-4"></div><p className="text-gray-400">Loading...</p></div>
                ) : blogPosts && blogPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <BlogPostCard
                          post={post}
                          formatDate={formatDate}
                          formatCategoryName={formatCategoryName}
                          openModal={openModal}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No blog posts found.</p>
                  </div>
                )}
                <div className="text-center mt-8">
                  <Button href="/blog" variant="secondary">View All Posts<i className="fas fa-arrow-right ml-2"></i></Button>
                </div>
              </section>

              {/* Featured Projects */}
              <section className="mb-12 slide-in-left">
                <h2 className="text-3xl font-bold gradient-text mb-8 text-center">
                  <i className="fas fa-star mr-3"></i>
                  Featured Projects
                </h2>
                {loadingProjects ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e8c547] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading projects...</p>
                  </div>
                ) : featuredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProjects.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No featured projects found.</p>
                  </div>
                )}
                <div className="text-center mt-8">
                  <Button href="/portfolio">View All Projects<i className="fas fa-arrow-right ml-2"></i></Button>
                </div>
              </section>

              {/* Recommendations Section */}
              <section className="mb-12 slide-in-right">
                <h2 className="text-3xl font-bold gradient-text mb-8 text-center">
                  <i className="fas fa-thumbs-up mr-3"></i>
                  My Recommendations
                </h2>
                
                {loadingRecommendations ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e8c547] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading recommendations...</p>
                  </div>
                ) : recommendations.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendations.map((rec) => (
                        <RecommendationCard
                          key={rec._id}
                          recommendation={rec}
                        />
                      ))}
                    </div>
                    <div className="text-center mt-8">
                      <Button href="/recommendations" variant="secondary">View All Recommendations<i className="fas fa-arrow-right ml-2"></i></Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No recommendations found.</p>
                  </div>
                )}
              </section>

              {/* Technical Skills */}
              <section className="mb-12 slide-in-right">
                <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg">
                  <h2 className="text-3xl font-bold gradient-text mb-8 text-center">
                    <i className="fas fa-code mr-3"></i>
                    Technical Skills
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillCategories.map((category, index) => (
                      <div key={index} className="p-6">
                        <div className="flex items-center mb-4">
                          <i className={`${category.icon} text-[#e8c547] text-2xl mr-3`}></i>
                          <h3 className="text-xl font-semibold text-[#e8c547]">{category.title}</h3>
                        </div>
                        <div className="space-y-3">
                          {category.skills.map((skill, skillIndex) => (
                            <div key={skillIndex}>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-300">{skill.name}</span>
                                <span className="text-[#e8c547] font-semibold">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-[#0e1b12] rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-[#e8c547] to-[#f4d76b] h-2 rounded-full transition-all duration-1000 ease-out"
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

              {/* Interests & Passions */}
              <section className="mb-12 slide-in-left">
                <h2 className="text-3xl font-bold gradient-text mb-8 text-center">
                  <i className="fas fa-heart mr-3"></i>
                  Interests & Passions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {interests.map((interest, index) => (
                    <div key={index} className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg text-center hover:border-[#e8c547]/50 transition-all duration-300">
                      <i className={`${interest.icon} text-[#e8c547] text-4xl mb-4 block`}></i>
                      <h3 className="text-xl font-semibold text-[#e8c547] mb-3">{interest.name}</h3>
                      <p className="text-gray-300 leading-relaxed">{interest.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contact CTA */}
              <section className="mb-12 slide-in-right">
                <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg text-center">
                  <h2 className="text-3xl font-bold gradient-text mb-4">
                    <i className="fas fa-handshake mr-3"></i>
                    Let's Connect
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Have a question, idea, or just want to say hello? I'm always open to interesting conversations and new connections. Feel free to reach out through the contact form or social media.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button href="/contact" size="lg"><i className="fas fa-envelope mr-2"></i>Contact Me</Button>
                    <Button href="/about" variant="secondary" size="lg"><i className="fas fa-user mr-2"></i>More About Me</Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={closeModal}
        />
      )}
    </>
  );
}
