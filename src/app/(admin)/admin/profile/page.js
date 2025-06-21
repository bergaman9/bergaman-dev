'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import ImageUpload from '@/components/ImageUpload';
import toast from 'react-hot-toast';

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: 'Bergaman',
    email: 'contact@bergaman.dev',
    bio: 'Electrical & Electronics Engineer specializing in full-stack development and AI technologies.',
    about: '',
    avatar: '/images/profile/profile.png',
    role: 'Administrator',
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        browser: true,
        comments: true,
        posts: true
      },
      showSocialInPosts: false,
      showAuthorBio: true
    },
    social: {
      github: 'https://github.com/bergaman9',
      linkedin: 'https://www.linkedin.com/in/omerguler/',
      twitter: '',
      website: 'https://bergaman.dev'
    }
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const settings = await response.json();
        if (settings.authorProfile) {
          setProfile(prev => ({
            ...prev,
            name: settings.authorProfile.name || prev.name,
            bio: settings.authorProfile.bio || prev.bio,
            about: settings.authorProfile.about || prev.about,
            avatar: settings.authorProfile.avatar || prev.avatar,
            social: settings.authorProfile.social || prev.social,
            preferences: {
              ...prev.preferences,
              showAuthorBio: settings.authorProfile.showAuthorBio !== undefined ? settings.authorProfile.showAuthorBio : prev.preferences.showAuthorBio
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Get current settings
      const settingsResponse = await fetch('/api/admin/settings');
      const currentSettings = await settingsResponse.json();

      // Update author profile in settings
      const updatedSettings = {
        ...currentSettings,
        authorProfile: {
          name: profile.name,
          bio: profile.bio,
          about: profile.about,
          avatar: profile.avatar,
          showAuthorBio: profile.preferences.showAuthorBio,
          social: profile.social
        }
      };

      // Save settings
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (imageUrl) => {
    setProfile(prev => ({
      ...prev,
      avatar: imageUrl
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'fas fa-user' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-cog' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'social', label: 'Social Links', icon: 'fas fa-share-alt' },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' }
  ];

  return (
    <>
      <Head>
        <title>Profile Settings - Bergaman Admin Panel</title>
      </Head>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-gray-400 mt-2">Manage your personal account settings and preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#0a1a0f]/30 backdrop-blur-md border border-[#3e503e]/50 rounded-lg">
          <div className="border-b border-[#3e503e]/30">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#e8c547] text-[#e8c547]'
                      : 'border-transparent text-gray-400 hover:text-[#e8c547] hover:border-[#e8c547]/50'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#e8c547] mb-4">General Information</h2>
                  
                  {/* Avatar */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={profile.avatar}
                        alt="Profile Avatar"
                        className="w-20 h-20 rounded-full border-4 border-[#e8c547] shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#e8c547] rounded-full flex items-center justify-center">
                        <i className="fas fa-crown text-[#0e1b12] text-xs"></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Profile Picture
                      </label>
                      <ImageUpload
                        onImageUpload={handleImageUpload}
                        currentImage={profile.avatar}
                        className="max-w-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300 resize-vertical"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      About Section
                      <span className="text-xs text-gray-400 ml-2">(Displayed on blog posts)</span>
                    </label>
                    <textarea
                      value={profile.about}
                      onChange={(e) => setProfile(prev => ({ ...prev, about: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300 resize-vertical"
                      placeholder="Write a detailed about section that will appear at the end of your blog posts. Leave empty to hide."
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      This content will be displayed as your author information on blog posts
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={profile.role}
                      disabled
                      className="w-full px-4 py-3 bg-[#1a2e1a]/50 border border-[#3e503e] rounded-lg text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#e8c547] mb-4">User Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Theme
                      </label>
                      <select
                        value={profile.preferences.theme}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, theme: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={profile.preferences.language}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, language: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                      >
                        <option value="en">English</option>
                        <option value="tr" disabled>Türkçe (Coming Soon)</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">
                        Turkish language support will be available in future updates
                      </p>
                    </div>
                  </div>

                  {/* Social Media Display Settings */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-[#e8c547] mb-4">Display Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[#2e3d29]/30 rounded-lg border border-[#3e503e]/30">
                        <div>
                          <h4 className="text-gray-300 font-medium">Show Social Links in Posts</h4>
                          <p className="text-sm text-gray-400">Display social media links at the end of blog posts</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={profile.preferences.showSocialInPosts || false}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            preferences: { 
                              ...prev.preferences, 
                              showSocialInPosts: e.target.checked 
                            }
                          }))}
                          className="w-5 h-5 text-[#e8c547] bg-[#0e1b12] border-[#3e503e] rounded focus:ring-[#e8c547] focus:ring-2"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#2e3d29]/30 rounded-lg border border-[#3e503e]/30">
                        <div>
                          <h4 className="text-gray-300 font-medium">Show Author Bio</h4>
                          <p className="text-sm text-gray-400">Display author bio at the end of blog posts</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={profile.preferences.showAuthorBio || true}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            preferences: { 
                              ...prev.preferences, 
                              showAuthorBio: e.target.checked 
                            }
                          }))}
                          className="w-5 h-5 text-[#e8c547] bg-[#0e1b12] border-[#3e503e] rounded focus:ring-[#e8c547] focus:ring-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#e8c547] mb-4">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between p-4 bg-[#2e3d29]/30 rounded-lg border border-[#3e503e]/30">
                        <div>
                          <h3 className="text-gray-300 font-medium capitalize">
                            {key === 'email' ? 'Email Notifications' :
                             key === 'browser' ? 'Browser Notifications' :
                             key === 'comments' ? 'Comment Notifications' :
                             'Post Notifications'}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {key === 'email' ? 'Receive notifications via email' :
                             key === 'browser' ? 'Show browser push notifications' :
                             key === 'comments' ? 'Notify when comments are posted' :
                             'Notify about new posts and updates'}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                [key]: e.target.checked
                              }
                            }
                          }))}
                          className="w-5 h-5 text-[#e8c547] bg-[#0e1b12] border-[#3e503e] rounded focus:ring-[#e8c547] focus:ring-2"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links Tab */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#e8c547] mb-4">Social Media Links</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(profile.social).map(([platform, url]) => (
                      <div key={platform}>
                        <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                          <i className={`fab fa-${platform === 'website' ? 'globe' : platform} mr-2`}></i>
                          {platform}
                        </label>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            social: { ...prev.social, [platform]: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                          placeholder={`Your ${platform} URL`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#e8c547] mb-4">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-[#2e3d29]/30 rounded-lg border border-[#3e503e]/30">
                      <h3 className="text-lg font-semibold text-[#e8c547] mb-3">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                          />
                        </div>
                        <button
                          type="button"
                          className="bg-[#e8c547] hover:bg-[#d4b445] text-[#0e1b12] px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-red-900/20 rounded-lg border border-red-500/30">
                      <h3 className="text-lg font-semibold text-red-400 mb-3">Danger Zone</h3>
                      <p className="text-gray-300 mb-4">
                        These actions are irreversible. Please be certain.
                      </p>
                      <button
                        type="button"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-[#3e503e]/30">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#e8c547] hover:bg-[#d4b445] text-[#0e1b12] px-8 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 