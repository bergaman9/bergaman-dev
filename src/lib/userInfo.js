import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { SECURITY } from './constants';

// Get client IP address from request
export function getClientIP(request) {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to connection remote address
  return request.ip || 'unknown';
}

// Parse User Agent string
export function parseUserAgent(userAgent) {
  if (!userAgent) {
    return {
      browser: { name: null, version: null },
      os: { name: null, version: null },
      device: { type: null, vendor: null, model: null }
    };
  }

  const result = {
    browser: { name: null, version: null },
    os: { name: null, version: null },
    device: { type: 'desktop', vendor: null, model: null }
  };

  // Browser detection
  if (userAgent.includes('Chrome')) {
    result.browser.name = 'Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    if (match) result.browser.version = match[1];
  } else if (userAgent.includes('Firefox')) {
    result.browser.name = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    if (match) result.browser.version = match[1];
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    result.browser.name = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    if (match) result.browser.version = match[1];
  } else if (userAgent.includes('Edge')) {
    result.browser.name = 'Edge';
    const match = userAgent.match(/Edge\/([0-9.]+)/);
    if (match) result.browser.version = match[1];
  }

  // OS detection
  if (userAgent.includes('Windows NT')) {
    result.os.name = 'Windows';
    const match = userAgent.match(/Windows NT ([0-9.]+)/);
    if (match) {
      const version = match[1];
      if (version === '10.0') result.os.version = '10';
      else if (version === '6.3') result.os.version = '8.1';
      else if (version === '6.2') result.os.version = '8';
      else if (version === '6.1') result.os.version = '7';
      else result.os.version = version;
    }
  } else if (userAgent.includes('Mac OS X')) {
    result.os.name = 'macOS';
    const match = userAgent.match(/Mac OS X ([0-9_]+)/);
    if (match) result.os.version = match[1].replace(/_/g, '.');
  } else if (userAgent.includes('Linux')) {
    result.os.name = 'Linux';
  } else if (userAgent.includes('Android')) {
    result.os.name = 'Android';
    const match = userAgent.match(/Android ([0-9.]+)/);
    if (match) result.os.version = match[1];
    result.device.type = 'mobile';
  } else if (userAgent.includes('iPhone')) {
    result.os.name = 'iOS';
    const match = userAgent.match(/OS ([0-9_]+)/);
    if (match) result.os.version = match[1].replace(/_/g, '.');
    result.device.type = 'mobile';
    result.device.vendor = 'Apple';
    result.device.model = 'iPhone';
  } else if (userAgent.includes('iPad')) {
    result.os.name = 'iOS';
    const match = userAgent.match(/OS ([0-9_]+)/);
    if (match) result.os.version = match[1].replace(/_/g, '.');
    result.device.type = 'tablet';
    result.device.vendor = 'Apple';
    result.device.model = 'iPad';
  }

  // Mobile detection
  if (userAgent.includes('Mobile') && !result.device.vendor) {
    result.device.type = 'mobile';
  }

  return result;
}

// Get location info from IP
export async function getLocationFromIP(ip) {
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
    return null;
  }

  try {
    // Using ip-api.com (free service, 1000 requests per month)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as`, {
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country,
        countryCode: data.countryCode,
        region: data.region,
        regionName: data.regionName,
        city: data.city,
        zip: data.zip,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org,
        as: data.as
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
}

// Get all user info
export async function getUserInfo(request) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || null;
  
  const deviceInfo = parseUserAgent(userAgent);
  const locationInfo = await getLocationFromIP(ip);
  
  return {
    ipAddress: ip,
    userAgent,
    referrer,
    ...deviceInfo,
    location: locationInfo
  };
}

/**
 * Şifre oluşturma ve doğrulama işlemleri için yardımcı fonksiyonlar
 */

/**
 * Güvenli bir şifre hash'i oluşturur (bcrypt kullanarak)
 * @param {string} password - Kullanıcı şifresi
 * @returns {Promise<string>} - Hash edilmiş şifre
 */
