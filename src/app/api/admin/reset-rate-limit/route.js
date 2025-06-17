import { NextResponse } from 'next/server';

// Temporary route to reset rate limits
export async function GET() {
  // Clear all rate limit records
  if (global.rateLimitStore) {
    global.rateLimitStore.clear();
  }
  
  return NextResponse.json({ 
    success: true, 
    message: 'Rate limits have been reset' 
  });
} 