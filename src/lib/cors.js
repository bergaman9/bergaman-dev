import Cors from 'cors';
import { NextResponse } from 'next/server';
import { SECURITY } from './constants';

/**
 * CORS güvenliği için yardımcı fonksiyonlar
 */

/**
 * CORS middleware için ayarları oluşturur
 * @param {Object} options - CORS ayarları
 * @returns {Object} - CORS ayarları
 */
export function getCorsOptions(options = {}) {
  return {
    origin: (origin, callback) => {
      const allowedOrigins = SECURITY.CORS.ALLOWED_ORIGINS;
      
      // Origin yoksa (aynı origin) veya izin verilen bir origin ise
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'), false);
      }
    },
    methods: SECURITY.CORS.ALLOWED_METHODS,
    allowedHeaders: SECURITY.CORS.ALLOWED_HEADERS,
    credentials: true,
    maxAge: 86400, // 24 saat
    ...options
  };
}

/**
 * CORS middleware'ini başlatır
 * @param {Object} options - CORS ayarları
 * @returns {Function} - CORS middleware
 */
export function initCorsMiddleware(options = {}) {
  return Cors(getCorsOptions(options));
}

/**
 * Next.js API route için CORS middleware
 * @param {Function} fn - API route handler
 * @param {Object} options - CORS ayarları
 * @returns {Function} - CORS ile korunan handler
 */
export function withCors(fn, options = {}) {
  const corsMiddleware = initCorsMiddleware(options);
  
  return async (req, ...args) => {
    // CORS middleware'ini çalıştır
    await new Promise((resolve, reject) => {
      corsMiddleware(req, {
        end: (res) => {
          resolve(res);
        },
        setHeader: (key, value) => {
          // NextResponse başlıklarını ayarla
          if (res && res.headers) {
            res.headers.set(key, value);
          }
        }
      }, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    }).catch((err) => {
      // CORS hatası
      console.error('CORS error:', err);
      return new NextResponse(JSON.stringify({ error: 'CORS policy violation' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
    
    // API route handler'ı çalıştır
    return fn(req, ...args);
  };
}

/**
 * Next.js API route için CORS başlıklarını ekler
 * @param {Object} response - NextResponse nesnesi
 * @param {string} origin - İstek kaynağı
 * @returns {Object} - CORS başlıkları eklenmiş NextResponse nesnesi
 */
export function addCorsHeaders(response, origin = '*') {
  const allowedOrigins = SECURITY.CORS.ALLOWED_ORIGINS;
  
  // Origin kontrolü
  if (origin !== '*' && !allowedOrigins.includes(origin)) {
    origin = allowedOrigins[0] || '*';
  }
  
  // CORS başlıklarını ekle
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', SECURITY.CORS.ALLOWED_METHODS.join(', '));
  response.headers.set('Access-Control-Allow-Headers', SECURITY.CORS.ALLOWED_HEADERS.join(', '));
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

/**
 * OPTIONS isteği için CORS yanıtı oluşturur
 * @param {Object} request - Next.js request nesnesi
 * @returns {Object} - CORS yanıtı
 */
export function handleCorsOptions(request) {
  const origin = request.headers.get('origin') || '*';
  const allowedOrigins = SECURITY.CORS.ALLOWED_ORIGINS;
  
  // Origin kontrolü
  if (origin !== '*' && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  
  // CORS başlıkları ile OPTIONS yanıtı
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': SECURITY.CORS.ALLOWED_METHODS.join(', '),
      'Access-Control-Allow-Headers': SECURITY.CORS.ALLOWED_HEADERS.join(', '),
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    }
  });
} 