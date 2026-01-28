import helmet from 'helmet';
import { SECURITY } from './constants';

/**
 * Helmet güvenlik başlıkları için yardımcı fonksiyonlar
 */

/**
 * Helmet güvenlik başlıklarını oluşturur
 * @returns {Object} - Helmet güvenlik başlıkları
 */
export function getHelmetHeaders() {
  return {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://*.vercel-insights.com"]
      }
    },
    xssFilter: true,
    frameguard: {
      action: 'sameorigin'
    },
    noSniff: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    },
    hsts: process.env.NODE_ENV === 'production' ? {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    } : false,
    permissionsPolicy: {
      features: {
        camera: [],
        microphone: [],
        geolocation: []
      }
    }
  };
}

/**
 * Next.js API route için güvenlik başlıkları ekler
 * @param {Object} headers - Response başlıkları
 * @returns {Object} - Güvenlik başlıkları eklenmiş response başlıkları
 */
export function addSecurityHeaders(headers) {
  // Content Security Policy
  headers.set('Content-Security-Policy', SECURITY.HEADERS.CONTENT_SECURITY_POLICY);

  // XSS Koruması
  headers.set('X-XSS-Protection', SECURITY.HEADERS.XSS_PROTECTION);

  // Clickjacking Koruması
  headers.set('X-Frame-Options', SECURITY.HEADERS.FRAME_OPTIONS);

  // MIME Sniffing Koruması
  headers.set('X-Content-Type-Options', SECURITY.HEADERS.CONTENT_TYPE_OPTIONS);

  // Referrer Policy
  headers.set('Referrer-Policy', SECURITY.HEADERS.REFERRER_POLICY);

  // HSTS (sadece production ortamında)
  if (process.env.NODE_ENV === 'production') {
    headers.set('Strict-Transport-Security', SECURITY.HEADERS.HSTS);
  }

  // Permissions Policy
  headers.set('Permissions-Policy', SECURITY.HEADERS.PERMISSIONS_POLICY);

  return headers;
}

/**
 * Next.js API route için güvenlik başlıkları nesnesi oluşturur
 * @returns {Object} - Güvenlik başlıkları nesnesi
 */
export function getSecurityHeadersObject() {
  const headers = {};

  // Content Security Policy
  headers['Content-Security-Policy'] = SECURITY.HEADERS.CONTENT_SECURITY_POLICY;

  // XSS Koruması
  headers['X-XSS-Protection'] = SECURITY.HEADERS.XSS_PROTECTION;

  // Clickjacking Koruması
  headers['X-Frame-Options'] = SECURITY.HEADERS.FRAME_OPTIONS;

  // MIME Sniffing Koruması
  headers['X-Content-Type-Options'] = SECURITY.HEADERS.CONTENT_TYPE_OPTIONS;

  // Referrer Policy
  headers['Referrer-Policy'] = SECURITY.HEADERS.REFERRER_POLICY;

  // HSTS (sadece production ortamında)
  if (process.env.NODE_ENV === 'production') {
    headers['Strict-Transport-Security'] = SECURITY.HEADERS.HSTS;
  }

  // Permissions Policy
  headers['Permissions-Policy'] = SECURITY.HEADERS.PERMISSIONS_POLICY;

  return headers;
}

/**
 * API yanıtı için güvenlik başlıkları ekler
 * @param {Object} response - NextResponse nesnesi
 * @returns {Object} - Güvenlik başlıkları eklenmiş NextResponse nesnesi
 */
export function addSecurityHeadersToResponse(response) {
  response.headers = addSecurityHeaders(response.headers);
  return response;
}

/**
 * Express middleware için helmet yapılandırması
 * @returns {Function} - Express middleware
 */
export function helmetMiddleware() {
  return helmet(getHelmetHeaders());
} 