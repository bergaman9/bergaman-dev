import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { NextResponse } from 'next/server.js';
import { SECURITY, SITE_CONFIG } from './constants.js';

const DEFAULT_JWT_SECRET = 'bergaman-secret-key-please-change-in-production';
const encoder = new TextEncoder();

export function getJwtSecret() {
  const secret = SECURITY.JWT.SECRET || process.env.JWT_SECRET || '';

  if (!secret || (process.env.NODE_ENV === 'production' && secret === DEFAULT_JWT_SECRET)) {
    throw new Error('JWT_SECRET is not configured securely');
  }

  return secret;
}

export async function verifyAdminSession(request) {
  const session = request.cookies.get(SECURITY.SESSION.COOKIE_NAME)?.value;

  if (!session) {
    return { valid: false, error: 'Session cookie is missing' };
  }

  try {
    const { payload } = await jwtVerify(session, encoder.encode(getJwtSecret()), {
      algorithms: [SECURITY.JWT.ALGORITHM],
    });

    if (payload?.role !== 'admin') {
      return { valid: false, error: 'Admin role is required' };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

export async function requireAdmin(request) {
  const auth = await verifyAdminSession(request);

  if (!auth.valid) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { authorized: true, payload: auth.payload };
}

export function productionDisabledResponse() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return null;
}

export function normalizeClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const vercelIp = request.headers.get('x-vercel-forwarded-for');

  return (forwarded?.split(',')[0] || realIp || vercelIp || 'unknown').trim();
}

export function hashClientIdentifier(value = '') {
  const secret = getJwtSecret();

  return crypto
    .createHmac('sha256', secret)
    .update(String(value))
    .digest('hex');
}

export async function readJsonLimited(request, options = {}) {
  const maxBytes = options.maxBytes || 32 * 1024;
  const contentLength = Number(request.headers.get('content-length') || 0);

  if (contentLength > maxBytes) {
    throw Object.assign(new Error('Request body is too large'), { status: 413 });
  }

  const text = await request.text();
  if (Buffer.byteLength(text, 'utf8') > maxBytes) {
    throw Object.assign(new Error('Request body is too large'), { status: 413 });
  }

  try {
    return JSON.parse(text || '{}');
  } catch {
    throw Object.assign(new Error('Invalid JSON body'), { status: 400 });
  }
}

export function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function clampString(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function textToHtml(value = '') {
  return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

export function escapeRegExp(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function parseObjectId(value, fieldName = 'id') {
  if (typeof value !== 'string' || !/^[a-fA-F0-9]{24}$/.test(value)) {
    throw Object.assign(new Error(`Invalid ${fieldName}`), { status: 400 });
  }

  return value;
}

export function validateEnum(value, allowedValues, fieldName = 'value') {
  if (!allowedValues.includes(value)) {
    throw Object.assign(new Error(`Invalid ${fieldName}`), { status: 400 });
  }

  return value;
}

export function createSafeRegex(value = '', options = {}) {
  const maxLength = options.maxLength || 80;
  const flags = options.flags || 'i';
  const safeValue = escapeRegExp(clampString(value, maxLength));

  return new RegExp(safeValue, flags);
}

export function pickAllowedFields(source = {}, allowedFields = []) {
  return allowedFields.reduce((picked, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      picked[field] = source[field];
    }

    return picked;
  }, {});
}

export async function createContactReplyToken(contactId) {
  return new SignJWT({ type: 'contact_reply', contactId: String(contactId) })
    .setProtectedHeader({ alg: SECURITY.JWT.ALGORITHM })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(encoder.encode(getJwtSecret()));
}

export async function verifyContactReplyToken(token) {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(getJwtSecret()), {
      algorithms: [SECURITY.JWT.ALGORITHM],
    });

    if (payload?.type !== 'contact_reply' || !payload.contactId) {
      return { valid: false, error: 'Invalid reply token' };
    }

    return { valid: true, contactId: payload.contactId, payload };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

export function getSiteBaseUrl() {
  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url || 'https://bergaman.dev';
}

export function verifySharedSecret(request, envNames = ['WEBHOOK_SHARED_SECRET']) {
  const configuredSecret = envNames.map((name) => process.env[name]).find(Boolean);

  if (!configuredSecret) {
    return {
      valid: process.env.NODE_ENV !== 'production',
      error: 'Webhook secret is not configured',
    };
  }

  const provided = request.headers.get('x-webhook-secret') || request.headers.get('x-bergaman-signature') || '';
  const expectedBuffer = Buffer.from(configuredSecret);
  const providedBuffer = Buffer.from(provided);

  if (expectedBuffer.length !== providedBuffer.length) {
    return { valid: false, error: 'Invalid webhook secret' };
  }

  return {
    valid: crypto.timingSafeEqual(expectedBuffer, providedBuffer),
    error: 'Invalid webhook secret',
  };
}

export function jsonError(error, fallbackStatus = 400) {
  return NextResponse.json(
    { error: error.message || 'Invalid request' },
    { status: error.status || fallbackStatus }
  );
}
