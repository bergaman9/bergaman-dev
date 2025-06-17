"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import PageHeader from '../../../components/PageHeader';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [expandedContact, setExpandedContact] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchContacts();
  }, [statusFilter, searchTerm, currentPage]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      console.log('Fetching contacts with params:', params.toString());
      
      const response = await fetch(`/api/admin/contacts?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);

      setContacts(data.contacts || []);
      setStatistics(data.statistics || {});
      setPagination(data.pagination || {});
      
    } catch (error) {
      console.error('Error fetching contacts:', error.message);
      console.error('Full error:', error);
      
      // Set empty data on error
      setContacts([]);
      setStatistics({});
      setPagination({});
      
      // Show user-friendly error message
      alert(`Failed to load contacts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchContacts();
      } else {
        console.error('Error updating contact status');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedContact) return;

    try {
      setSendingReply(true);
      const response = await fetch(`/api/admin/contacts/${selectedContact._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: replyMessage,
          isFromAdmin: true,
          senderName: 'Admin',
          senderEmail: 'admin@bergaman.dev'
        }),
      });

      if (response.ok) {
        setShowReplyModal(false);
        setReplyMessage('');
        setSelectedContact(null);
        fetchContacts();
        alert('Reply sent successfully!');
      } else {
        alert('Error sending reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchContacts();
      } else {
        alert('Error deleting contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'read': return 'bg-yellow-500';
      case 'replied': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return 'fas fa-envelope';
      case 'read': return 'fas fa-envelope-open';
      case 'replied': return 'fas fa-reply';
      default: return 'fas fa-question';
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

  // Filter contacts based on search and status
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchTerm || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Head>
        <title>Contact Management - Admin Panel</title>
      </Head>

      {/* Page Header */}
      <PageHeader
        title="Contact Management"
        subtitle="Manage and respond to contact form submissions"
        icon="fas fa-envelope"
        stats={[
          { label: 'Total Messages', value: statistics.total || 0 },
          { label: 'New Messages', value: statistics.new || 0 },
          { label: 'Read Messages', value: statistics.read || 0 },
          { label: 'Replied', value: statistics.replied || 0 }
        ]}
        actions={[
          {
            label: 'Refresh',
            variant: 'secondary',
            icon: 'fas fa-sync-alt',
            onClick: fetchContacts
          }
        ]}
      />

      {/* Filters */}
      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <i className="fas fa-spinner fa-spin text-2xl text-[#e8c547] mb-4"></i>
            <p className="text-gray-400">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-400">No contacts found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="space-y-4">
                {filteredContacts.map((contact) => (
                  <div key={contact._id} className="bg-[#0e1b12] border border-[#3e503e] rounded-lg p-6 hover:border-[#e8c547]/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-[#e8c547]">{contact.name}</h3>
                          <span className="text-sm text-gray-400">{contact.email}</span>
                          <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(contact.status)}`}>
                            <i className={`${getStatusIcon(contact.status)} mr-1`}></i>
                            {contact.status}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3 line-clamp-2">{contact.message}</p>
                        
                        {/* Show conversation thread if exists */}
                        {contact.replies && contact.replies.length > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-[#e8c547] font-medium">
                                <i className="fas fa-comments mr-1"></i>
                                Conversation ({contact.replies.length} {contact.replies.length === 1 ? 'reply' : 'replies'})
                              </span>
                              <button
                                onClick={() => setExpandedContact(expandedContact === contact._id ? null : contact._id)}
                                className="text-xs text-gray-400 hover:text-[#e8c547] transition-colors"
                              >
                                {expandedContact === contact._id ? 'Hide' : 'Show'} Thread
                                <i className={`fas fa-chevron-${expandedContact === contact._id ? 'up' : 'down'} ml-1`}></i>
                              </button>
                            </div>
                            
                            {/* Show latest reply preview */}
                            {!expandedContact || expandedContact !== contact._id ? (
                              <div className="bg-[#2e3d29]/50 border-l-4 border-green-500 p-3 rounded-r">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-green-400 font-medium">
                                    {contact.replies[contact.replies.length - 1].isFromAdmin ? 'Admin' : contact.replies[contact.replies.length - 1].senderName}:
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(contact.replies[contact.replies.length - 1].timestamp)}
                                  </span>
                                </div>
                                <p className="text-gray-300 text-sm line-clamp-2">{contact.replies[contact.replies.length - 1].message}</p>
                              </div>
                            ) : (
                              /* Full conversation thread */
                              <div className="space-y-3 max-h-96 overflow-y-auto">
                                {contact.replies.map((reply, index) => (
                                  <div 
                                    key={index} 
                                    className={`p-3 rounded-lg border-l-4 ${
                                      reply.isFromAdmin 
                                        ? 'bg-green-900/20 border-green-500 ml-4' 
                                        : 'bg-blue-900/20 border-blue-500 mr-4'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <span className={`text-xs font-medium ${
                                          reply.isFromAdmin ? 'text-green-400' : 'text-blue-400'
                                        }`}>
                                          {reply.isFromAdmin ? (
                                            <>
                                              <i className="fas fa-user-shield mr-1"></i>
                                              Admin
                                            </>
                                          ) : (
                                            <>
                                              <i className="fas fa-user mr-1"></i>
                                              {reply.senderName}
                                            </>
                                          )}
                                        </span>
                                        <span className="text-xs text-gray-500">{reply.senderEmail}</span>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(reply.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{reply.message}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Show legacy reply if exists and no new replies */}
                        {contact.adminReply && (!contact.replies || contact.replies.length === 0) && (
                          <div className="bg-[#2e3d29]/50 border-l-4 border-green-500 p-3 mb-3 rounded-r">
                            <div className="flex items-center mb-1">
                              <i className="fas fa-reply text-green-400 mr-2"></i>
                              <span className="text-sm text-green-400 font-medium">Your Reply:</span>
                            </div>
                            <p className="text-gray-300 text-sm line-clamp-2">{contact.adminReply}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            <i className="fas fa-calendar mr-1"></i>
                            {formatDate(contact.createdAt)}
                          </span>
                          {contact.ipAddress && (
                            <span>
                              <i className="fas fa-globe mr-1"></i>
                              {contact.ipAddress}
                            </span>
                          )}
                          {contact.location?.country && (
                            <span>
                              <i className="fas fa-map-marker-alt mr-1"></i>
                              {contact.location.city}, {contact.location.country}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setReplyMessage(contact.adminReply || '');
                            setShowReplyModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded hover:bg-[#2e3d29]/50"
                          title={contact.adminReply ? "Edit Reply" : "Reply"}
                        >
                          <i className={`fas ${contact.adminReply ? 'fa-edit' : 'fa-reply'}`}></i>
                        </button>
                        
                        <select
                          value={contact.status}
                          onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                          className="text-xs bg-[#0e1b12] border border-[#3e503e] rounded px-2 py-1 text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                        
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 rounded hover:bg-red-600/10"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-[#3e503e] flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} contacts
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#e8c547]/50"
                  >
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-400">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                    disabled={currentPage === pagination.pages}
                    className="px-3 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#e8c547]/50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#2e3d29] border border-[#3e503e] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#3e503e]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#e8c547]">
                  <i className="fas fa-reply mr-2"></i>
                  Reply to {selectedContact.name}
                </h3>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedContact(null);
                    setReplyMessage('');
                  }}
                  className="text-gray-400 hover:text-[#e8c547] transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              
              {/* Contact Info */}
              <div className="bg-[#0e1b12] border border-[#3e503e] rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-400">Name:</span>
                    <p className="text-[#d1d5db] font-medium">{selectedContact.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Email:</span>
                    <p className="text-[#d1d5db]">{selectedContact.email}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm text-gray-400">Original Message:</span>
                  <div className="mt-2 p-3 bg-[#2e3d29]/50 border-l-4 border-[#e8c547] rounded">
                    <p className="text-[#d1d5db] whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Received: {formatDate(selectedContact.createdAt)}
                  {selectedContact.repliedAt && (
                    <span className="ml-4">
                      Last replied: {formatDate(selectedContact.repliedAt)}
                    </span>
                  )}
                </div>
              </div>

              {/* Conversation Thread */}
              {selectedContact.replies && selectedContact.replies.length > 0 && (
                <div className="bg-[#0e1b12] border border-[#3e503e] rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-[#e8c547] mb-4">
                    <i className="fas fa-comments mr-2"></i>
                    Conversation Thread ({selectedContact.replies.length} {selectedContact.replies.length === 1 ? 'reply' : 'replies'})
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedContact.replies.map((reply, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border-l-4 ${
                          reply.isFromAdmin 
                            ? 'bg-green-900/20 border-green-500 ml-4' 
                            : 'bg-blue-900/20 border-blue-500 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs font-medium ${
                              reply.isFromAdmin ? 'text-green-400' : 'text-blue-400'
                            }`}>
                              {reply.isFromAdmin ? (
                                <>
                                  <i className="fas fa-user-shield mr-1"></i>
                                  Admin
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-user mr-1"></i>
                                  {reply.senderName}
                                </>
                              )}
                            </span>
                            <span className="text-xs text-gray-500">{reply.senderEmail}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-[#d1d5db] text-sm whitespace-pre-wrap">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legacy Previous Reply */}
              {selectedContact.adminReply && (!selectedContact.replies || selectedContact.replies.length === 0) && (
                <div className="bg-[#0e1b12] border border-[#3e503e] rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-[#e8c547] mb-2">Previous Reply:</h4>
                  <div className="p-3 bg-[#2e3d29]/50 border-l-4 border-green-500 rounded">
                    <p className="text-[#d1d5db] whitespace-pre-wrap">{selectedContact.adminReply}</p>
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">
                  Your Reply:
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={8}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none resize-vertical"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#3e503e] flex items-center justify-end space-x-4">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedContact(null);
                  setReplyMessage('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyMessage.trim() || sendingReply}
                className="px-6 py-2 bg-[#e8c547] text-[#0e1b12] rounded-lg font-medium hover:bg-[#d4b445] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {sendingReply ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 