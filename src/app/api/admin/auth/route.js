import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { SECURITY } from '@/lib/constants';
import {
  verifyPassword,
  isValidSession
} from '@/lib/userInfo';
import {
  checkIPRateLimit,
  recordFailedAttempt,
  resetAttempts,
  withRateLimit
} from '@/lib/rateLimit';
import { getSecurityHeadersObject } from '@/lib/helmet';
import { getJwtSecret, hashClientIdentifier, isTrustedMutationOrigin, normalizeClientIp, readJsonLimited, verifyAdminSession } from '@/lib/serverSecurity';
import crypto from 'crypto';
const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || 'bergaman',
  passwordHash: process.env.ADMIN_PASSWORD_HASH,
};

async function verifyAdminPassword(password) {
  if (!password) return false;

  if (!ADMIN_USER.passwordHash?.match(/^\$2[aby]\$1[12]\$/)) return false;
  return verifyPassword(password, ADMIN_USER.passwordHash);
}

/**
 * JWT token oluştur
 * @param {Object} payload - Token payload
 * @returns {Promise<string>} - JWT token
 */
async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: SECURITY.JWT.ALGORITHM })
    .setIssuedAt()
    .setIssuer('https://www.bergaman.dev')
    .setAudience('bergaman-admin')
    .setJti(crypto.randomUUID())
    .setExpirationTime(Math.floor((Date.now() + SECURITY.SESSION.DURATION) / 1000))
    .sign(new TextEncoder().encode(getJwtSecret()));
}

/**
 * Giriş işlemi
 */
async function handleLogin(request) {
  try {
    if (!isTrustedMutationOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }
    const ip = normalizeClientIp(request);
    const requestId = request.headers.get('x-vercel-id') || crypto.randomUUID();

    // Rate limiting kontrolü
    const rateLimitCheck = await checkIPRateLimit(ip, 'login');
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({
        error: rateLimitCheck.message
      }, {
        status: 429,
        headers: {
          'Retry-After': (SECURITY.RATE_LIMIT.LOCKOUT_DURATION / 1000).toString(),
          'X-RateLimit-Limit': SECURITY.RATE_LIMIT.MAX_LOGIN_ATTEMPTS.toString(),
          'X-RateLimit-Remaining': '0',
          ...getSecurityHeadersObject()
        }
      });
    }

    const { username, password } = await readJsonLimited(request, { maxBytes: 4 * 1024 });

    if (!ADMIN_USER.passwordHash?.match(/^\$2[aby]\$1[12]\$/)) {
      console.error('A bcrypt ADMIN_PASSWORD_HASH with cost 10-12 is required');
      return NextResponse.json({
        error: 'Server configuration error'
      }, {
        status: 500,
        headers: getSecurityHeadersObject()
      });
    }

    const isPasswordValid = username === ADMIN_USER.username && await verifyAdminPassword(password);

    if (isPasswordValid) {
      // Başarılı giriş - deneme sayacını sıfırla
      await resetAttempts(ip, 'login');

      // Login başarılı - console log
      console.info('Admin login result', { requestId, username, ipHash: hashClientIdentifier(ip), success: true });

      // TODO: Admin log oluşturma işlemi daha sonra eklenecek
      // Şu an middleware token kontrolü yüzünden log oluşturamıyoruz

      // Session için JWT oluştur
      const sessionData = {
        username: username,
        role: 'admin'
      };

      // JWT token oluştur
      const token = await createToken(sessionData);

      // Session cookie'sini ayarla
      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful',
        user: {
          username: username,
          role: 'admin'
        }
      }, {
        status: 200,
        headers: getSecurityHeadersObject()
      });

      response.cookies.set({
        name: SECURITY.SESSION.COOKIE_NAME,
        value: token,
        ...SECURITY.SESSION.COOKIE_OPTIONS,
        maxAge: SECURITY.SESSION.DURATION / 1000 // saniye cinsinden
      });

      return response;
    } else {
      // Başarısız giriş - deneme sayacını artır
      const record = await recordFailedAttempt(ip, 'login');
      console.warn('Admin login result', { requestId, username: String(username || '').slice(0, 80), ipHash: hashClientIdentifier(ip), success: false });

      // Kalan deneme sayısını hesapla
      const remainingAttempts = SECURITY.RATE_LIMIT.MAX_LOGIN_ATTEMPTS - record.count;

      return NextResponse.json({
        error: 'Invalid credentials',
        remainingAttempts
      }, {
        status: 401,
        headers: {
          'X-RateLimit-Limit': SECURITY.RATE_LIMIT.MAX_LOGIN_ATTEMPTS.toString(),
          'X-RateLimit-Remaining': remainingAttempts.toString(),
          ...getSecurityHeadersObject()
        }
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, {
      status: 500,
      headers: getSecurityHeadersObject()
    });
  }
}

/**
 * Oturum kontrolü
 */
async function checkSession(request) {
  try {
    // Session cookie'sini kontrol et
    const session = request.cookies.get(SECURITY.SESSION.COOKIE_NAME);

    if (!session || !session.value) {
      return NextResponse.json({ authenticated: false }, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          ...getSecurityHeadersObject()
        }
      });
    }

    try {
      const auth = await verifyAdminSession(request);
      if (!auth.valid) {
        throw new Error(auth.error || 'Invalid session');
      }

      const payload = auth.payload;

      // Session geçerliliğini kontrol et
      if (!isValidSession(payload)) {
        // Geçersiz veya süresi dolmuş token
        const response = NextResponse.json({
          authenticated: false,
          error: 'Invalid or expired session'
        }, {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            ...getSecurityHeadersObject()
          }
        });

        // Geçersiz cookie'yi temizle
        response.cookies.delete(SECURITY.SESSION.COOKIE_NAME);
        return response;
      }

      // Session geçerli
      return NextResponse.json({
        authenticated: true,
        username: payload.username,
        role: payload.role,
        expiresAt: payload.exp ? payload.exp * 1000 : null,
        user: {
          username: payload.username,
          role: payload.role || 'admin'
        }
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          ...getSecurityHeadersObject()
        }
      });
    } catch (error) {
      console.error('Token decode error:', error);

      // Geçersiz token
      const response = NextResponse.json({
        authenticated: false,
        error: 'Invalid token format'
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          ...getSecurityHeadersObject()
        }
      });

      // Geçersiz cookie'yi temizle
      response.cookies.delete(SECURITY.SESSION.COOKIE_NAME);
      return response;
    }
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ authenticated: false, error: 'Session validation failed' }, {
      status: 401,
      headers: getSecurityHeadersObject()
    });
  }
}

/**
 * Çıkış işlemi
 */
async function handleLogout(request) {
  try {
    if (!isTrustedMutationOrigin(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }
    // Session cookie'sini temizle
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, {
      status: 200,
      headers: getSecurityHeadersObject()
    });

    response.cookies.delete(SECURITY.SESSION.COOKIE_NAME);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, {
      status: 500,
      headers: getSecurityHeadersObject()
    });
  }
}

// Rate limiting ile korunan handler'lar
export const POST = withRateLimit(handleLogin, {
  limit: SECURITY.RATE_LIMIT.MAX_LOGIN_ATTEMPTS,
  windowMs: SECURITY.RATE_LIMIT.LOCKOUT_DURATION
});

export const GET = checkSession;

export const DELETE = withRateLimit(handleLogout, {
  limit: SECURITY.RATE_LIMIT.API_LIMIT,
  windowMs: SECURITY.RATE_LIMIT.API_WINDOW
});
