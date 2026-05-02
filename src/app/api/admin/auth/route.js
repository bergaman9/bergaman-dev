import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { SECURITY } from '@/lib/constants';
import {
  verifyPassword,
  hashPasswordWithPbkdf2,
  isValidSession
} from '@/lib/userInfo';
import {
  checkIPRateLimit,
  recordFailedAttempt,
  resetAttempts,
  withRateLimit
} from '@/lib/rateLimit';
import { getSecurityHeadersObject } from '@/lib/helmet';
import { getJwtSecret, normalizeClientIp, readJsonLimited, verifyAdminSession } from '@/lib/serverSecurity';
import crypto from 'crypto';

const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || 'admin',
  passwordHash: process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD,
  pbkdf2Hash: process.env.ADMIN_PASSWORD_PBKDF2_HASH,
  salt: process.env.ADMIN_PASSWORD_SALT
};

async function verifyAdminPassword(password) {
  if (!password) return false;

  if (ADMIN_USER.passwordHash?.startsWith('$2')) {
    return verifyPassword(password, ADMIN_USER.passwordHash);
  }

  if (ADMIN_USER.pbkdf2Hash && ADMIN_USER.salt) {
    const candidateHash = hashPasswordWithPbkdf2(password, ADMIN_USER.salt);
    const expected = Buffer.from(ADMIN_USER.pbkdf2Hash, 'hex');
    const candidate = Buffer.from(candidateHash, 'hex');
    return expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);
  }

  if (process.env.NODE_ENV !== 'production' && ADMIN_USER.passwordHash) {
    console.warn('Using plaintext ADMIN_PASSWORD fallback in development. Set ADMIN_PASSWORD_HASH before production.');
    return password === ADMIN_USER.passwordHash;
  }

  console.error('Admin password hash is not configured securely');
  return false;
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
    .setExpirationTime(Math.floor((Date.now() + SECURITY.SESSION.DURATION) / 1000))
    .sign(new TextEncoder().encode(getJwtSecret()));
}

/**
 * Giriş işlemi
 */
async function handleLogin(request) {
  try {
    const ip = normalizeClientIp(request);

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

    if (!ADMIN_USER.passwordHash && !ADMIN_USER.pbkdf2Hash) {
      console.error('Admin password hash environment variable is not set');
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
      resetAttempts(ip, 'login');

      // Login başarılı - console log
      console.info(`Admin login successful for ${username} at ${new Date().toISOString()}`);

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
      const record = recordFailedAttempt(ip, 'login');

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
