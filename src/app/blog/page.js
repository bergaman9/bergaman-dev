"use client";

// Force dynamic rendering to prevent initialization errors
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ImageModal from '../components/ImageModal';
import { useAdminMode } from '../../hooks/useAdminMode';
import BlogPostCard from '../components/BlogPostCard';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import { SkeletonCard } from '../components/Skeleton';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [modalImage, setModalImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(9);
  const [totalPosts, setTotalPosts] = useState(0);
  const [settings, setSettings] = useState(null);
  const { isAdminMode, exitEditMode } = useAdminMode();
  const searchParams = useSearchParams();
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const categories = ['all', 'technology', 'ai', 'web-development', 'tutorial', 'programming'];

  // Read tag from URL on mount
  useEffect(() => {
    const tagFromUrl = searchParams.get('tag');
    if (tagFromUrl) {
      setSelectedTag(tagFromUrl);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, postsPerPage, searchTerm, selectedCategory, selectedTag]);

  const fetchSettings = async () => {
    try {
      // Skip admin settings for public blog page
      setSettings({ blogPostsPerPage: 9 });
      setPostsPerPage(9);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: postsPerPage.toString(),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedTag && { tag: selectedTag }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/posts?${params}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();

      if (data.success && data.posts) {
        // Filter out non-public posts for regular visitors (if API returns any)
        // Note: API already filters for public, but we keep this for admin/extra safety
        let visiblePosts = data.posts.filter(post => {
          if (isAdminMode) return true; // Admin can see all posts
          return post.visibility === 'public' || !post.visibility;
        });

        // Fetch comment count for each post
        const postsWithCommentCount = await Promise.all(
          visiblePosts.map(async (post) => {
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

        setPosts(postsWithCommentCount);
        setTotalPosts(data.pagination?.total || visiblePosts.length);
      } else {
        console.error('Blog API error:', data);
        setPosts([]);
        setTotalPosts(0);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search and category - removed since we're doing server-side filtering
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModal = (imageSrc, imageAlt) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const formatCategoryName = (category) => {
    switch (category) {
      case 'ai': return 'AI';
      case 'web-development': return 'Web Development';
      case 'technology': return 'Technology';
      case 'tutorial': return 'Tutorial';
      case 'programming': return 'Programming';
      case 'blockchain': return 'Blockchain';
      case 'mobile': return 'Mobile';
      case 'design': return 'Design';
      case 'all': return 'All Categories';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <PageContainer>
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

      <div className={isAdminMode ? 'pt-12' : ''}>

        {/* Page Header */}
        <PageHeader
          title="Blog"
          subtitle="Thoughts, tutorials, and insights from the dragon's lair"
          icon="fas fa-blog"
          variant="large"
          stats={[
            { label: "Posts", value: totalPosts },
            { label: "Categories", value: categories.length - 1 } // Subtract 1 for "all"
          ]}
        />

        {/* Main Content */}
        <div className="w-full">
          {/* Search and Filter */}
          <section className="mb-8 slide-in-left">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row gap-4">

                {/* Search Bar */}
                <div className="flex-1 relative">
                  <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#e8c547]"></i>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-4 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-500 focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547]/30 focus:outline-none transition-all duration-300 text-base"
                  />
                </div>

                {/* Category Filter */}
                <div className="md:w-64 relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isCategoryDropdownOpen}
                    aria-label="Filter by category"
                    className="w-full pl-12 pr-4 py-4 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547]/30 focus:outline-none transition-all duration-300 text-base text-left flex items-center justify-between"
                  >
                    <i className="fas fa-filter absolute left-4 text-[#e8c547]"></i>
                    <span className="truncate mr-2">{formatCategoryName(selectedCategory)}</span>
                    <i className={`fas fa-chevron-down text-[#e8c547] transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {isCategoryDropdownOpen && (
                    <div role="listbox" className="absolute top-full left-0 right-0 mt-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                      {categories.map(category => (
                        <button
                          key={category}
                          role="option"
                          aria-selected={selectedCategory === category}
                          onClick={() => {
                            handleCategoryChange({ target: { value: category } });
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-[#2e3d29] focus:bg-[#2e3d29] focus:outline-none transition-colors flex items-center justify-between ${selectedCategory === category ? 'text-[#e8c547] bg-[#2e3d29]/50' : 'text-[#d1d5db]'
                            }`}
                        >
                          <span>{formatCategoryName(category)}</span>
                          {selectedCategory === category && <i className="fas fa-check text-xs"></i>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Tag Filter */}
              {selectedTag && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-400">Filtering by tag:</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#e8c547]/20 text-[#e8c547] text-sm rounded-full border border-[#e8c547]/50">
                    <i className="fas fa-tag text-xs"></i>
                    #{selectedTag}
                    <button
                      onClick={() => setSelectedTag('')}
                      className="ml-1 hover:text-white transition-colors"
                      title="Clear tag filter"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Blog Posts */}
          <section className="section-spacing slide-in-right">
            {loading ? (
              <div className="card-grid card-grid-3">
                {Array.from({ length: postsPerPage }).map((_, index) => (
                  <SkeletonCard key={index} imageHeight="h-48" rows={3} />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-block p-8 bg-[#2e3d29]/30 rounded-lg border border-[#3e503e]/30">
                  <i className={`${searchTerm || selectedCategory !== 'all' ? 'fas fa-search' : 'fas fa-dragon'} text-6xl text-[#e8c547]/30 mb-4 block`}></i>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">
                    {searchTerm || selectedCategory !== 'all'
                      ? 'No posts match your filters'
                      : 'No posts in the lair yet'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || selectedCategory !== 'all'
                      ? 'Try a different search term or category.'
                      : 'New articles are being forged — check back soon.'}
                  </p>
                  {(searchTerm || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="text-[#e8c547] hover:text-[#f4d76b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 rounded px-2 py-1"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="card-grid card-grid-3">
                {posts.map(post => (
                  <div key={post._id} className="relative">
                    {isAdminMode && post.visibility !== 'public' && (
                      <div
                        className="absolute top-2 left-2 z-10 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded"
                        title={post.visibility === 'private' ? 'Private post' : 'Unlisted post'}
                      >
                        {post.visibility === 'private' ? <i className="fas fa-lock"></i> : <i className="fas fa-eye-slash"></i>}
                      </div>
                    )}
                    {isAdminMode && (
                      <div className="absolute top-2 right-2 z-10 flex gap-2">
                        <Link
                          href={`/admin/posts/${post._id}/edit`}
                          className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors"
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
            )}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <section className="mb-8 fade-in">
              <div className="flex justify-center items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className={`px-3 sm:px-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 ${currentPage === 1
                    ? 'border-[#3e503e] text-gray-500 cursor-not-allowed'
                    : 'border-[#e8c547] text-[#e8c547] hover:bg-[#e8c547] hover:text-[#0e1b12]'
                    }`}
                >
                  <i className="fas fa-chevron-left sm:mr-2"></i>
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 sm:px-3 py-2 text-gray-400">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`min-w-[2.5rem] px-3 sm:px-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 ${currentPage === page
                          ? 'bg-[#e8c547] text-[#0e1b12] border-[#e8c547]'
                          : 'border-[#3e503e] text-gray-300 hover:border-[#e8c547] hover:text-[#e8c547]'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className={`px-3 sm:px-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 ${currentPage === totalPages
                    ? 'border-[#3e503e] text-gray-500 cursor-not-allowed'
                    : 'border-[#e8c547] text-[#e8c547] hover:bg-[#e8c547] hover:text-[#0e1b12]'
                    }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <i className="fas fa-chevron-right sm:ml-2"></i>
                </button>
              </div>
              <div className="text-center mt-4 text-sm text-gray-400">
                Page {currentPage} of {totalPages} • {totalPosts} total posts
              </div>
            </section>
          )}
        </div>

        {/* Newsletter Section */}
        <section className="mb-12 fade-in">
          <div className="glass p-6 sm:p-8 rounded-lg text-center">
            <div className="mb-6">
              <i className="fas fa-dragon text-3xl text-[#e8c547] mb-3"></i>
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-3 leading-tight">
                Join the Dragon's Domain
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Weekly insights on AI, full-stack development, and project showcases — straight to your inbox.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-sm text-gray-400">
              <span className="flex items-center">
                <i className="fas fa-check text-green-400 mr-2"></i>
                Weekly Updates
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-400 mr-2"></i>
                No Spam
              </span>
              <span className="flex items-center">
                <i className="fas fa-check text-green-400 mr-2"></i>
                Unsubscribe Anytime
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/newsletter"
                className="px-6 py-3 font-medium bg-[#e8c547] text-[#0e1b12] rounded-lg hover:bg-[#d4b445] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1b12]"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Subscribe to Newsletter
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 font-medium border border-[#3e503e] rounded-lg hover:border-[#e8c547] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60"
              >
                <i className="fas fa-envelope mr-2"></i>
                Get in Touch
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
    </PageContainer>
  );
}