export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verilen şifreyi hash ile karşılaştırır
 * @param {string} password - Kontrol edilecek şifre
 * @param {string} hash - Karşılaştırılacak hash
 * @returns {Promise<boolean>} - Eşleşme durumu
 */
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * PBKDF2 ile şifre hash'i oluşturur (crypto modülü kullanarak)
 * @param {string} password - Kullanıcı şifresi
 * @param {string} salt - Tuz değeri
 * @returns {string} - Hash edilmiş şifre
 */
export function hashPasswordWithPbkdf2(password, salt) {
  return crypto.pbkdf2Sync(
    password, 
    salt, 
    SECURITY.PASSWORD.HASH_ITERATIONS, 
    SECURITY.PASSWORD.HASH_KEYLEN, 
    SECURITY.PASSWORD.HASH_DIGEST
  ).toString('hex');
}

/**
 * Rastgele bir tuz değeri oluşturur
 * @returns {string} - Tuz değeri
 */
export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Güvenli bir token oluşturur
 * @param {number} length - Token uzunluğu
 * @returns {string} - Oluşturulan token
 */
export function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Şifre güvenlik seviyesini kontrol eder
 * @param {string} password - Kontrol edilecek şifre
 * @returns {{score: number, feedback: string}} - Güvenlik skoru ve geri bildirim
 */
export function checkPasswordStrength(password) {
  let score = 0;
  const feedback = [];
  
  // Uzunluk kontrolü
  if (password.length < 8) {
    feedback.push('Şifre en az 8 karakter olmalıdır.');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }
  
  // Karakter çeşitliliği kontrolü
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Karakter çeşitliliği geri bildirimi
  if (!/[A-Z]/.test(password)) feedback.push('Büyük harf ekleyin.');
  if (!/[a-z]/.test(password)) feedback.push('Küçük harf ekleyin.');
  if (!/[0-9]/.test(password)) feedback.push('Rakam ekleyin.');
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Özel karakter ekleyin.');
  
  // Tekrar eden karakterler kontrolü
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push('Tekrar eden karakterlerden kaçının.');
  }
  
  // Yaygın şifre desenleri kontrolü
  const commonPatterns = [
    '123456', 'password', 'qwerty', 'admin', '111111', '12345678', 'abc123'
  ];
  
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score -= 2;
    feedback.push('Yaygın şifre desenleri kullanmayın.');
  }
  
  // Sonuç değerlendirmesi
  let strengthText = '';
  if (score <= 2) {
    strengthText = 'Zayıf';
  } else if (score <= 4) {
    strengthText = 'Orta';
  } else if (score <= 6) {
    strengthText = 'Güçlü';
  } else {
    strengthText = 'Çok güçlü';
  }
  
  return {
    score: Math.max(1, Math.min(5, score)), // 1-5 arası sınırla
    strength: strengthText,
    feedback: feedback.length > 0 ? feedback : ['Şifreniz güvenli görünüyor.']
  };
}

/**
 * Kullanıcı bilgilerini güvenli bir şekilde maskeler
 * @param {string} text - Maskelenecek metin
 * @param {number} visibleChars - Görünür karakter sayısı
 * @returns {string} - Maskelenmiş metin
 */
export function maskSensitiveData(text, visibleChars = 2) {
  if (!text) return '';
  
  const length = text.length;
  
  if (length <= visibleChars * 2) {
    return '*'.repeat(length);
  }
  
  const start = text.substring(0, visibleChars);
  const end = text.substring(length - visibleChars);
  const masked = '*'.repeat(Math.min(length - (visibleChars * 2), 10));
  
  return `${start}${masked}${end}`;
}

/**
 * Kullanıcı oturum bilgilerini güvenli bir şekilde kontrol eder
 * @param {Object} session - Oturum bilgileri
 * @returns {boolean} - Oturum geçerliliği
 */
export function isValidSession(session) {
  if (!session) return false;
  
  // Oturum süresi kontrolü
  if (session.exp && session.exp < Date.now()) {
    return false;
  }
  
  // Kullanıcı rolü kontrolü
  if (!session.role || session.role !== 'admin') {
    return false;
  }
  
  return true;
} 