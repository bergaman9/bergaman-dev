"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminNewsletter() {
  const [activeTab, setActiveTab] = useState('subscribers');
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Campaign creation state
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [campaignData, setCampaignData] = useState({
    title: '',
    subject: '',
    content: '',
    contentType: 'markdown',
    targetAudience: {
      status: 'active',
      categories: [],
      frequency: 'all'
    },
    template: {
      settings: {
        headerColor: '#4f46e5',
        accentColor: '#e8c547',
        includeHeader: true,
        includeFooter: true
      }
    }
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'subscribers') {
        await fetchSubscribers();
      } else if (activeTab === 'campaigns') {
        await fetchCampaigns();
      }
      
      await fetchStatistics();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/subscribers');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers || []);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/stats');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data.statistics || {});
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (response.ok) {
        setShowCreateCampaign(false);
        setCampaignData({
          title: '',
          subject: '',
          content: '',
          contentType: 'markdown',
          targetAudience: {
            status: 'active',
            categories: [],
            frequency: 'all'
          },
          template: {
            settings: {
              headerColor: '#4f46e5',
              accentColor: '#e8c547',
              includeHeader: true,
              includeFooter: true
            }
          }
        });
        await fetchCampaigns();
        alert('Campaign created successfully!');
      } else {
        alert('Error creating campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign');
    }
  };

  const handleSendCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to send this campaign to all subscribers?')) return;

    try {
      const response = await fetch(`/api/admin/newsletter/campaigns/${campaignId}/send`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchCampaigns();
        alert('Campaign sent successfully!');
      } else {
        alert('Error sending campaign');
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Error sending campaign');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'unsubscribed': return 'bg-red-500';
      case 'bounced': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'sending': return 'bg-purple-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen text-[#e2e8f0]">
      <Head>
        <title>Newsletter Management - Admin Panel</title>
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#e8c547] mb-2">
            <i className="fas fa-newspaper mr-3"></i>
            Newsletter Management
          </h1>
          <p className="text-gray-400">
            Manage subscribers and create newsletter campaigns
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1e1b4b]/30 backdrop-blur-md border border-[#4f46e5]/30 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Subscribers</p>
                <p className="text-2xl font-bold text-[#e8c547]">{statistics.totalSubscribers || 0}</p>
              </div>
              <i className="fas fa-users text-2xl text-[#e8c547]"></i>
            </div>
          </div>

          <div className="bg-[#1e1b4b]/30 backdrop-blur-md border border-[#4f46e5]/30 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Subscribers</p>
                <p className="text-2xl font-bold text-green-400">{statistics.activeSubscribers || 0}</p>
              </div>
              <i className="fas fa-user-check text-2xl text-green-400"></i>
            </div>
          </div>

          <div className="bg-[#1e1b4b]/30 backdrop-blur-md border border-[#4f46e5]/30 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Campaigns Sent</p>
                <p className="text-2xl font-bold text-blue-400">{statistics.campaignsSent || 0}</p>
              </div>
              <i className="fas fa-paper-plane text-2xl text-blue-400"></i>
            </div>
          </div>

          <div className="bg-[#1e1b4b]/30 backdrop-blur-md border border-[#4f46e5]/30 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Open Rate</p>
                <p className="text-2xl font-bold text-purple-400">{statistics.openRate || '0%'}</p>
              </div>
              <i className="fas fa-envelope-open text-2xl text-purple-400"></i>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#1e1b4b]/30 backdrop-blur-md border border-[#4f46e5]/30 rounded-lg mb-8">
          <div className="flex border-b border-[#4f46e5]/30">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'subscribers'
                  ? 'text-[#e8c547] border-b-2 border-[#e8c547]'
                  : 'text-gray-400 hover:text-[#e8c547]'
              }`}
            >
              <i className="fas fa-users mr-2"></i>
              Subscribers
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'campaigns'
                  ? 'text-[#e8c547] border-b-2 border-[#e8c547]'
                  : 'text-gray-400 hover:text-[#e8c547]'
              }`}
            >
              <i className="fas fa-newspaper mr-2"></i>
              Campaigns
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-2xl text-[#e8c547] mb-4"></i>
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : (
              <>
                {/* Subscribers Tab */}
                {activeTab === 'subscribers' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-[#e8c547]">Newsletter Subscribers</h2>
                      <button
                        onClick={() => window.open('/newsletter', '_blank')}
                        className="px-4 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-colors"
                      >
                        <i className="fas fa-external-link-alt mr-2"></i>
                        View Signup Page
                      </button>
                    </div>

                    {subscribers.length === 0 ? (
                      <div className="text-center py-8">
                        <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-400">No subscribers yet</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[#4f46e5]/30">
                              <th className="text-left py-3 px-4 text-gray-400">Email</th>
                              <th className="text-left py-3 px-4 text-gray-400">Name</th>
                              <th className="text-left py-3 px-4 text-gray-400">Status</th>
                              <th className="text-left py-3 px-4 text-gray-400">Subscribed</th>
                              <th className="text-left py-3 px-4 text-gray-400">Source</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subscribers.map((subscriber) => (
                              <tr key={subscriber._id} className="border-b border-[#4f46e5]/10 hover:bg-[#4f46e5]/5">
                                <td className="py-3 px-4 text-[#e2e8f0]">{subscriber.email}</td>
                                <td className="py-3 px-4 text-[#e2e8f0]">{subscriber.name || '-'}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(subscriber.status)}`}>
                                    {subscriber.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-gray-400">{formatDate(subscriber.subscribedAt)}</td>
                                <td className="py-3 px-4 text-gray-400">{subscriber.source}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Campaigns Tab */}
                {activeTab === 'campaigns' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-[#e8c547]">Newsletter Campaigns</h2>
                      <button
                        onClick={() => setShowCreateCampaign(true)}
                        className="px-4 py-2 bg-[#e8c547] text-[#1e1b4b] rounded-lg hover:bg-[#d4b445] transition-colors font-medium"
                      >
                        <i className="fas fa-plus mr-2"></i>
                        Create Campaign
                      </button>
                    </div>

                    {campaigns.length === 0 ? (
                      <div className="text-center py-8">
                        <i className="fas fa-newspaper text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-400">No campaigns created yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {campaigns.map((campaign) => (
                          <div key={campaign._id} className="bg-[#312e81]/20 border border-[#4f46e5]/20 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-[#e8c547] mb-1">{campaign.title}</h3>
                                <p className="text-gray-400 mb-2">{campaign.subject}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>
                                    <i className="fas fa-calendar mr-1"></i>
                                    {formatDate(campaign.createdAt)}
                                  </span>
                                  <span>
                                    <i className="fas fa-users mr-1"></i>
                                    {campaign.recipients?.total || 0} recipients
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(campaign.status)}`}>
                                  {campaign.status}
                                </span>
                                {campaign.status === 'draft' && (
                                  <button
                                    onClick={() => handleSendCampaign(campaign._id)}
                                    className="px-3 py-1 bg-[#4f46e5] text-white rounded text-xs hover:bg-[#4338ca] transition-colors"
                                  >
                                    <i className="fas fa-paper-plane mr-1"></i>
                                    Send
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {campaign.status === 'sent' && (
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-green-400">{campaign.recipients?.sent || 0}</div>
                                  <div className="text-gray-400">Sent</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-blue-400">{campaign.recipients?.opened || 0}</div>
                                  <div className="text-gray-400">Opened</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-purple-400">{campaign.recipients?.clicked || 0}</div>
                                  <div className="text-gray-400">Clicked</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-red-400">{campaign.recipients?.failed || 0}</div>
                                  <div className="text-gray-400">Failed</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Create Campaign Modal */}
        {showCreateCampaign && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e1b4b] border border-[#4f46e5]/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-[#4f46e5]/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#e8c547]">
                    <i className="fas fa-plus mr-2"></i>
                    Create Newsletter Campaign
                  </h3>
                  <button
                    onClick={() => setShowCreateCampaign(false)}
                    className="text-gray-400 hover:text-[#e8c547] transition-colors"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#e8c547] mb-2">
                      Campaign Title
                    </label>
                    <input
                      type="text"
                      value={campaignData.title}
                      onChange={(e) => setCampaignData({...campaignData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-[#312e81]/20 border border-[#4f46e5]/30 rounded-lg text-[#e2e8f0] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none"
                      placeholder="Enter campaign title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#e8c547] mb-2">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={campaignData.subject}
                      onChange={(e) => setCampaignData({...campaignData, subject: e.target.value})}
                      className="w-full px-4 py-3 bg-[#312e81]/20 border border-[#4f46e5]/30 rounded-lg text-[#e2e8f0] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none"
                      placeholder="Enter email subject"
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-[#e8c547] mb-2">
                    Content (Markdown Supported)
                  </label>
                  <textarea
                    value={campaignData.content}
                    onChange={(e) => setCampaignData({...campaignData, content: e.target.value})}
                    placeholder="Write your newsletter content here... You can use Markdown formatting."
                    rows={12}
                    className="w-full px-4 py-3 bg-[#312e81]/20 border border-[#4f46e5]/30 rounded-lg text-[#e2e8f0] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none resize-vertical"
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <h4 className="text-lg font-semibold text-[#e8c547] mb-4">Target Audience</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Subscriber Status
                      </label>
                      <select
                        value={campaignData.targetAudience.status}
                        onChange={(e) => setCampaignData({
                          ...campaignData,
                          targetAudience: {...campaignData.targetAudience, status: e.target.value}
                        })}
                        className="w-full px-4 py-3 bg-[#312e81]/20 border border-[#4f46e5]/30 rounded-lg text-[#e2e8f0] focus:border-[#e8c547]/50 focus:outline-none"
                      >
                        <option value="active">Active Only</option>
                        <option value="all">All Subscribers</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-[#4f46e5]/30 flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowCreateCampaign(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  disabled={!campaignData.title || !campaignData.subject || !campaignData.content}
                  className="px-6 py-2 bg-[#e8c547] text-[#1e1b4b] rounded-lg font-medium hover:bg-[#d4b445] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-save mr-2"></i>
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
} 