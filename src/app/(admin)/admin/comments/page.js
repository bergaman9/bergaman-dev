"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import PageHeader from '../../../components/PageHeader';
import Select from '../../../components/Select';

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState(null);
  const [filter, setFilter] = useState('all'); // all, approved, pending

  // Filter options for the Select component
  const filterOptions = [
    { value: 'all', label: 'All Comments', icon: 'fas fa-list' },
    { value: 'approved', label: 'Approved', icon: 'fas fa-check-circle' },
    { value: 'pending', label: 'Pending', icon: 'fas fa-clock' }
  ];

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/admin/comments');
      const data = await response.json();
      
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (commentId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: !currentStatus }),
      });

      if (response.ok) {
        setComments(comments.map(comment => 
          comment._id === commentId 
            ? { ...comment, approved: !currentStatus }
            : comment
        ));
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment._id !== commentId));
        setSelectedComment(null);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'approved') return comment.approved;
    if (filter === 'pending') return !comment.approved;
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getLocationString = (location) => {
    if (!location) return 'Unknown';
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.regionName) parts.push(location.regionName);
    if (location.country) parts.push(location.country);
    return parts.join(', ') || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mb-4"></i>
          <p className="text-gray-400">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Comments Management - Admin Panel</title>
      </Head>
      
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Comments Management"
          subtitle="Manage blog post comments and user interactions"
          icon="fas fa-comments"
          filter={
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Filter:</label>
              <Select
                options={filterOptions}
                value={filter}
                onChange={(value) => setFilter(value)}
                variant="primary"
                size="md"
              />
            </div>
          }
          stats={[
            { label: 'Total Comments', value: comments.length },
            { label: 'Approved', value: comments.filter(c => c.approved).length },
            { label: 'Pending', value: comments.filter(c => !c.approved).length }
          ]}
          actions={[
            {
              label: 'Refresh',
              variant: 'secondary',
              icon: 'fas fa-sync-alt',
              onClick: fetchComments
            }
          ]}
        />

        {/* Comments List */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden">
          {filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-comment-slash text-4xl text-gray-500 mb-4"></i>
              <p className="text-gray-400">No comments found</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3e503e]/30">
              {filteredComments.map((comment) => (
                <div key={comment._id} className="p-6 hover:bg-[#0e1b12]/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-[#e8c547]">{comment.name}</h3>
                        <span className="text-sm text-gray-400">{comment.email}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          comment.approved 
                            ? 'bg-green-600/20 text-green-300' 
                            : 'bg-yellow-600/20 text-yellow-300'
                        }`}>
                          {comment.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{comment.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          <i className="fas fa-calendar mr-1"></i>
                          {formatDate(comment.createdAt)}
                        </span>
                        <span>
                          <i className="fas fa-link mr-1"></i>
                          {comment.postSlug}
                        </span>
                        {comment.location && (
                          <span>
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {getLocationString(comment.location)}
                          </span>
                        )}
                        {comment.browser?.name && (
                          <span>
                            <i className="fas fa-browser mr-1"></i>
                            {comment.browser.name} {comment.browser.version}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedComment(comment)}
                        className="text-gray-400 hover:text-[#e8c547] transition-colors p-2"
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => toggleApproval(comment._id, comment.approved)}
                        className={`transition-colors p-2 ${
                          comment.approved 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-green-400 hover:text-green-300'
                        }`}
                        title={comment.approved ? 'Unapprove' : 'Approve'}
                      >
                        <i className={`fas ${comment.approved ? 'fa-eye-slash' : 'fa-check'}`}></i>
                      </button>
                      <button
                        onClick={() => deleteComment(comment._id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Details Modal */}
        {selectedComment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2e3d29] border border-[#3e503e] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold gradient-text">Comment Details</h2>
                  <button
                    onClick={() => setSelectedComment(null)}
                    className="text-gray-400 hover:text-[#e8c547] transition-colors"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Name & Email</label>
                    <p className="text-[#e8c547]">{selectedComment.name} ({selectedComment.email})</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                    <p className="text-gray-300 bg-[#0e1b12] p-3 rounded border border-[#3e503e]">
                      {selectedComment.message}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">IP Address</label>
                      <p className="text-gray-300">{selectedComment.ipAddress || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                      <p className="text-gray-300">{getLocationString(selectedComment.location)}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Browser</label>
                      <p className="text-gray-300">
                        {selectedComment.browser?.name || 'Unknown'} {selectedComment.browser?.version || ''}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Operating System</label>
                      <p className="text-gray-300">
                        {selectedComment.os?.name || 'Unknown'} {selectedComment.os?.version || ''}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Device</label>
                      <p className="text-gray-300">
                        {selectedComment.device?.type || 'Unknown'} 
                        {selectedComment.device?.vendor && ` - ${selectedComment.device.vendor}`}
                        {selectedComment.device?.model && ` ${selectedComment.device.model}`}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                      <p className="text-gray-300">{formatDate(selectedComment.createdAt)}</p>
                    </div>
                  </div>
                  
                  {selectedComment.referrer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Referrer</label>
                      <p className="text-gray-300 text-sm break-all">{selectedComment.referrer}</p>
                    </div>
                  )}
                  
                  {selectedComment.userAgent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">User Agent</label>
                      <p className="text-gray-300 text-sm break-all bg-[#0e1b12] p-2 rounded border border-[#3e503e]">
                        {selectedComment.userAgent}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 