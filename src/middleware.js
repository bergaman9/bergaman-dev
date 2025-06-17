import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { SECURITY } from './lib/constants';

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
  
  // Başlıkları ekle
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Özel durumlar - Tamamen bypass edilmesi gereken rotalar
  if (pathname === '/admin' || pathname === '/api/admin/auth') {
    return response;
  }
  
  // Session cookie'sini kontrol et
  const session = request.cookies.get(SECURITY.SESSION.COOKIE_NAME);
  
  // Cookie yoksa veya geçersizse
  if (!session || !session.value) {
    if (pathname.startsWith('/api/admin/')) {
      // API rotaları için 401 döndür
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      if (pathname.startsWith('/api/admin/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      } else {
        const url = new URL('/admin', request.url);
        return NextResponse.redirect(url);
      }
    }
    
    // Kullanıcı bilgilerini request başlıklarına ekle
    response.headers.set('x-user', payload.username);
    response.headers.set('x-user-role', payload.role);
    
    return response;
  } catch (error) {
    console.error('Middleware authentication error:', error);
    
    if (pathname.startsWith('/api/admin/')) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    } else {
      const url = new URL('/admin', request.url);
      return NextResponse.redirect(url);
    }
  }
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