"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestWebhook() {
  const [testData, setTestData] = useState({
    from: 'Test User <test@example.com>',
    to: 'omerguler53@gmail.com',
    subject: 'Test Email Reply [ID:507f1f77bcf86cd799439011]',
    text: 'This is a test email reply message.',
    html: '<p>This is a test email reply message.</p>'
  });
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/check');
      if (response.ok) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAdmin(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const testWebhook = async () => {
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/webhook/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testFormData = async () => {
    setLoading(true);
    setResponse('');

    try {
      const formData = new URLSearchParams();
      formData.append('From', testData.from);
      formData.append('To', testData.to);
      formData.append('Subject', testData.subject);
      formData.append('TextBody', testData.text);
      formData.append('HtmlBody', testData.html);

      const res = await fetch('/api/webhook/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a] text-[#d1d5db] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8c547] mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a] text-[#d1d5db] pt-20 px-4">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-8 mb-8">
            <i className="fas fa-shield-alt text-4xl text-red-400 mb-4"></i>
            <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
            <p className="text-gray-300 mb-6">
              This page is restricted to administrators only. You need admin privileges to access the webhook testing interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/admin/login')}
                className="px-6 py-3 bg-[#e8c547] text-[#0e1b12] rounded-lg font-medium transition-colors"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Admin Login
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 border border-[#3e503e] rounded-lg transition-colors"
              >
                <i className="fas fa-home mr-2"></i>
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a] text-[#d1d5db] pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#e8c547] mb-2">
            <i className="fas fa-webhook mr-3"></i>
            Email Webhook Test
          </h1>
          <p className="text-gray-400">
            Test the email webhook endpoint for incoming email replies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Data Form */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#e8c547] mb-4">Test Data</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">From</label>
                <input
                  type="text"
                  value={testData.from}
                  onChange={(e) => setTestData({...testData, from: e.target.value})}
                  className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded text-[#d1d5db] text-sm focus:border-[#e8c547] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">To</label>
                <input
                  type="text"
                  value={testData.to}
                  onChange={(e) => setTestData({...testData, to: e.target.value})}
                  className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded text-[#d1d5db] text-sm focus:border-[#e8c547] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">Subject</label>
                <input
                  type="text"
                  value={testData.subject}
                  onChange={(e) => setTestData({...testData, subject: e.target.value})}
                  className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded text-[#d1d5db] text-sm focus:border-[#e8c547] focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Include [ID:contactId] in subject for testing specific contact
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">Text Body</label>
                <textarea
                  value={testData.text}
                  onChange={(e) => setTestData({...testData, text: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded text-[#d1d5db] text-sm focus:border-[#e8c547] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">HTML Body</label>
                <textarea
                  value={testData.html}
                  onChange={(e) => setTestData({...testData, html: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded text-[#d1d5db] text-sm focus:border-[#e8c547] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={testWebhook}
                disabled={loading}
                className="flex-1 bg-[#e8c547] text-[#0e1b12] px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Testing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-code mr-2"></i>
                    Test JSON
                  </>
                )}
              </button>
              
              <button
                onClick={testFormData}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Testing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-alt mr-2"></i>
                    Test Form Data
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#e8c547] mb-4">
              <i className="fas fa-terminal mr-2"></i>
              Response
            </h2>
            
            <div className="bg-[#0e1b12] border border-[#3e503e] rounded p-4 min-h-[400px] max-h-[500px] overflow-auto">
              <pre className="text-sm text-[#d1d5db] whitespace-pre-wrap">
                {response || 'No response yet. Click a test button to send a request.'}
              </pre>
            </div>
            
            {response && (
              <button
                onClick={() => setResponse('')}
                className="mt-3 text-sm text-gray-400 hover:text-[#e8c547] transition-colors"
              >
                <i className="fas fa-trash mr-1"></i>
                Clear Response
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#e8c547] mb-4">
            <i className="fas fa-info-circle mr-2"></i>
            Setup Instructions
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#e8c547] mb-3">Webhook URL:</h3>
              <div className="bg-[#0e1b12] border border-[#3e503e] rounded p-3 mb-4">
                <code className="text-green-400 text-sm break-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/api/webhook/email` : '/api/webhook/email'}
                </code>
              </div>

              <h3 className="font-semibold text-[#e8c547] mb-3">How it works:</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                <li>Accepts both JSON and form-encoded data</li>
                <li>Extracts contact ID from subject: <code className="text-green-400">[ID:contactId]</code></li>
                <li>Falls back to email-based contact lookup</li>
                <li>Creates new contacts if none exist</li>
                <li>Sends admin notifications for new replies</li>
                <li>Cleans email content (removes HTML, signatures)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#e8c547] mb-3">SendGrid Setup:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>Create SendGrid account (free tier available)</li>
                <li>Go to Settings → Inbound Parse</li>
                <li>Add your domain and webhook URL</li>
                <li>Configure MX records in your DNS</li>
                <li>Test with the form above</li>
              </ol>

              <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded">
                <p className="text-sm text-blue-300">
                  <i className="fas fa-lightbulb mr-2"></i>
                  <strong>Tip:</strong> Use a subdomain like <code>mail.yourdomain.com</code> for email parsing
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#e8c547] mb-3">Gmail Forwarding Setup:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>Gmail Settings → Forwarding and POP/IMAP</li>
                <li>Add forwarding address: <code className="text-green-400">webhook+bergaman@gmail.com</code></li>
                <li>Create filter: Subject contains <code className="text-green-400">[ID:</code></li>
                <li>Action: Forward to webhook address</li>
                <li>Test with email reply containing [ID:contactId]</li>
              </ol>

              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded">
                <p className="text-sm text-green-300">
                  <i className="fas fa-info-circle mr-2"></i>
                  <strong>Gmail Webhook URL:</strong><br/>
                  <code className="text-xs break-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/api/webhook/gmail` : '/api/webhook/gmail'}
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 