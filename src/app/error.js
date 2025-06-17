'use client';

// Force dynamic rendering to prevent initialization errors
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import Link from 'next/link';
import Button from './components/Button';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
          Oops!
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Something went wrong
        </h2>
        
        <p className="text-lg text-gray-400 max-w-md mx-auto">
          An unexpected error has occurred. We've been notified and are working to fix the issue.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Button variant="primary" onClick={reset}>
            <i className="fas fa-redo mr-2"></i>
            Try Again
          </Button>
          
          <Link href="/" passHref>
            <Button variant="secondary">
              <i className="fas fa-home mr-2"></i>
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 