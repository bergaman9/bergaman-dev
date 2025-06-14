"use client";

import Head from 'next/head';
import Link from "next/link";
import BlogImageGenerator from "../components/BlogImageGenerator";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ImageModal from '../components/ImageModal';
import { useAdminMode } from '../../hooks/useAdminMode';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalImage, setModalImage] = useState(null);
  const { isAdminMode, exitEditMode } = useAdminMode();

  const categories = ['all', 'technology', 'ai', 'web-development', 'tutorial', 'programming'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts?published=true');
      const data = await response.json();
      
      if (data.posts) {
        // Sort posts by creation date (newest first)
        const sortedPosts = data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openModal = (imageSrc, imageAlt) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="min-h-screen text-[#d1d5db] page-container flex flex-col">
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
      
      <Head>
        <title>Blog - Bergaman | Tech Insights & Development Stories</title>
        <meta name="description" content="Explore Bergaman's blog featuring insights on web development, AI, technology trends, and programming tutorials. Stay updated with the latest in tech." />
        <meta name="keywords" content="tech blog, web development, AI, programming, tutorials, technology insights, bergaman blog" />
        <meta property="og:title" content="Blog - Bergaman | Tech Insights & Development Stories" />
        <meta property="og:description" content="Explore Bergaman's blog featuring insights on web development, AI, and technology trends." />
        <meta property="og:url" content="https://bergaman.dev/blog" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog - Bergaman | Tech Insights & Development Stories" />
        <meta name="twitter:description" content="Explore Bergaman's blog featuring insights on web development, AI, and technology trends." />
        <link rel="canonical" href="https://bergaman.dev/blog" />
      </Head>

      <main className={`page-content py-8 flex-1 ${isAdminMode ? 'pt-16' : ''}`}>
        
        {/* Page Header */}
        <section className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 leading-tight">
            <i className="fas fa-blog mr-3"></i>
            Blog
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Thoughts, tutorials, and insights from the dragon's lair
          </p>
        </section>

        {/* Search and Filter */}
        <section className="mb-8 slide-in-left">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Search Bar */}
              <div className="flex-1 relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300 text-base"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 text-sm text-gray-400">
              {filteredPosts.length === 0 ? (
                <span>No articles found matching your criteria.</span>
              ) : (
                <span>
                  Showing {filteredPosts.length} of {posts.length} posts
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid - Moodboard Layout */}
        <section className="mb-12 slide-in-right">
          {loading ? (
            <div className="text-center py-16">
              <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mb-4"></i>
              <p className="text-gray-400">Loading blog posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-400">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No posts found matching your criteria.' 
                  : 'No blog posts available yet.'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 text-[#e8c547] hover:text-[#d4b445] transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
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
                    className="glass p-4 rounded-lg block group"
                  >
                    <div className="mb-4">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal(post.image, post.title);
                          }}
                        />
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <BlogImageGenerator 
                            title={post.title} 
                            category={post.category} 
                            width={400} 
                            height={250}
                            className="w-full h-48 rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-[#e8c547]/20 text-[#e8c547] text-xs rounded-full">
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#e8c547] mb-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-3 text-sm line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
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

      </main>

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
