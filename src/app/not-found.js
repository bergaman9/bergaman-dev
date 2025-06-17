'use client';

// Force dynamic rendering to prevent initialization errors
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Button from './components/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-400 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="pt-6">
          <Link href="/" passHref>
            <Button variant="primary" size="lg">
              <i className="fas fa-home mr-2"></i>
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 