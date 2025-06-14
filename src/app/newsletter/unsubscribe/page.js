"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';

export default function NewsletterUnsubscribe() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unsubscribe');
      }

      setSuccess(true);

    } catch (error) {
      console.error('Error unsubscribing:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a202c] via-[#2d3748] to-[#1a202c] text-[#e2e8f0]">
      <Head>
        <title>Unsubscribe - Bergaman's Newsletter</title>
        <meta name="description" content="Unsubscribe from Bergaman's newsletter." />
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
        <div className="max-w-md mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-unlink text-2xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] bg-clip-text text-transparent">
                Unsubscribe
              </span>
            </h1>
            <p className="text-gray-400">
              We're sorry to see you go
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <i className="fas fa-check-circle text-3xl text-green-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Successfully Unsubscribed</h3>
              <p className="text-green-300 mb-4">
                You have been removed from our newsletter list.
              </p>
              <p className="text-sm text-gray-400">
                You can always <a href="/newsletter" className="text-[#4f46e5] hover:underline">resubscribe</a> if you change your mind.
              </p>
            </div>
          )}

          {/* Unsubscribe Form */}
          {!success && (
            <div className="bg-[#2d3748]/30 backdrop-blur-md border border-[#4a5568]/30 rounded-lg p-6">
              <form onSubmit={handleUnsubscribe} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-[#e2e8f0] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a202c] border border-[#4a5568] rounded-lg text-[#e2e8f0] placeholder-gray-400 focus:border-[#ef4444] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                    required
                  />
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
                  disabled={loading || !email.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg font-medium hover:from-[#dc2626] hover:to-[#b91c1c] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Unsubscribing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-unlink mr-2"></i>
                      Unsubscribe
                    </>
                  )}
                </button>

                {/* Alternative Actions */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-400">
                    Instead of unsubscribing, you could:
                  </p>
                  <div className="space-y-2">
                    <a 
                      href="/newsletter" 
                      className="block text-[#4f46e5] hover:text-[#4338ca] transition-colors text-sm"
                    >
                      <i className="fas fa-cog mr-2"></i>
                      Update your preferences
                    </a>
                    <a 
                      href="mailto:omerguler53@gmail.com?subject=Newsletter Feedback" 
                      className="block text-[#4f46e5] hover:text-[#4338ca] transition-colors text-sm"
                    >
                      <i className="fas fa-comment mr-2"></i>
                      Send us feedback
                    </a>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <a 
              href="https://bergaman.dev" 
              className="text-gray-400 hover:text-[#4f46e5] transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Portfolio
            </a>
          </div>

        </div>
      </div>
    </div>
  );
} 