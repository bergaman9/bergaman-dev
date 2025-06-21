import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { SECURITY } from './lib/constants';

// Force dynamic rendering to prevent initialization errors
export const dynamic = 'force-dynamic';

// JWT token doğrulama
async function verifyToken(token) {
  if (!token) {
    return { valid: false, error: 'Token not provided' };
  }
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SECURITY.JWT.SECRET),
      { algorithms: [SECURITY.JWT.ALGORITHM] }
    );
    return { valid: true, payload };
  } catch (error) {
    console.error('Token verification error:', error.message);
    return { valid: false, error: error.message };
  }
}

// Middleware fonksiyonu
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Skip middleware for static files
  if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|css|js)$/i)) {
    return response;
  }
  
  // Apply security headers to all responses
  const securityHeaders = {
    'Content-Security-Policy': SECURITY.HEADERS.CONTENT_SECURITY_POLICY,
    'X-XSS-Protection': SECURITY.HEADERS.XSS_PROTECTION,
    'X-Frame-Options': SECURITY.HEADERS.FRAME_OPTIONS,
    'X-Content-Type-Options': SECURITY.HEADERS.CONTENT_TYPE_OPTIONS,
    'Referrer-Policy': SECURITY.HEADERS.REFERRER_POLICY,
    'Permissions-Policy': SECURITY.HEADERS.PERMISSIONS_POLICY
  };

  if (process.env.NODE_ENV === 'production') {
    securityHeaders['Strict-Transport-Security'] = SECURITY.HEADERS.HSTS;
  }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  const sessionCookie = request.cookies.get(SECURITY.SESSION.COOKIE_NAME);
  const { valid, payload } = await verifyToken(sessionCookie?.value);

  const isApiRoute = pathname.startsWith('/api/admin/');
  const isAdminPage = pathname.startsWith('/admin/');

  // Check if user is not authenticated or not admin
  if (!valid || !payload || payload.role !== 'admin') {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (isAdminPage) {
      const url = new URL('/admin', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  // If valid admin, add user info to headers for downstream components
  if (valid && payload) {
    response.headers.set('x-user', payload.username);
    response.headers.set('x-user-role', payload.role);
  }

  return response;
}

// Middleware'in çalışacağı rotaları belirle - ÖNEMLİ!
export const config = {
  matcher: [
    // Sadece admin alt sayfalarında çalış, ana admin sayfası hariç
    '/admin/((?!$).*)',
    // Admin API rotalarında çalış, auth hariç
    '/api/admin/((?!auth).*)',
  ],
}; 