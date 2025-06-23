"use client";

// Force dynamic rendering to prevent initialization errors
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BlogImageGenerator from '../../components/BlogImageGenerator';
import CommentSystem from '../../components/CommentSystem';
import ImageModal from '../../components/ImageModal';
import MarkdownRenderer from '../../components/MarkdownRenderer';

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authorProfile, setAuthorProfile] = useState(null);

  useEffect(() => {
    if (params.slug) {
      fetchPost();
      loadLikes();
      fetchCommentCount();
      fetchAuthorProfile();
    }
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      // First try to find by slug in MongoDB
      const response = await fetch(`/api/posts?slug=${params.slug}`);
      const data = await response.json();
      
      if (data.posts && data.posts.length > 0) {
        const fetchedPost = data.posts[0];
        
        // Check post visibility
        if (fetchedPost.visibility === 'private') {
          // Check if user is admin
          const adminAuth = localStorage.getItem('adminAuth');
          if (adminAuth !== 'true') {
            setError('This post is private and only accessible to administrators.');
            setLoading(false);
            return;
          }
        } else if (fetchedPost.visibility === 'password') {
          // Check if password is already provided
          const savedPassword = sessionStorage.getItem(`post_password_${params.slug}`);
          if (!savedPassword || savedPassword !== fetchedPost.password) {
            setIsPasswordProtected(true);
            setPost(fetchedPost);
            setLoading(false);
            return;
          }
        } else if (fetchedPost.visibility === 'members') {
          // Check if user is a member (you can implement member authentication)
          const memberAuth = localStorage.getItem('memberAuth');
          if (!memberAuth) {
            setError('This post is only accessible to registered members. Please log in to continue.');
            setLoading(false);
            return;
          }
        }

        setPost(fetchedPost);
        setIsAuthenticated(true);
        // Increment view count
        incrementViews(fetchedPost._id);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(`/api/comments?postSlug=${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setCommentCount(data.comments?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  };

  const incrementViews = async (postId) => {
    try {
      // Only increment views if user is admin (since public API doesn't support updates)
      const adminAuth = localStorage.getItem('adminAuth');
      if (adminAuth === 'true') {
        await fetch(`/api/admin/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            views: (post?.views || 0) + 1
          })
        });
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const loadLikes = () => {
    const savedLikes = localStorage.getItem(`likes_${params.slug}`);
    const userLiked = localStorage.getItem(`liked_${params.slug}`);
    
    if (savedLikes) {
      setLikes(parseInt(savedLikes));
    }
    if (userLiked === 'true') {
      setHasLiked(true);
    }
  };

  const handleLike = async () => {
    if (hasLiked) return;

    const newLikes = likes + 1;
    setLikes(newLikes);
    setHasLiked(true);
    
    localStorage.setItem(`likes_${params.slug}`, newLikes.toString());
    localStorage.setItem(`liked_${params.slug}`, 'true');

    // Update likes in MongoDB (only if admin)
    if (post) {
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth === 'true') {
          await fetch(`/api/admin/posts/${post._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              likes: newLikes
            })
          });
        }
      } catch (error) {
        console.error('Error updating likes:', error);
      }
    }
  };

  const openModal = (imageSrc, imageAlt) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleCommentCountUpdate = (count) => {
    setCommentCount(count);
  };

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
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === post.password) {
      sessionStorage.setItem(`post_password_${params.slug}`, passwordInput);
      setIsPasswordProtected(false);
      setIsAuthenticated(true);
      setPasswordError('');
      // Increment view count after successful password entry
      incrementViews(post._id);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const fetchAuthorProfile = async () => {
    try {
      // Try to fetch settings, but don't fail if not authenticated
      const adminAuth = localStorage.getItem('adminAuth');
      if (adminAuth === 'true') {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const settings = await response.json();
          if (settings.authorProfile) {
            setAuthorProfile(settings.authorProfile);
          }
        }
      } else {
        // Set default author profile for non-admin users
        setAuthorProfile({
          name: 'Bergaman',
          about: 'Electrical & Electronics Engineer specializing in full-stack development and AI technologies.',
          avatar: '/images/profile/profile.png',
          showAuthorBio: true
        });
      }
    } catch (error) {
      console.error('Error fetching author profile:', error);
      // Set default profile on error
      setAuthorProfile({
        name: 'Bergaman',
        about: 'Electrical & Electronics Engineer specializing in full-stack development and AI technologies.',
        avatar: '/images/profile/profile.png',
        showAuthorBio: true
      });
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="text-center py-16">
            <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mb-4"></i>
            <p className="text-gray-400">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="text-center py-16">
            <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
            <h1 className="text-2xl font-bold text-gray-300 mb-4">Post Not Found</h1>
            <p className="text-gray-400 mb-8">{error || 'The requested blog post could not be found.'}</p>
            <Link
              href="/blog"
              className="btn-cyber px-6 py-3"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Password Protection Screen
  if (isPasswordProtected && post) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg">
              <i className="fas fa-lock text-4xl text-[#e8c547] mb-6"></i>
              <h1 className="text-2xl font-bold text-gray-300 mb-4">Protected Post</h1>
              <p className="text-gray-400 mb-6">This post is password protected. Please enter the password to continue.</p>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                    required
                  />
                  {passwordError && (
                    <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#e8c547] text-[#0e1b12] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b445] transition-colors duration-300"
                >
                  <i className="fas fa-unlock mr-2"></i>
                  Access Post
                </button>
              </form>
              
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only render the full post if authenticated
  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="text-center py-16">
            <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mb-4"></i>
            <p className="text-gray-400">Checking access permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#e8c547] hover:text-[#d4b445] transition-colors duration-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#e8c547]/20 text-[#e8c547] text-sm rounded-full">
              {formatCategoryName(post.category)}
            </span>
            <span className="text-gray-400">
              {formatDate(post.createdAt)}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">
              <i className="fas fa-clock mr-1"></i>
              {post.readTime ? post.readTime.replace(' read', '') : '5 min'}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            {post.description}
          </p>

          {/* Featured Image */}
          <div className="mb-8">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg cursor-pointer"
                onClick={() => openModal(post.image, post.title)}
              />
            ) : (
              <div className="cursor-pointer w-full" onClick={() => {}}>
                <BlogImageGenerator 
                  title={post.title} 
                  category={post.category} 
                  width={800} 
                  height={400} 
                  className="w-full h-64 md:h-96"
                />
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="mb-8 w-full overflow-hidden">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 sm:p-6 lg:p-8 rounded-lg w-full overflow-hidden">
            {post.content ? (
              <MarkdownRenderer content={post.content} className="w-full max-w-full overflow-hidden" />
            ) : (
              <div className="text-gray-300 leading-relaxed w-full overflow-hidden">
                <p className="mb-4 break-words">
                  This is the full content of the blog post. The content can be edited in the admin panel.
                </p>
                <p className="mb-4 break-words">
                  {post.description}
                </p>
                <p className="break-words">
                  More detailed content would go here. You can add rich text, code examples, images, and more through the admin interface.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Post Meta - Moved here */}
        <div className="flex items-center justify-between py-4 border-t border-b border-[#3e503e] mb-8">
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>
              <i className="fas fa-user mr-1"></i>
              {post.author || 'Bergaman'}
            </span>
            <span>
              <i className="fas fa-eye mr-1"></i>
              {post.views || 0} views
            </span>
            <span>
              <i className="fas fa-comments mr-1"></i>
              {commentCount} comments
            </span>
          </div>
          
          <button
            onClick={handleLike}
            disabled={hasLiked}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              hasLiked
                ? 'bg-red-600/20 text-red-400 cursor-not-allowed'
                : 'bg-red-600/10 text-red-400 hover:bg-red-600/20 hover:scale-105'
            }`}
          >
            <i className={`fas fa-heart ${hasLiked ? 'text-red-500' : ''}`}></i>
            <span>{likes || post.likes || 0}</span>
          </button>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-[#e8c547] mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#3e503e]/50 text-gray-300 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Section */}
        {(post.showAuthorBio !== false && authorProfile?.showAuthorBio !== false) && (authorProfile?.about || authorProfile?.bio) && (
          <div className="mb-12">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={authorProfile?.avatar || post.authorImage || '/images/profile/profile.png'}
                    alt={authorProfile?.name || post.author || 'Bergaman'}
                    className="w-16 h-16 rounded-full border-2 border-[#e8c547] shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-[#e8c547]">
                      {authorProfile?.name || post.author || 'Bergaman'}
                    </h3>
                    <div className="ml-2 w-5 h-5 bg-[#e8c547] rounded-full flex items-center justify-center">
                      <i className="fas fa-crown text-[#0e1b12] text-xs"></i>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {authorProfile?.about || authorProfile?.bio || 'Electrical & Electronics Engineer specializing in full-stack development and AI technologies.'}
                  </p>
                  {authorProfile?.social && (
                    <div className="flex items-center space-x-4 mt-3">
                      {authorProfile.social.github && (
                        <a href={authorProfile.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e8c547] transition-colors">
                          <i className="fab fa-github"></i>
                        </a>
                      )}
                      {authorProfile.social.linkedin && (
                        <a href={authorProfile.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e8c547] transition-colors">
                          <i className="fab fa-linkedin"></i>
                        </a>
                      )}
                      {authorProfile.social.twitter && (
                        <a href={authorProfile.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e8c547] transition-colors">
                          <i className="fab fa-twitter"></i>
                        </a>
                      )}
                      {authorProfile.social.website && (
                        <a href={authorProfile.social.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e8c547] transition-colors">
                          <i className="fas fa-globe"></i>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <CommentSystem postSlug={params.slug} onCommentCountUpdate={handleCommentCountUpdate} />
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
