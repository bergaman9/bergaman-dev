"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAdminMode } from '../../hooks/useAdminMode';
import PageHeader from '../components/PageHeader';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdminMode, exitEditMode } = useAdminMode();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mb-4"></i>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show contact form disabled message if setting is off
  if (settings && !settings.allowContactForm) {
    return (
      <div className="page-container">
        <Head>
          <title>Contact Form Disabled - Ömer</title>
          <meta name="description" content="Contact form is currently disabled." />
        </Head>

        <main className="page-content py-8">
          <section className="text-center mb-12 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 leading-tight">
              <i className="fas fa-envelope-slash mr-3"></i>
              Contact Form Disabled
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              The contact form is currently disabled. Please reach out through alternative methods.
            </p>
            
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-[#e8c547]">Alternative Contact Methods</h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-[#e8c547]/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-[#e8c547]"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="text-[#e8c547] font-semibold">Email</h3>
                    <a href="mailto:omerguler53@gmail.com" className="text-gray-300 hover:text-[#e8c547] transition-colors">
                      omerguler53@gmail.com
                    </a>
                  </div>
                </div>

                {/* GitHub */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gray-400/20 rounded-lg flex items-center justify-center">
                    <i className="fab fa-github text-gray-400"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="text-gray-400 font-semibold">GitHub</h3>
                    <a 
                      href="https://github.com/bergaman9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-gray-400 transition-colors"
                    >
                      github.com/bergaman9
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <Head>
        <title>Contact Me - Ömer | Get in Touch</title>
        <meta name="description" content="Get in touch with Ömer for questions, collaborations, or just to say hello. Always open to connecting with fellow developers and tech enthusiasts." />
        <meta name="keywords" content="contact ömer, bergaman contact, developer contact, tech collaboration, portfolio contact" />
        <meta property="og:title" content="Contact Me - Ömer | Get in Touch" />
        <meta property="og:description" content="Get in touch with Ömer for questions, collaborations, or just to say hello." />
        <meta property="og:url" content="https://bergaman.dev/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Me - Ömer | Get in Touch" />
        <meta name="twitter:description" content="Get in touch with Ömer for questions, collaborations, or just to say hello." />
        <link rel="canonical" href="https://bergaman.dev/contact" />
      </Head>

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

      <main className={`page-content py-8 ${isAdminMode ? 'pt-16' : ''}`}>
        
        {/* Page Header */}
        <PageHeader
          title="Contact Me"
          subtitle="Feel free to reach out for questions, collaborations, tech discussions, or just to say hello! I'm always excited to connect with fellow developers and tech enthusiasts."
          icon="fas fa-envelope"
          variant="large"
          centered={true}
          className="text-center mb-12 fade-in"
        />

        {/* Contact Content */}
        <section className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Let's Connect Card */}
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg slide-in-left">
              <h2 className="text-2xl font-bold mb-6 text-[#e8c547]">
                Let's Connect
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Whether you have a question about my projects, want to discuss technology, share ideas, or just want to chat - I'd love to hear from you! Drop me a message and I'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#e8c547]/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-[#e8c547]"></i>
                  </div>
                  <div>
                    <h3 className="text-[#e8c547] font-semibold">Email Me</h3>
                    <p className="text-gray-300">omerguler53@gmail.com</p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#e8c547]/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-globe text-[#e8c547]"></i>
                  </div>
                  <div>
                    <h3 className="text-[#e8c547] font-semibold">Portfolio</h3>
                    <p className="text-gray-300">bergaman.dev</p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#e8c547]/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-clock text-[#e8c547]"></i>
                  </div>
                  <div>
                    <h3 className="text-[#e8c547] font-semibold">Response Time</h3>
                    <p className="text-gray-300">Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Message Form */}
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg slide-in-right">
              <h2 className="text-2xl font-bold mb-6 text-[#e8c547]">
                Send me a Message
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-400 mr-2"></i>
                    <span className="text-green-400">Message sent successfully! I'll get back to you soon.</span>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-exclamation-circle text-red-400 mr-2"></i>
                    <span className="text-red-400">Failed to send message. Please try again.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-[#e8c547] font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-[#e8c547] font-medium mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-[#e8c547] font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Write your message..."
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#e8c547] to-[#d4b445] text-[#0e1b12] font-semibold rounded-lg hover:from-[#d4b445] hover:to-[#c4a435] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      SEND MESSAGE
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="mt-16 text-center fade-in">
          <div className="bg-[#2e3d29]/20 backdrop-blur-md border border-[#3e503e]/20 p-6 rounded-lg max-w-6xl mx-auto">
            <h3 className="text-xl font-semibold text-[#e8c547] mb-4">
              <i className="fas fa-info-circle mr-2"></i>
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
              <div>
                <p><strong className="text-gray-300">Location:</strong> Istanbul, Turkey</p>
                <p><strong className="text-gray-300">Timezone:</strong> GMT+3 (Turkey Time)</p>
              </div>
              <div>
                <p><strong className="text-gray-300">Languages:</strong> Turkish, English, German</p>
                <p><strong className="text-gray-300">Availability:</strong> Monday - Friday</p>
              </div>
              <div>
                <p><strong className="text-gray-300">Response Time:</strong> Usually within 24 hours</p>
                <p><strong className="text-gray-300">Interests:</strong> AI, IoT, Full Stack Development</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
} 