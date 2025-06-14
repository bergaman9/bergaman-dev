"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';

export default function ContactReply() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchContact();
    }
  }, [params.id]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contacts/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Contact not found');
      }
      
      const data = await response.json();
      setContact(data.contact);
      setSenderEmail(data.contact.email);
      setSenderName(data.contact.name);
    } catch (error) {
      console.error('Error fetching contact:', error);
      setError('Contact not found or invalid link');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!replyMessage.trim() || !senderName.trim() || !senderEmail.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSending(true);
      setError('');

      const response = await fetch('/api/contacts/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: params.id,
          message: replyMessage,
          senderName,
          senderEmail
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send reply');
      }

      setSuccess(true);
      setReplyMessage('');
      
      // Refresh contact data to show new reply
      await fetchContact();

    } catch (error) {
      console.error('Error sending reply:', error);
      setError(error.message);
    } finally {
      setSending(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mb-4"></i>
          <p className="text-[#d1d5db]">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error && !contact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
          <h1 className="text-2xl font-bold text-[#d1d5db] mb-2">Invalid Link</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/contact')}
            className="px-6 py-3 bg-[#e8c547] text-[#0e1b12] rounded-lg font-medium hover:bg-[#d4b445] transition-colors"
          >
            Go to Contact Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a] text-[#d1d5db]">
      <Head>
        <title>Reply to Contact - Bergaman</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#e8c547] mb-2">
              <i className="fas fa-reply mr-3"></i>
              Reply to Conversation
            </h1>
            <p className="text-gray-400">Continue your conversation with Bergaman</p>
          </div>

          {/* Original Message */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#e8c547] mb-4">Original Message</h2>
            <div className="bg-[#0e1b12] border border-[#3e503e] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-medium text-[#d1d5db]">{contact?.name}</span>
                  <span className="text-gray-400 ml-2">{contact?.email}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {contact?.createdAt && formatDate(contact.createdAt)}
                </span>
              </div>
              <p className="text-[#d1d5db] whitespace-pre-wrap">{contact?.message}</p>
            </div>
          </div>

          {/* Conversation Thread */}
          {contact?.replies && contact.replies.length > 0 && (
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-[#e8c547] mb-4">
                <i className="fas fa-comments mr-2"></i>
                Conversation ({contact.replies.length} {contact.replies.length === 1 ? 'reply' : 'replies'})
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {contact.replies.map((reply, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-l-4 ${
                      reply.isFromAdmin 
                        ? 'bg-green-900/20 border-green-500 ml-4' 
                        : 'bg-blue-900/20 border-blue-500 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          reply.isFromAdmin ? 'text-green-400' : 'text-blue-400'
                        }`}>
                          {reply.isFromAdmin ? (
                            <>
                              <i className="fas fa-user-shield mr-1"></i>
                              Bergaman (Admin)
                            </>
                          ) : (
                            <>
                              <i className="fas fa-user mr-1"></i>
                              {reply.senderName}
                            </>
                          )}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(reply.timestamp)}
                      </span>
                    </div>
                    <p className="text-[#d1d5db] whitespace-pre-wrap">{reply.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-400 mr-3"></i>
                <span className="text-green-400 font-medium">Reply sent successfully!</span>
              </div>
            </div>
          )}

          {/* Reply Form */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#e8c547] mb-6">Send Your Reply</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#e8c547] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e8c547] mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">
                  Your Reply
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none resize-vertical"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                  <div className="flex items-center">
                    <i className="fas fa-exclamation-triangle text-red-400 mr-3"></i>
                    <span className="text-red-400">{error}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/contact')}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Contact
                </button>
                
                <button
                  type="submit"
                  disabled={sending || !replyMessage.trim()}
                  className="px-8 py-3 bg-[#e8c547] text-[#0e1b12] rounded-lg font-medium hover:bg-[#d4b445] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {sending ? (
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
            </form>
          </div>

        </div>
      </div>
    </div>
  );
} 