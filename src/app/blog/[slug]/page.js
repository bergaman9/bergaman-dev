"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BlogImageGenerator from '../../components/BlogImageGenerator';
import CommentSystem from '../../components/CommentSystem';
import ImageModal from '../../components/ImageModal';

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    if (params.slug) {
      fetchPost();
      loadLikes();
    }
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      // First try to find by slug in MongoDB
      const response = await fetch(`/api/admin/posts?slug=${params.slug}`);
      const data = await response.json();
      
      if (data.posts && data.posts.length > 0) {
        setPost(data.posts[0]);
        // Increment view count
        incrementViews(data.posts[0]._id);
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

  const incrementViews = async (postId) => {
    try {
      await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          views: (post?.views || 0) + 1
        })
      });
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

    // Update likes in MongoDB
    if (post) {
      try {
        await fetch(`/api/admin/posts/${post._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            likes: newLikes
          })
        });
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
              {post.category}
            </span>
            <span className="text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{post.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
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
              <div className="cursor-pointer" onClick={() => {}}>
                <BlogImageGenerator 
                  title={post.title} 
                  category={post.category} 
                  width={800} 
                  height={400} 
                />
              </div>
            )}
          </div>

          {/* Post Meta */}
          <div className="flex items-center justify-between py-4 border-t border-b border-[#3e503e]">
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
                {post.comments?.length || 0} comments
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
        </header>

        {/* Article Content */}
        <article className="prose prose-lg prose-invert max-w-none mb-12">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg">
            {post.content ? (
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {post.content}
              </div>
            ) : (
              <div className="text-gray-300 leading-relaxed">
                <p className="mb-4">
                  This is the full content of the blog post. The content can be edited in the admin panel.
                </p>
                <p className="mb-4">
                  {post.description}
                </p>
                <p>
                  More detailed content would go here. You can add rich text, code examples, images, and more through the admin interface.
                </p>
              </div>
            )}
          </div>
        </article>

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

        {/* Comments Section */}
        <CommentSystem postSlug={params.slug} />
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
