import { rateLimit } from 'express-rate-limit';
import { NextResponse } from 'next/server';
import { SECURITY } from './constants';

/**
 * API rate limiting için yardımcı fonksiyonlar
 */

/**
 * Hafıza içi rate limiter store
 * Not: Gerçek bir uygulamada Redis gibi bir çözüm kullanılmalıdır
 */
const inMemoryStore = new Map();

/**
 * Next.js API route için rate limiter middleware
 * @param {Object} options - Rate limiter ayarları
 * @returns {Function} - Rate limiter middleware
 */
export function createRateLimiter(options = {}) {
  const defaultOptions = {
    limit: SECURITY.RATE_LIMIT.API_LIMIT,
    windowMs: SECURITY.RATE_LIMIT.API_WINDOW,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // IP adresini al (X-Forwarded-For başlığını kontrol et)
      return req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown-ip';
    },
    // Hafıza içi store kullan
    store: {
      increment: async (key) => {
        const currentTime = Date.now();
        const windowMs = options.windowMs || SECURITY.RATE_LIMIT.API_WINDOW;
        
        let record = inMemoryStore.get(key) || { 
          count: 0, 
          resetTime: currentTime + windowMs 
        };
        
        // Süre dolmuşsa sıfırla
        if (record.resetTime <= currentTime) {
          record = { 
            count: 0, 
            resetTime: currentTime + windowMs 
          };
        }
        
        // Sayacı artır
        record.count += 1;
        inMemoryStore.set(key, record);
        
        return record;
      },
      decrement: async (key) => {
        const record = inMemoryStore.get(key);
        if (record && record.count > 0) {
          record.count -= 1;
          inMemoryStore.set(key, record);
        }
      },
      resetKey: async (key) => {
        inMemoryStore.delete(key);
      },
      resetAll: async () => {
        inMemoryStore.clear();
      }
    }
  };
  
  // Ayarları birleştir
  const limiterOptions = {
    ...defaultOptions,
    ...options,
    store: options.store || defaultOptions.store
  };
  
  // Next.js API route için middleware
  return async function rateLimiterMiddleware(request) {
    const key = limiterOptions.keyGenerator(request);
    
    try {
      // Rate limiting kontrolü
      const record = await limiterOptions.store.increment(key);
      
      // Limit aşıldı mı kontrol et
      if (record.count > limiterOptions.limit) {
        const resetTime = record.resetTime;
        const currentTime = Date.now();
        const retryAfter = Math.ceil((resetTime - currentTime) / 1000);
        
        // 429 Too Many Requests hatası döndür
        return NextResponse.json(limiterOptions.message, { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': limiterOptions.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
          }
        });
      }
      
      // Kalan istek sayısını hesapla
      const remaining = Math.max(0, limiterOptions.limit - record.count);
      
      // Yanıt başlıklarını ayarla
      const headers = {
        'X-RateLimit-Limit': limiterOptions.limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(record.resetTime / 1000).toString()
      };
      
      // İsteğe devam et
      return null;
    } catch (error) {
      console.error('Rate limiter error:', error);
      
      // Hata durumunda isteğe devam et
      return null;
    }
  };
}

/**
 * API route handler için rate limiting wrapper
 * @param {Function} handler - API route handler
 * @param {Object} options - Rate limiter ayarları
 * @returns {Function} - Rate limiting ile korunan handler
 */
export function withRateLimit(handler, options = {}) {
  const limiter = createRateLimiter(options);
  
  return async function rateProtectedHandler(request, ...args) {
    // Rate limiting kontrolü
    const limitResult = await limiter(request);
    
    // Limit aşıldıysa hata döndür
    if (limitResult) {
      return limitResult;
    }
    
    // Limit aşılmadıysa normal handler'ı çalıştır
    return handler(request, ...args);
  };
}

/**
 * Belirli bir IP için rate limit kontrolü
 * @param {string} ip - IP adresi
 * @param {string} action - İşlem adı (örn: 'login', 'register')
 * @param {Object} options - Rate limit ayarları
 * @returns {Object} - Rate limit durumu
 */
export async function checkIPRateLimit(ip, action, options = {}) {
  const key = `${ip}:${action}`;
  const limit = options.limit || SECURITY.RATE_LIMIT.MAX_LOGIN_ATTEMPTS;
  const windowMs = options.windowMs || SECURITY.RATE_LIMIT.LOCKOUT_DURATION;
  
  let record = inMemoryStore.get(key) || { 
    count: 0, 
    resetTime: Date.now() + windowMs 
  };
  
  // Süre dolmuşsa sıfırla
  if (record.resetTime <= Date.now()) {
    record = { 
      count: 0, 
      resetTime: Date.now() + windowMs 
    };
  }
  
  // Limit aşıldı mı kontrol et
  if (record.count >= limit) {
    const remainingTime = Math.ceil((record.resetTime - Date.now()) / 1000 / 60);
    
    return {
      allowed: false,
      message: `Too many ${action} attempts. Please try again after ${remainingTime} minutes.`,
      remainingTime
    };
  }
  
  // Kalan deneme sayısını hesapla
  const remaining = Math.max(0, limit - record.count);
  
  return {
    allowed: true,
    remaining,
    limit
  };
}

/**
 * Başarısız işlem denemesini kaydet
 * @param {string} ip - IP adresi
 * @param {string} action - İşlem adı
 * @param {Object} options - Rate limit ayarları
 */
export function recordFailedAttempt(ip, action, options = {}) {
  const key = `${ip}:${action}`;
  const windowMs = options.windowMs || SECURITY.RATE_LIMIT.LOCKOUT_DURATION;
  
  let record = inMemoryStore.get(key) || { 
    count: 0, 
    resetTime: Date.now() + windowMs 
  };
  
  // Sayacı artır
  record.count += 1;
  inMemoryStore.set(key, record);
  
  return record;
}

/**
 * Başarılı işlem sonrası deneme sayacını sıfırla
 * @param {string} ip - IP adresi
 * @param {string} action - İşlem adı
 */
export function resetAttempts(ip, action) {
  const key = `${ip}:${action}`;
  inMemoryStore.delete(key);
} 