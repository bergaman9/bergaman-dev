"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PageHeader from '@/app/components/PageHeader';
import Card from '@/app/components/Card';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Badge from '@/app/components/Badge';

export default function ContactReply() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contact, setContact] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    email: ''
  });

  useEffect(() => {
    if (params.id) {
      fetchContact();
    }
  }, [params.id]);

  const fetchContact = async () => {
    try {
      const response = await fetch(`/api/contacts/${params.id}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setContact(data.contact);
        // Pre-fill email if available
        if (data.contact.email) {
          setFormData(prev => ({ ...prev, email: data.contact.email }));
        }
      } else {
        toast.error('Contact not found');
        router.push('/contact');
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
      toast.error('Failed to load conversation');
      router.push('/contact');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/contacts/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: params.id,
          message: formData.message,
          email: formData.email
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Reply sent successfully!');
        // Refresh the conversation
        fetchContact();
        // Clear the message
        setFormData(prev => ({ ...prev, message: '' }));
      } else {
        toast.error(data.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen page-container">
        <div className="page-content pt-4 pb-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8c547]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <div className="min-h-screen page-container">
      <div className="page-content pt-4 pb-8">
        <PageHeader
          title="Reply to Conversation"
          subtitle="Continue your conversation with the admin"
          icon="fas fa-reply"
        />

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Conversation History */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#e8c547] mb-4 flex items-center">
              <i className="fas fa-history mr-2"></i>
              Conversation History
            </h3>
            
            <div className="space-y-4">
              {/* Original Message */}
              <div className="bg-[#0e1b12]/50 rounded-lg p-4 border-l-4 border-[#e8c547]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    <i className="fas fa-user mr-2"></i>
                    {contact.name} (You)
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(contact.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-200">{contact.message}</p>
              </div>

              {/* Admin Reply */}
              {contact.adminReply && (
                <div className="bg-[#1a2e1a]/50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      <i className="fas fa-user-shield mr-2"></i>
                      Admin
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(contact.repliedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-200">{contact.adminReply}</p>
                </div>
              )}

              {/* Previous Replies */}
              {contact.replies && contact.replies.length > 0 && (
                <>
                  {contact.replies.map((reply, index) => (
                    <div
                      key={reply._id || index}
                      className={`rounded-lg p-4 border-l-4 ${
                        reply.type === 'admin'
                          ? 'bg-[#1a2e1a]/50 border-blue-500'
                          : 'bg-[#0e1b12]/50 border-[#e8c547]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">
                          <i className={`fas ${reply.type === 'admin' ? 'fa-user-shield' : 'fa-user'} mr-2`}></i>
                          {reply.type === 'admin' ? 'Admin' : `${contact.name} (You)`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-200">{reply.message}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Card>

          {/* Reply Form */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#e8c547] mb-4 flex items-center">
              <i className="fas fa-comment mr-2"></i>
              Send a Reply
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Your Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                icon="fas fa-envelope"
                required
                disabled={contact.email} // Disable if email already exists
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <i className="fas fa-message mr-2"></i>
                  Your Reply
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                  placeholder="Type your reply here..."
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  <i className="fas fa-info-circle mr-1"></i>
                  The admin will be notified of your reply
                </p>
                
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  icon="fas fa-paper-plane"
                >
                  Send Reply
                </Button>
              </div>
            </form>
          </Card>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center">
              <i className="fas fa-lightbulb mr-2"></i>
              How it works
            </h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Your reply will be added to this conversation</li>
              <li>• The admin will receive a notification in their dashboard</li>
              <li>• You can bookmark this page to check for new responses</li>
              <li>• All replies are tracked and timestamped</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 