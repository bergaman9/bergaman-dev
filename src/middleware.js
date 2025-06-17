import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for admin routes, API routes, static files, and maintenance page itself
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/maintenance' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Check if maintenance mode is enabled
    const baseUrl = request.nextUrl.origin;
    const settingsResponse = await fetch(`${baseUrl}/api/admin/settings`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (settingsResponse.ok) {
      const settings = await settingsResponse.json();
      
      if (settings.maintenanceMode) {
        // Redirect to maintenance page
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error fetching settings, continue normally
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - bergaman-v2.4.0.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|bergaman-v2.4.0.ico).*)',
  ],
}; 