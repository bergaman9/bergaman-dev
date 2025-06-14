"use client";

import { useState } from 'react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a] text-[#d1d5db] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#e8c547] mb-8">
          <i className="fas fa-webhook mr-3"></i>
          Email Webhook Test
        </h1>

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
                  className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded text-[#d1d5db] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">To</label>
                <input
                  type="text"
                  value={testData.to}
                  onChange={(e) => setTestData({...testData, to: e.target.value})}
                  className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded text-[#d1d5db] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">Subject</label>
                <input
                  type="text"
                  value={testData.subject}
                  onChange={(e) => setTestData({...testData, subject: e.target.value})}
                  className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded text-[#d1d5db] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">Text Body</label>
                <textarea
                  value={testData.text}
                  onChange={(e) => setTestData({...testData, text: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded text-[#d1d5db] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8c547] mb-2">HTML Body</label>
                <textarea
                  value={testData.html}
                  onChange={(e) => setTestData({...testData, html: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded text-[#d1d5db] text-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={testWebhook}
                disabled={loading}
                className="flex-1 bg-[#e8c547] text-[#0e1b12] px-4 py-2 rounded font-medium hover:bg-[#d4b445] transition-colors disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test JSON'}
              </button>
              
              <button
                onClick={testFormData}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Form Data'}
              </button>
            </div>
          </div>

          {/* Response */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#e8c547] mb-4">Response</h2>
            
            <div className="bg-[#0e1b12] border border-[#3e503e] rounded p-4 min-h-[400px]">
              <pre className="text-sm text-[#d1d5db] whitespace-pre-wrap overflow-auto">
                {response || 'No response yet. Click a test button to send a request.'}
              </pre>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#e8c547] mb-4">
            <i className="fas fa-info-circle mr-2"></i>
            Instructions
          </h2>
          
          <div className="space-y-4 text-sm text-[#d1d5db]">
            <div>
              <h3 className="font-semibold text-[#e8c547] mb-2">Webhook URL:</h3>
              <code className="bg-[#0e1b12] px-3 py-1 rounded text-green-400">
                {typeof window !== 'undefined' ? `${window.location.origin}/api/webhook/email` : '/api/webhook/email'}
              </code>
            </div>

            <div>
              <h3 className="font-semibold text-[#e8c547] mb-2">How it works:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>The webhook accepts both JSON and form-encoded data</li>
                <li>It extracts contact ID from subject line using pattern: [ID:contactId]</li>
                <li>If contact ID is found, it adds reply to that specific contact</li>
                <li>If no ID found, it searches by email address</li>
                <li>If no contact exists, it creates a new one</li>
                <li>Admin gets notified about new replies</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#e8c547] mb-2">Email Service Setup:</h3>
              <p className="text-gray-300">
                Configure your email service (Gmail, Outlook, etc.) to forward incoming emails to this webhook URL.
                Most email services support webhook forwarding or you can use services like Zapier, IFTTT, or email parsing services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 