"use client";

// Force dynamic rendering to prevent initialization errors
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function NewsletterSignup() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    preferences: {
      frequency: 'weekly',
      categories: ['tech', 'projects']
    }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [subscriberCount, setSubscriberCount] = useState(500);

  useEffect(() => {
    fetchSubscriberCount();
  }, []);

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch('/api/newsletter/stats');
      const data = await response.json();
      if (data.success) {
        setSubscriberCount(data.stats.totalSubscribers);
      }
    } catch (error) {
      console.error('Error fetching subscriber count:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSuccess(true);
      setFormData({
        email: '',
        name: '',
        preferences: {
          frequency: 'weekly',
          categories: ['tech', 'projects']
        }
      });

    } catch (error) {
      console.error('Error subscribing:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    const categories = formData.preferences.categories.includes(category)
      ? formData.preferences.categories.filter(c => c !== category)
      : [...formData.preferences.categories, category];
    
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        categories
      }
    });
  };

  return (
    <div className="page-container">
      <Head>
        <title>Newsletter Signup - Bergaman's Dragon Domain</title>
        <meta name="description" content="Subscribe to Bergaman's newsletter for AI, blockchain, and full-stack development insights." />
      </Head>
      
              <div className="page-content pt-16">
        <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e8c547] to-[#d4b445] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dragon text-3xl text-[#0e1b12]"></i>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
                Join the Dragon's Domain
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Get exclusive insights on AI, blockchain, and full-stack development
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <i className="fas fa-check text-[#4ade80] mr-2"></i>
                <span>Weekly Updates</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-[#4ade80] mr-2"></i>
                <span>No Spam</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-[#4ade80] mr-2"></i>
                <span>Unsubscribe Anytime</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-[#0a1a0f]/50 border border-[#4ade80] rounded-lg p-6 mb-8 text-center backdrop-blur-md">
              <div className="flex items-center justify-center mb-4">
                <i className="fas fa-check-circle text-4xl text-[#4ade80]"></i>
              </div>
              <h3 className="text-xl font-semibold text-[#4ade80] mb-2">Welcome to the Dragon's Domain!</h3>
              <p className="text-[#86efac]">
                Thank you for subscribing! Check your email for a welcome message.
              </p>
            </div>
          )}

          {/* Signup Form */}
          {!success && (
            <div className="bg-[#0a1a0f]/30 backdrop-blur-md border border-[#3e503e]/50 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#d1d5db] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#d1d5db] mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-[#d1d5db] mb-3">
                    Email Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['daily', 'weekly', 'monthly'].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          preferences: {...formData.preferences, frequency: freq}
                        })}
                        className={`px-4 py-3 rounded-lg border transition-colors ${
                          formData.preferences.frequency === freq
                            ? 'bg-[#e8c547] border-[#e8c547] text-[#0e1b12]'
                            : 'bg-[#0e1b12] border-[#3e503e] text-gray-300 hover:border-[#e8c547]'
                        }`}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-[#d1d5db] mb-3">
                    Content Preferences
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'tech', label: 'Tech Updates', icon: 'fas fa-code' },
                      { id: 'projects', label: 'New Projects', icon: 'fas fa-rocket' },
                      { id: 'ai', label: 'AI Insights', icon: 'fas fa-robot' },
                      { id: 'tutorials', label: 'Tutorials', icon: 'fas fa-graduation-cap' }
                    ].map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryChange(category.id)}
                        className={`px-4 py-3 rounded-lg border transition-colors flex items-center space-x-2 ${
                          formData.preferences.categories.includes(category.id)
                            ? 'bg-[#e8c547]/20 border-[#e8c547] text-[#e8c547]'
                            : 'bg-[#0e1b12] border-[#3e503e] text-gray-300 hover:border-[#e8c547]'
                        }`}
                      >
                        <i className={category.icon}></i>
                        <span>{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-center">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#e8c547] to-[#d4b445] text-[#0e1b12] rounded-lg font-medium hover:from-[#d4b445] hover:to-[#c4a435] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      <span>Subscribe to Newsletter</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Stats */}
          <div className="mt-12 text-center">
            <div className="bg-[#0a1a0f]/30 backdrop-blur-md border border-[#3e503e]/50 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#e8c547]">{subscriberCount}+</div>
                  <div className="text-sm text-gray-400">Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4ade80]">Weekly</div>
                  <div className="text-sm text-gray-400">Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#e8c547]">0%</div>
                  <div className="text-sm text-gray-400">Spam</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a1a0f]/30 backdrop-blur-md border border-[#3e503e]/50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <i className="fas fa-dragon text-2xl text-[#e8c547]"></i>
                <h3 className="text-lg font-semibold text-[#e8c547]">Exclusive Content</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Get behind-the-scenes insights into my latest projects, AI experiments, and development journey.
              </p>
            </div>
            
            <div className="bg-[#0a1a0f]/30 backdrop-blur-md border border-[#3e503e]/50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <i className="fas fa-code text-2xl text-[#4ade80]"></i>
                <h3 className="text-lg font-semibold text-[#4ade80]">Technical Deep Dives</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Detailed tutorials, code snippets, and technical analysis of cutting-edge technologies.
              </p>
            </div>
          </div>

          {/* Unsubscribe Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Already subscribed? 
              <a href="/newsletter/unsubscribe" className="text-[#e8c547] hover:text-[#d4b445] ml-1 transition-colors">
                Manage your subscription
              </a>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
} 