"use client";

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Bergaman - The Dragon\'s Domain',
    siteDescription: 'Personal portfolio and blog of Ömer, Electrical & Electronics Engineer',
    adminEmail: 'omerguler53@gmail.com',
    allowComments: true,
    moderateComments: true,
    allowContactForm: true,
    maintenanceMode: false,
    analyticsEnabled: true,
    backupFrequency: 'weekly'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...settings, ...data });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mb-4"></i>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Configure your site settings and preferences</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.includes('successfully') 
            ? 'bg-green-500/20 border-green-500/30 text-green-400'
            : 'bg-red-500/20 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center space-x-2">
            <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#e8c547] mb-6 flex items-center">
            <i className="fas fa-cog mr-3"></i>
            General Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="w-full bg-[#1a2e1a]/50 border border-[#3e503e]/30 rounded-lg px-4 py-3 text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                className="w-full bg-[#1a2e1a]/50 border border-[#3e503e]/30 rounded-lg px-4 py-3 text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              rows={3}
              className="w-full bg-[#1a2e1a]/50 border border-[#3e503e]/30 rounded-lg px-4 py-3 text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
            />
          </div>
        </div>

        {/* Content Settings */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#e8c547] mb-6 flex items-center">
            <i className="fas fa-file-alt mr-3"></i>
            Content Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/30">
              <div>
                <h3 className="font-medium text-[#d1d5db]">Allow Comments</h3>
                <p className="text-sm text-gray-400">Enable comments on blog posts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowComments}
                  onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e8c547]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/30">
              <div>
                <h3 className="font-medium text-[#d1d5db]">Moderate Comments</h3>
                <p className="text-sm text-gray-400">Require approval before comments are published</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.moderateComments}
                  onChange={(e) => handleInputChange('moderateComments', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e8c547]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/30">
              <div>
                <h3 className="font-medium text-[#d1d5db]">Contact Form</h3>
                <p className="text-sm text-gray-400">Enable contact form on the website</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowContactForm}
                  onChange={(e) => handleInputChange('allowContactForm', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e8c547]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#e8c547] mb-6 flex items-center">
            <i className="fas fa-server mr-3"></i>
            System Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/30">
              <div>
                <h3 className="font-medium text-[#d1d5db]">Maintenance Mode</h3>
                <p className="text-sm text-gray-400">Put the site in maintenance mode</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/30">
              <div>
                <h3 className="font-medium text-[#d1d5db]">Analytics</h3>
                <p className="text-sm text-gray-400">Enable analytics tracking</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.analyticsEnabled}
                  onChange={(e) => handleInputChange('analyticsEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e8c547]"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Backup Frequency</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                className="w-full bg-[#1a2e1a]/50 border border-[#3e503e]/30 rounded-lg px-4 py-3 text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#e8c547] to-[#d4b445] text-[#0e1b12] px-8 py-3 rounded-lg font-semibold hover:from-[#d4b445] hover:to-[#c4a43d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 