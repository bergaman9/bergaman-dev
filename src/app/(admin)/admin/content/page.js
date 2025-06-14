"use client";

import { useState } from 'react';
import Head from 'next/head';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Mock data - gerçek projede bu veriler backend'den gelecek
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Bergaman',
    siteDescription: 'The Dragon\'s Domain - Crafting technology inspired by the strength and wisdom of a dragon',
    siteUrl: 'https://bergaman.dev',
    adminEmail: 'admin@bergaman.dev',
    socialLinks: {
      github: 'https://github.com/bergaman9',
      linkedin: 'https://linkedin.com/in/bergaman',
      email: 'contact@bergaman.dev',
      discord: 'https://discord.gg/bergaman'
    }
  });

  const [aboutContent, setAboutContent] = useState({
    heroTitle: 'About Me',
    heroSubtitle: 'Passionate Full Stack Developer & Tech Enthusiast',
    introduction: 'Hi, I\'m Omer! My journey in the tech world began with a passion for video games...',
    skills: [
      { name: 'React/Next.js', level: 90 },
      { name: 'JavaScript/TypeScript', level: 85 },
      { name: 'Python', level: 90 },
      { name: 'C# / WPF', level: 85 }
    ]
  });

  const handleSave = async (section) => {
    setIsSaving(true);
    setSaveMessage('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSaveMessage(`${section} settings saved successfully!`);
    setIsSaving(false);

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const tabs = [
    { id: 'general', name: 'General Settings', icon: 'fas fa-cog' },
    { id: 'about', name: 'About Page', icon: 'fas fa-user' },
    { id: 'portfolio', name: 'Portfolio', icon: 'fas fa-briefcase' },
    { id: 'suggestions', name: 'Suggestions', icon: 'fas fa-star' }
  ];

  return (
    <>
      <Head>
        <title>Site Content - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text">Site Content</h1>
          <p className="text-gray-400 mt-2">Manage your website content and settings</p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg">
            <i className="fas fa-check-circle mr-2"></i>
            {saveMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden">
          <div className="flex border-b border-[#3e503e]/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#e8c547] text-[#0e1b12]'
                    : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#0e1b12]/50'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.name}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold gradient-text mb-4">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={siteSettings.siteUrl}
                      onChange={(e) => setSiteSettings({...siteSettings, siteUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={siteSettings.adminEmail}
                    onChange={(e) => setSiteSettings({...siteSettings, adminEmail: e.target.value})}
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  />
                </div>

                <h3 className="text-lg font-semibold text-[#e8c547] mt-8 mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(siteSettings.socialLinks).map(([platform, url]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                        {platform}
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          socialLinks: {...siteSettings.socialLinks, [platform]: e.target.value}
                        })}
                        className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSave('General')}
                  disabled={isSaving}
                  className="bg-[#e8c547] hover:bg-[#d4b445] text-[#0e1b12] px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <i className="fas fa-save mr-2"></i>
                      Save Changes
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* About Page Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold gradient-text mb-4">About Page Content</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={aboutContent.heroTitle}
                      onChange={(e) => setAboutContent({...aboutContent, heroTitle: e.target.value})}
                      className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hero Subtitle
                    </label>
                    <input
                      type="text"
                      value={aboutContent.heroSubtitle}
                      onChange={(e) => setAboutContent({...aboutContent, heroSubtitle: e.target.value})}
                      className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Introduction Text
                  </label>
                  <textarea
                    value={aboutContent.introduction}
                    onChange={(e) => setAboutContent({...aboutContent, introduction: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  />
                </div>

                <button
                  onClick={() => handleSave('About')}
                  disabled={isSaving}
                  className="bg-[#e8c547] hover:bg-[#d4b445] text-[#0e1b12] px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <i className="fas fa-save mr-2"></i>
                      Save Changes
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold gradient-text mb-4">Portfolio Settings</h2>
                <div className="text-center text-gray-400 py-8">
                  <i className="fas fa-tools text-4xl mb-4 block"></i>
                  <p>Portfolio management features coming soon...</p>
                </div>
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold gradient-text mb-4">Suggestions Settings</h2>
                <div className="text-center text-gray-400 py-8">
                  <i className="fas fa-tools text-4xl mb-4 block"></i>
                  <p>Suggestions management features coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 