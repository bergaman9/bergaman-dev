"use client";

import { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a202c] via-[#2d3748] to-[#1a202c] text-[#e2e8f0]">
      <Head>
        <title>Newsletter Signup - Bergaman's Dragon Domain</title>
        <meta name="description" content="Subscribe to Bergaman's newsletter for AI, blockchain, and full-stack development insights." />
      </Head>

      {/* Clean Grid Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a5568' fill-opacity='0.3'%3E%3Cpath d='M0 0h1v1H0V0zm20 0h1v1h-1V0zm0 20h1v1h-1v-1zM0 20h1v1H0v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dragon text-3xl text-white"></i>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
                Join the Dragon's Domain
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Get exclusive insights on AI, blockchain, and full-stack development
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <i className="fas fa-check text-green-400 mr-2"></i>
                <span>Weekly Updates</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-green-400 mr-2"></i>
                <span>No Spam</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-green-400 mr-2"></i>
                <span>Unsubscribe Anytime</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-6 mb-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <i className="fas fa-check-circle text-4xl text-green-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">Welcome to the Dragon's Domain!</h3>
              <p className="text-green-300">
                Thank you for subscribing! Check your email for a welcome message.
              </p>
            </div>
          )}

          {/* Signup Form */}
          {!success && (
            <div className="bg-[#2d3748]/30 backdrop-blur-md border border-[#4a5568]/30 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#e2e8f0] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1a202c] border border-[#4a5568] rounded-lg text-[#e2e8f0] placeholder-gray-400 focus:border-[#4f46e5] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#e2e8f0] mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1a202c] border border-[#4a5568] rounded-lg text-[#e2e8f0] placeholder-gray-400 focus:border-[#4f46e5] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-[#e2e8f0] mb-3">
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
                            ? 'bg-[#4f46e5] border-[#4f46e5] text-white'
                            : 'bg-[#1a202c] border-[#4a5568] text-gray-300 hover:border-[#4f46e5]'
                        }`}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-[#e2e8f0] mb-3">
                    Interests (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'tech', label: '💻 Tech', icon: 'fas fa-laptop-code' },
                      { id: 'blockchain', label: '⛓️ Blockchain', icon: 'fas fa-link' },
                      { id: 'ai', label: '🤖 AI/ML', icon: 'fas fa-robot' },
                      { id: 'projects', label: '🚀 Projects', icon: 'fas fa-rocket' },
                      { id: 'tutorials', label: '📚 Tutorials', icon: 'fas fa-book' }
                    ].map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryChange(category.id)}
                        className={`px-4 py-3 rounded-lg border transition-colors text-left ${
                          formData.preferences.categories.includes(category.id)
                            ? 'bg-[#4f46e5] border-[#4f46e5] text-white'
                            : 'bg-[#1a202c] border-[#4a5568] text-gray-300 hover:border-[#4f46e5]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{category.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                    <div className="flex items-center">
                      <i className="fas fa-exclamation-triangle text-red-400 mr-3"></i>
                      <span className="text-red-400">{error}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.email.trim()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white rounded-lg font-medium hover:from-[#4338ca] hover:to-[#6d28d9] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Subscribe to Newsletter
                    </>
                  )}
                </button>

                {/* Privacy Note */}
                <p className="text-xs text-gray-400 text-center">
                  By subscribing, you agree to receive emails from Bergaman. 
                  You can unsubscribe at any time. We respect your privacy and will never share your email.
                </p>
              </form>
            </div>
          )}

          {/* What You'll Get */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#2d3748]/20 border border-[#4a5568]/20 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#4f46e5]/20 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-robot text-[#4f46e5] text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-[#e2e8f0]">AI & Machine Learning</h3>
              </div>
              <p className="text-gray-400">
                Latest developments in AI, machine learning projects, and practical implementations.
              </p>
            </div>

            <div className="bg-[#2d3748]/20 border border-[#4a5568]/20 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#7c3aed]/20 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-link text-[#7c3aed] text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-[#e2e8f0]">Blockchain Development</h3>
              </div>
              <p className="text-gray-400">
                Smart contracts, DeFi protocols, and blockchain architecture insights.
              </p>
            </div>

            <div className="bg-[#2d3748]/20 border border-[#4a5568]/20 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#10b981]/20 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-code text-[#10b981] text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-[#e2e8f0]">Full-Stack Development</h3>
              </div>
              <p className="text-gray-400">
                Modern web development, frameworks, tools, and best practices.
              </p>
            </div>

            <div className="bg-[#2d3748]/20 border border-[#4a5568]/20 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#f59e0b]/20 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-rocket text-[#f59e0b] text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-[#e2e8f0]">Project Updates</h3>
              </div>
              <p className="text-gray-400">
                Behind-the-scenes looks at ongoing projects and new releases.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Join <span className="text-[#4f46e5] font-semibold">500+</span> developers already subscribed
            </p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://bergaman.dev" 
                className="text-gray-400 hover:text-[#4f46e5] transition-colors"
              >
                <i className="fas fa-globe mr-2"></i>
                Portfolio
              </a>
              <a 
                href="https://github.com/bergaman9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#4f46e5] transition-colors"
              >
                <i className="fab fa-github mr-2"></i>
                GitHub
              </a>
              <a 
                href="mailto:omerguler53@gmail.com" 
                className="text-gray-400 hover:text-[#4f46e5] transition-colors"
              >
                <i className="fas fa-envelope mr-2"></i>
                Contact
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
} 