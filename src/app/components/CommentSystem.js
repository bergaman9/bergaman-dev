"use client";

import { useState, useEffect } from 'react';

// Simple HTML sanitization function
const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function CommentSystem({ postSlug }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', message: '' });
  const [hasCommented, setHasCommented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Load comments from localStorage on component mount
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${postSlug}`);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (error) {
        console.error('Error parsing comments:', error);
        localStorage.removeItem(`comments_${postSlug}`);
      }
    }

    // Check if user has already commented on this post
    const userCommented = localStorage.getItem(`user_commented_${postSlug}`);
    if (userCommented) {
      setHasCommented(true);
    }
  }, [postSlug]);

  // Save comments to localStorage
  const saveComments = (updatedComments) => {
    localStorage.setItem(`comments_${postSlug}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!newComment.name.trim() || newComment.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!newComment.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(newComment.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!newComment.message.trim() || newComment.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    if (newComment.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (hasCommented) {
      alert('You have already commented on this post!');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Sanitize inputs
    const sanitizedComment = {
      id: Date.now(),
      name: sanitizeInput(newComment.name.trim()),
      email: sanitizeInput(newComment.email.trim()),
      message: sanitizeInput(newComment.message.trim()),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Add comment to list
    const updatedComments = [...comments, sanitizedComment];
    saveComments(updatedComments);

    // Mark user as having commented
    localStorage.setItem(`user_commented_${postSlug}`, 'true');
    setHasCommented(true);

    // Reset form
    setNewComment({ name: '', email: '', message: '' });
    setErrors({});
    setIsSubmitting(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="mt-12 bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01]">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-[#e8c547] to-[#d4b445] bg-clip-text text-transparent mb-6 flex items-center">
        <i className="fas fa-comments mr-3 text-[#e8c547]"></i>
        Comments ({comments.length})
      </h3>

      {/* Comments List */}
      <div className="space-y-4 mb-8">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-[#0e1b12] border border-[#3e503e] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#e8c547] to-[#d4b445] rounded-full flex items-center justify-center">
                    <span className="text-[#0e1b12] font-bold text-sm">
                      {comment.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-[#e8c547]" dangerouslySetInnerHTML={{ __html: comment.name }}></span>
                </div>
                <span className="text-xs text-gray-400">{comment.date}</span>
              </div>
              <p className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: comment.message }}></p>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      {!hasCommented ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="text-lg font-semibold text-[#e8c547] mb-4">Leave a Comment</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newComment.name}
                onChange={handleInputChange}
                required
                maxLength="50"
                className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                placeholder="Your name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newComment.email}
                onChange={handleInputChange}
                required
                maxLength="100"
                className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={newComment.message}
              onChange={handleInputChange}
              required
              rows={4}
              maxLength="1000"
              className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300 resize-vertical"
              placeholder="Share your thoughts..."
            />
            {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
            <p className="text-xs text-gray-500 mt-1">{newComment.message.length}/1000 characters</p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#e8c547] to-[#d4b445] text-[#0e1b12] font-semibold hover:from-[#d4b445] hover:to-[#c4a43d] transition-all duration-300 shadow-lg shadow-[#e8c547]/25 hover:shadow-xl hover:shadow-[#e8c547]/40 px-6 py-3 rounded-lg hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Posting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                Post Comment
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-6 bg-[#0e1b12] border border-[#3e503e] rounded-lg">
          <i className="fas fa-check-circle text-[#e8c547] text-2xl mb-2"></i>
          <p className="text-gray-300">
            Thank you for your comment! You have already commented on this post.
          </p>
        </div>
      )}
    </div>
  );
} 