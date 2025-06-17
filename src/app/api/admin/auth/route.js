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

// IP adresi bazlı rate limiting için hafıza içi depolama
// Not: Gerçek bir uygulamada Redis gibi bir çözüm kullanılmalıdır
const loginAttempts = new Map();
const lockedAccounts = new Map();

// Gerçek bir uygulamada bu bilgiler veritabanında saklanmalıdır
const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || 'bergaman',
  // Gerçek hash: tE0&5A3&DBb!c55dm98&
  passwordHash: '4e2e2a5c8f95f2f3e2a0a9d7d8f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0f3a2e0',
  salt: process.env.ADMIN_PASSWORD_SALT || 'bergaman-salt-please-change-in-production'
};

/**
 * Rate limiting kontrolü
 * @param {string} ip - IP adresi
 * @returns {Object} - Rate limit durumu
 */
function checkRateLimit(ip) {
  // IP bazlı giriş denemelerini kontrol et
  const attempts = loginAttempts.get(ip) || 0;
  
  // Hesap kilitli mi kontrol et
  const lockedUntil = lockedAccounts.get(ip);
  if (lockedUntil && lockedUntil > Date.now()) {
    const remainingTime = Math.ceil((lockedUntil - Date.now()) / 1000 / 60);
    return {
      allowed: false,
      message: `Too many login attempts. Account locked for ${remainingTime} minutes.`
    };
  }
  
  // Kilidi kaldır (süresi dolduysa)
  if (lockedUntil) {
    lockedAccounts.delete(ip);
  }
  
  // Maksimum deneme sayısını kontrol et
  if (attempts >= SECURITY.RATE_LIMIT.MAX_LOGIN_ATTEMPTS) {
    // Hesabı kilitle
    lockedAccounts.set(ip, Date.now() + SECURITY.RATE_LIMIT.LOCKOUT_DURATION);
    loginAttempts.delete(ip); // Deneme sayacını sıfırla
    
    return {
      allowed: false,
      message: `Too many login attempts. Account locked for ${Math.ceil(SECURITY.RATE_LIMIT.LOCKOUT_DURATION / 60000)} minutes.`
    };
  }
  
  return { allowed: true };
}

/**
 * Başarısız giriş denemesini kaydet
 * @param {string} ip - IP adresi
 */
function recordFailedAttempt(ip) {
  const attempts = loginAttempts.get(ip) || 0;
  loginAttempts.set(ip, attempts + 1);
}

/**
 * Başarılı girişte deneme sayacını sıfırla
 * @param {string} ip - IP adresi
 */
function resetAttempts(ip) {
  loginAttempts.delete(ip);
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
    .sign(new TextEncoder().encode(SECURITY.JWT.SECRET));
}

/**
 * Giriş işlemi
 */
async function handleLogin(request) {
  try {
    // IP adresini al (gerçek bir uygulamada X-Forwarded-For başlığı kontrol edilmelidir)
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    
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
    
    const { username, password } = await request.json();

    // Şifre kontrolü - hem PBKDF2 hem de bcrypt desteği için
    let isPasswordValid = false;
    
    // Kullanıcı adı kontrolü
    if (username === ADMIN_USER.username) {
      // Önce PBKDF2 ile kontrol et
      const passwordHash = hashPasswordWithPbkdf2(password, ADMIN_USER.salt);
      if (passwordHash === ADMIN_USER.passwordHash) {
        isPasswordValid = true;
      }
      
      // Eğer bcrypt ile hashlenmiş şifre varsa ve PBKDF2 kontrolü başarısız olduysa
      if (!isPasswordValid && process.env.ADMIN_BCRYPT_HASH) {
        try {
          isPasswordValid = await verifyPassword(password, process.env.ADMIN_BCRYPT_HASH);
        } catch (err) {
          console.error('Bcrypt verification error:', err);
        }
      }
    }
    
    if (isPasswordValid) {
      // Başarılı giriş - deneme sayacını sıfırla
      resetAttempts(ip, 'login');
      
      // Session için JWT oluştur
      const sessionData = {
        username: username,
        role: 'admin',
        iat: Date.now(),
        exp: Date.now() + SECURITY.SESSION.DURATION
      };
      
      // JWT token oluştur
      const token = await createToken(sessionData);
      
      // Session cookie'sini ayarla
      const response = NextResponse.json({ 
        success: true,
        message: 'Authentication successful'
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
        status: 401,
        headers: getSecurityHeadersObject()
      });
    }
    
    try {
      // JWT token'ı decode et
      const tokenParts = session.value.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // JWT payload kısmını çöz
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      
      // Session geçerliliğini kontrol et
      if (!isValidSession(payload)) {
        // Geçersiz veya süresi dolmuş token
        const response = NextResponse.json({ 
          authenticated: false, 
          error: 'Invalid or expired session'
        }, { 
          status: 401,
          headers: getSecurityHeadersObject()
        });
        
        // Geçersiz cookie'yi temizle
        response.cookies.delete(SECURITY.SESSION.COOKIE_NAME);
        return response;
      }
      
      // Session geçerli
      return NextResponse.json({ 
        authenticated: true,
        username: payload.username,
        role: payload.role
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
        status: 401,
        headers: getSecurityHeadersObject()
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

export const GET = withRateLimit(checkSession, {
  limit: SECURITY.RATE_LIMIT.API_LIMIT,
  windowMs: SECURITY.RATE_LIMIT.API_WINDOW
});

export const DELETE = withRateLimit(handleLogout, {
  limit: SECURITY.RATE_LIMIT.API_LIMIT,
  windowMs: SECURITY.RATE_LIMIT.API_WINDOW
}); 