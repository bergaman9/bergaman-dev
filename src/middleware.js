import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { SECURITY } from './lib/constants';
import { addSecurityHeaders } from './lib/helmet';

// Force dynamic rendering to prevent initialization errors
export const dynamic = 'force-dynamic';

// JWT token doğrulama
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(
      token, 
      new TextEncoder().encode(SECURITY.JWT.SECRET), 
      { algorithms: [SECURITY.JWT.ALGORITHM] }
    );
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Middleware fonksiyonu
export async function middleware(request) {
  // URL'den yolu al
  const { pathname } = request.nextUrl;
  
  // Yanıt oluştur
  const response = NextResponse.next();
  
  // Güvenlik başlıklarını ekle
  const securityHeaders = {
    'Content-Security-Policy': SECURITY.HEADERS.CONTENT_SECURITY_POLICY,
    'X-XSS-Protection': SECURITY.HEADERS.XSS_PROTECTION,
    'X-Frame-Options': SECURITY.HEADERS.FRAME_OPTIONS,
    'X-Content-Type-Options': SECURITY.HEADERS.CONTENT_TYPE_OPTIONS,
    'Referrer-Policy': SECURITY.HEADERS.REFERRER_POLICY,
    'Permissions-Policy': SECURITY.HEADERS.PERMISSIONS_POLICY
  };
  
  // Production ortamındaysa HSTS başlığı ekle
  if (process.env.NODE_ENV === 'production') {
    securityHeaders['Strict-Transport-Security'] = SECURITY.HEADERS.HSTS;
  }
  
  // Başlıkları ekle - NextResponse.headers kullanarak
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Admin rotası kontrolü
  const isAdminRoute = SECURITY.PROTECTED_ROUTES.ADMIN.some(route => pathname.startsWith(route));
  const isPublicRoute = SECURITY.PROTECTED_ROUTES.PUBLIC.some(route => pathname.startsWith(route));
  const isLoginPage = pathname === '/admin';
  
  // Admin rotası değilse veya public rotaysa devam et
  if (!isAdminRoute || isPublicRoute) {
    return response;
  }
  
  // Session cookie'sini kontrol et
  const session = request.cookies.get(SECURITY.SESSION.COOKIE_NAME);
  
  // Cookie yoksa veya geçersizse 
  if (!session || !session.value) {
    if (pathname.startsWith('/api/')) {
      // API rotaları için 401 döndür
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } else if (isLoginPage) {
      // Login sayfası ise devam et
      return response;
    } else {
      // Diğer admin sayfaları için login sayfasına yönlendir
      const url = new URL('/admin', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  try {
    // JWT token'ı doğrula
    const { valid, payload } = await verifyToken(session.value);
    
    if (!valid || payload.role !== 'admin') {
      // Geçersiz token veya admin rolü yoksa
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      } else if (isLoginPage) {
        // Login sayfası ise devam et
        return response;
      } else {
        // Diğer admin sayfaları için login sayfasına yönlendir
        const url = new URL('/admin', request.url);
        return NextResponse.redirect(url);
      }
    }
    
    // Kullanıcı giriş yapmış ve admin sayfasındaysa panele yönlendir
    if (isLoginPage && valid && payload.role === 'admin') {
      const url = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(url);
    }
    
    // CSRF koruması - sadece POST, PUT, DELETE istekleri için
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const csrfToken = request.headers.get('x-csrf-token');
      const expectedToken = payload.username + '-' + payload.iat;
      
      // CSRF token kontrolü (basit bir örnek, gerçek uygulamada daha güvenli bir yöntem kullanılmalıdır)
      if (!csrfToken || csrfToken !== expectedToken) {
        return NextResponse.json({ error: 'CSRF token validation failed' }, { status: 403 });
      }
    }
    
    // Kullanıcı bilgilerini request başlıklarına ekle
    response.headers.set('x-user', payload.username);
    response.headers.set('x-user-role', payload.role);
    
    return response;
  } catch (error) {
    console.error('Middleware authentication error:', error);
    
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    } else if (isLoginPage) {
      // Login sayfası ise devam et
      return response;
    } else {
      // Diğer admin sayfaları için login sayfasına yönlendir
      const url = new URL('/admin', request.url);
      return NextResponse.redirect(url);
    }
  }
}

// Middleware'in çalışacağı rotaları belirle
export const config = {
  matcher: [
    // Admin sayfaları
    '/admin/:path*',
    // Admin API rotaları
    '/api/admin/:path*',
  ],
}; 