import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { SECURITY } from './lib/constants.js';

const DEFAULT_JWT_SECRET = 'bergaman-secret-key-please-change-in-production';

function getProxyJwtSecret() {
  const secret = SECURITY.JWT.SECRET || process.env.JWT_SECRET || '';

  if (!secret || (process.env.NODE_ENV === 'production' && secret === DEFAULT_JWT_SECRET)) {
    throw new Error('JWT_SECRET is not configured securely');
  }

  return secret;
}

async function verifyToken(token) {
  if (!token) {
    return { valid: false, error: 'Token not provided' };
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(getProxyJwtSecret()),
      { algorithms: [SECURITY.JWT.ALGORITHM] }
    );

    return { valid: true, payload };
  } catch (error) {
    console.error('Token verification error:', error.message);
    return { valid: false, error: error.message };
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|css|js)$/i)) {
    return response;
  }

  if (
    process.env.NODE_ENV === 'production' &&
    (pathname.startsWith('/test-webhook') || pathname.startsWith('/admin/components-test'))
  ) {
    return new NextResponse('Not found', { status: 404 });
  }

  const securityHeaders = {
    'Content-Security-Policy': SECURITY.HEADERS.CONTENT_SECURITY_POLICY,
    'X-XSS-Protection': SECURITY.HEADERS.XSS_PROTECTION,
    'X-Frame-Options': SECURITY.HEADERS.FRAME_OPTIONS,
    'X-Content-Type-Options': SECURITY.HEADERS.CONTENT_TYPE_OPTIONS,
    'Referrer-Policy': SECURITY.HEADERS.REFERRER_POLICY,
    'Permissions-Policy': SECURITY.HEADERS.PERMISSIONS_POLICY,
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

  if (!valid || !payload || payload.role !== 'admin') {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isAdminPage) {
      const url = new URL('/admin', request.url);
      return NextResponse.redirect(url);
    }
  }

  if (valid && payload) {
    response.headers.set('x-user', payload.username);
    response.headers.set('x-user-role', payload.role);
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/((?!$).*)',
    '/api/admin/((?!auth).*)',
    '/test-webhook',
  ],
};
