"use client";

import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";
import Header from './components/Header';
import Footer from './components/Footer';
import ImageModal from './components/ImageModal';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { blogPosts } from "../data/blogPosts"; // Import blog posts
import { useAdminMode } from '../hooks/useAdminMode';

const CircularProgressbar = dynamic(() => import('react-circular-progressbar').then(mod => mod.CircularProgressbar), { ssr: false });
import 'react-circular-progressbar/dist/styles.css';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdminMode, exitEditMode } = useAdminMode();

  const projectImages = [
    { src: "/images/contro.png", alt: "Contro Bot - Discord Bot Project" },
    { src: "/images/ligroup.png", alt: "Ligroup - Full Stack Web Application" },
    { src: "/images/generative-ai.png", alt: "RVC & Stable Diffusion AI Projects" },
    { src: "/images/iaq.jpg", alt: "Indoor Air Quality IoT Project" }
  ];

  const openModal = (imageSrc, imageAlt, imageIndex = 0) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

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
      // Fallback to empty array if API fails
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort blog posts by date (newest to oldest)
  const sortedBlogPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedBlogPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen text-[#d1d5db] page-container">
      <Head>
        <title>Bergaman - AI & Blockchain Developer | Full Stack Development</title>
        <meta name="description" content="Welcome to Bergaman's portfolio. Expert in AI, blockchain, and full-stack development. Specializing in Python, JavaScript, Discord bots, IoT projects, and cutting-edge technology solutions." />
        <meta name="keywords" content="Bergaman, AI developer, blockchain developer, full stack developer, Python, JavaScript, Discord bot, IoT, portfolio" />
        <meta property="og:title" content="Bergaman - AI & Blockchain Developer" />
        <meta property="og:description" content="Expert in AI, blockchain, and full-stack development. Specializing in cutting-edge technology solutions." />
        <meta property="og:url" content="https://bergaman.dev" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bergaman - AI & Blockchain Developer" />
        <meta name="twitter:description" content="Expert in AI, blockchain, and full-stack development." />
        <link rel="canonical" href="https://bergaman.dev" />
      </Head>

      <Header />

      <main className="page-content py-8">
        <div className="fade-in">
          <Image
            className="rounded-full border-4 border-[#e8c547] mt-10 shadow-[0_0_20px_5px_rgba(232,197,71,0.5)] hover:scale-105 transition-transform duration-300 mx-auto"
            src="/images/profile.png"
            alt="Profile Picture"
            width={150}
            height={150}
          />
          
                  {/* Simple Introduction Text */}
        <p className="text-center text-lg leading-relaxed text-[#d1d5db] max-w-3xl mx-auto mt-6 mb-8">
          Hey, I'm <span className="text-[#e8c547] font-semibold">Omer</span>! The dragon spirit behind <span className="text-[#e8c547] font-semibold">Bergaman</span> - blending futuristic technology with a military edge, specializing in artificial intelligence, blockchain, and full-stack development.
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg text-center hover:border-[#e8c547]/50 hover:shadow-lg hover:shadow-[#e8c547]/20 transition-all duration-300">
            <div className="text-2xl font-bold text-[#e8c547] mb-1">
              <i className="fas fa-heart text-red-500 mr-2"></i>
              1,247
            </div>
            <div className="text-sm text-gray-400">Total Likes</div>
          </div>
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg text-center hover:border-[#e8c547]/50 hover:shadow-lg hover:shadow-[#e8c547]/20 transition-all duration-300">
            <div className="text-2xl font-bold text-[#e8c547] mb-1">
              <i className="fas fa-code mr-2"></i>
              {blogPosts.length}
            </div>
            <div className="text-sm text-gray-400">Blog Posts</div>
          </div>
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg text-center hover:border-[#e8c547]/50 hover:shadow-lg hover:shadow-[#e8c547]/20 transition-all duration-300">
            <div className="text-2xl font-bold text-[#e8c547] mb-1">
              <i className="fas fa-project-diagram mr-2"></i>
              8+
            </div>
            <div className="text-sm text-gray-400">Projects</div>
          </div>
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg text-center hover:border-[#e8c547]/50 hover:shadow-lg hover:shadow-[#e8c547]/20 transition-all duration-300">
            <div className="text-2xl font-bold text-[#e8c547] mb-1">
              <i className="fas fa-calendar mr-2"></i>
              3+
            </div>
            <div className="text-sm text-gray-400">Years Coding</div>
          </div>
        </div>
      </div>

        <div className="flex flex-col gap-8 w-full">
          <section className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01] slide-in-left">
            <h2 className="text-lg font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3 bg-gradient-to-r from-[#e8c547] to-[#d4b445] bg-clip-text text-transparent">Blog</h2>
            <div className="mt-4 space-y-2">
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
                currentPosts.map((post, index) => (
                  <Link key={index} href={`/blog/${post.slug}`} className="flex justify-between items-center border border-[#3e503e] px-4 py-2 rounded-lg bg-[#0e1b12] text-sm hover:border-[#e8c547]/50 transition-colors duration-300 group cursor-pointer">
                    <span className="text-[#e8c547] group-hover:text-[#d4b445] transition-colors duration-300 truncate">
                      {post.title}
                    </span>
                    <span className="text-xs text-gray-400 ml-4 flex-shrink-0">{post.date}</span>
                  </Link>
                ))
              )}
            </div>
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(blogPosts.length / postsPerPage) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 mx-1 rounded transition-all duration-300 ${currentPage === index + 1 ? 'bg-[#e8c547] text-[#0e1b12]' : 'bg-[#0e1b12] text-[#e8c547] border border-[#e8c547] hover:border-[#e8c547]/80'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg w-full transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01] slide-in-right">
            <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3 bg-gradient-to-r from-[#e8c547] to-[#d4b445] bg-clip-text text-transparent">Featured Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] hover:border-[#e8c547]/50 transition-colors duration-300 group">
                <img 
                  src="/images/contro.png" 
                  alt="Contro Bot" 
                  className="w-full h-32 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform duration-300 cursor-pointer" 
                  onClick={() => openModal("/images/contro.png", "Contro Bot - Discord Bot Project", 0)}
                />
                <h3 className="font-bold gradient-text">Contro Bot</h3>
                <p className="text-sm text-gray-300">It is a comprehensive Discord bot that I started to develop and made improvements to during the pandemic period.</p>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] hover:border-[#e8c547]/50 transition-colors duration-300 group">
                <img 
                  src="/images/ligroup.png" 
                  alt="Ligroup" 
                  className="w-full h-32 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform duration-300 cursor-pointer" 
                  onClick={() => openModal("/images/ligroup.png", "Ligroup - Full Stack Web Application", 1)}
                />
                <h3 className="font-bold gradient-text">Ligroup</h3>
                <p className="text-sm text-gray-300">This is the first project where I stepped into full stack web development, thinking that this job cannot be done with just bots.</p>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] hover:border-[#e8c547]/50 transition-colors duration-300 group">
                <img 
                  src="/images/generative-ai.png" 
                  alt="RVC & Stable Diffusion Projects" 
                  className="w-full h-32 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform duration-300 cursor-pointer" 
                  onClick={() => openModal("/images/generative-ai.png", "RVC & Stable Diffusion AI Projects", 2)}
                />
                <h3 className="font-bold gradient-text">RVC & Stable Diffusion Projects</h3>
                <p className="text-sm text-gray-300">I developed experimental projects during the times when generative artificial intelligence was becoming popular.</p>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] hover:border-[#e8c547]/50 transition-colors duration-300 group">
                <img 
                  src="/images/iaq.jpg" 
                  alt="Indoor Air Quality IoT Project" 
                  className="w-full h-32 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform duration-300 cursor-pointer" 
                  onClick={() => openModal("/images/iaq.jpg", "Indoor Air Quality IoT Project", 3)}
                />
                <h3 className="font-bold gradient-text">Indoor Air Quality IoT Project</h3>
                <p className="text-sm text-gray-300">I made a GUI application that enables wireless data transfer and real-time monitoring of data using Arduino Uno R4 WiFi.</p>
              </div>
            </div>
          </section>

          <section className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01] slide-in-left">
            <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3 bg-gradient-to-r from-[#e8c547] to-[#d4b445] bg-clip-text text-transparent">Interests</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 text-sm">
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] hover:border-[#e8c547]/50 hover:scale-105 transition-all duration-300">AI</div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] hover:border-[#e8c547]/50 hover:scale-105 transition-all duration-300">Embedded Systems</div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] hover:border-[#e8c547]/50 hover:scale-105 transition-all duration-300">Full Stack Development</div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] hover:border-[#e8c547]/50 hover:scale-105 transition-all duration-300">Cybersecurity</div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] hover:border-[#e8c547]/50 hover:scale-105 transition-all duration-300">Robotics</div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] hover:border-[#e8c547]/50 hover:scale-105 transition-all duration-300">Blockchain</div>
            </div>
          </section>

          <section className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01] slide-in-right">
            <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3 bg-gradient-to-r from-[#e8c547] to-[#d4b445] bg-clip-text text-transparent">Skills</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center hover:border-[#e8c547]/50 transition-colors duration-300">
                <h3 className="font-bold text-[#e8c547] mb-2 text-sm">Python</h3>
                <div className="w-16 h-16 hover:scale-105 transition-transform duration-300">
                  <CircularProgressbar value={80} text={`${80}%`} styles={{
                    path: { stroke: `#e8c547`, strokeLinecap: 'round', transition: 'stroke-dashoffset 0.5s ease 0s' },
                    text: { fill: '#e8c547', fontSize: '20px' },
                    trail: { stroke: '#3e503e' }
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center hover:border-[#e8c547]/50 transition-colors duration-300">
                <h3 className="font-bold text-[#e8c547] mb-2 text-sm">JavaScript</h3>
                <div className="w-16 h-16 hover:scale-105 transition-transform duration-300">
                  <CircularProgressbar value={70} text={`${70}%`} styles={{
                    path: { stroke: `#e8c547`, strokeLinecap: 'round', transition: 'stroke-dashoffset 0.5s ease 0s' },
                    text: { fill: '#e8c547', fontSize: '20px' },
                    trail: { stroke: '#3e503e' }
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center hover:border-[#e8c547]/50 transition-colors duration-300">
                <h3 className="font-bold text-[#e8c547] mb-2 text-sm">C#</h3>
                <div className="w-16 h-16 hover:scale-105 transition-transform duration-300">
                  <CircularProgressbar value={60} text={`${60}%`} styles={{
                    path: { stroke: `#e8c547`, strokeLinecap: 'round', transition: 'stroke-dashoffset 0.5s ease 0s' },
                    text: { fill: '#e8c547', fontSize: '20px' },
                    trail: { stroke: '#3e503e' }
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center hover:border-[#e8c547]/50 transition-colors duration-300">
                <h3 className="font-bold text-[#e8c547] mb-2 text-sm">HTML & CSS</h3>
                <div className="w-16 h-16 hover:scale-105 transition-transform duration-300">
                  <CircularProgressbar value={90} text={`${90}%`} styles={{
                    path: { stroke: `#e8c547`, strokeLinecap: 'round', transition: 'stroke-dashoffset 0.5s ease 0s' },
                    text: { fill: '#e8c547', fontSize: '20px' },
                    trail: { stroke: '#3e503e' }
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center hover:border-[#e8c547]/50 transition-colors duration-300">
                <h3 className="font-bold text-[#e8c547] mb-2 text-sm">React</h3>
                <div className="w-16 h-16 hover:scale-105 transition-transform duration-300">
                  <CircularProgressbar value={75} text={`${75}%`} styles={{
                    path: { stroke: `#e8c547`, strokeLinecap: 'round', transition: 'stroke-dashoffset 0.5s ease 0s' },
                    text: { fill: '#e8c547', fontSize: '20px' },
                    trail: { stroke: '#3e503e' }
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center hover:border-[#e8c547]/50 transition-colors duration-300">
                <h3 className="font-bold text-[#e8c547] mb-2 text-sm">Node.js</h3>
                <div className="w-16 h-16 hover:scale-105 transition-transform duration-300">
                  <CircularProgressbar value={65} text={`${65}%`} styles={{
                    path: { stroke: `#e8c547`, strokeLinecap: 'round', transition: 'stroke-dashoffset 0.5s ease 0s' },
                    text: { fill: '#e8c547', fontSize: '20px' },
                    trail: { stroke: '#3e503e' }
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center hover:border-[#e8c547]/50 transition-colors duration-300">
                <h3 className="font-bold text-[#e8c547] mb-2 text-sm">SQL</h3>
                <div className="w-16 h-16 hover:scale-105 transition-transform duration-300">
                  <CircularProgressbar value={70} text={`${70}%`} styles={{
                    path: { stroke: `#e8c547`, strokeLinecap: 'round', transition: 'stroke-dashoffset 0.5s ease 0s' },
                    text: { fill: '#e8c547', fontSize: '20px' },
                    trail: { stroke: '#3e503e' }
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center hover:border-[#e8c547]/50 transition-colors duration-300">
                <h3 className="font-bold text-[#e8c547] mb-2 text-sm">Git</h3>
                <div className="w-16 h-16 hover:scale-105 transition-transform duration-300">
                  <CircularProgressbar value={85} text={`${85}%`} styles={{
                    path: { stroke: `#e8c547`, strokeLinecap: 'round', transition: 'stroke-dashoffset 0.5s ease 0s' },
                    text: { fill: '#e8c547', fontSize: '20px' },
                    trail: { stroke: '#3e503e' }
                  }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Image Modal */}
      <ImageModal
        src={modalImage?.src}
        alt={modalImage?.alt}
        isOpen={isModalOpen}
        onClose={closeModal}
        allImages={projectImages}
        currentIndex={projectImages.findIndex(img => img.src === modalImage?.src)}
      />
    </div>
  );
}
