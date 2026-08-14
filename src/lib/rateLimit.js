import { NextResponse } from 'next/server';
import { SECURITY } from './constants';
import { hashClientIdentifier, normalizeClientIp } from './serverSecurity';
import { connectDB } from './mongodb';
import RateLimit from '@/models/RateLimit';

function rateLimitKey(identifier, action, windowMs) {
  const bucket = Math.floor(Date.now() / windowMs);
  return hashClientIdentifier(`${action}:${identifier}:${bucket}`);
}

async function readRecord(identifier, action, windowMs) {
  await connectDB();
  const key = rateLimitKey(identifier, action, windowMs);
  return RateLimit.findOne({ key }).lean();
}

async function incrementRecord(identifier, action, windowMs) {
  await connectDB();
  const key = rateLimitKey(identifier, action, windowMs);
  const expiresAt = new Date((Math.floor(Date.now() / windowMs) + 1) * windowMs);
  try {
    return await RateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, new: true, lean: true },
    );
  } catch (error) {
    if (error?.code !== 11000) throw error;
    return RateLimit.findOneAndUpdate({ key }, { $inc: { count: 1 } }, { new: true, lean: true });
  }
}

export function createRateLimiter(options = {}) {
  const limit = options.limit || SECURITY.RATE_LIMIT.API_LIMIT;
  const windowMs = options.windowMs || SECURITY.RATE_LIMIT.API_WINDOW;
  const message = options.message || { error: 'Too many requests, please try again later.' };
  const configuredAction = options.action;
  const failClosed = options.failClosed === true;

  return async function rateLimiterMiddleware(request) {
    try {
      const identifier = normalizeClientIp(request);
      const action = configuredAction || new URL(request.url).pathname;
      const record = await incrementRecord(identifier, action, windowMs);
      if (record.count <= limit) return null;

      const retryAfter = Math.max(1, Math.ceil((new Date(record.expiresAt).getTime() - Date.now()) / 1000));
      return NextResponse.json(message, {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(new Date(record.expiresAt).getTime() / 1000)),
        },
      });
    } catch (error) {
      console.error('Distributed rate limiter error:', error.message);
      return failClosed
        ? NextResponse.json({ error: 'Request validation is temporarily unavailable' }, { status: 503 })
        : null;
    }
  };
}

export function withRateLimit(handler, options = {}) {
  const limiter = createRateLimiter(options);
  return async function rateProtectedHandler(request, ...args) {
    const limitResult = await limiter(request);
    return limitResult || handler(request, ...args);
  };
}

export async function checkIPRateLimit(ip, action, options = {}) {
  const limit = options.limit || SECURITY.RATE_LIMIT.MAX_LOGIN_ATTEMPTS;
  const windowMs = options.windowMs || SECURITY.RATE_LIMIT.LOCKOUT_DURATION;
  try {
    const record = await readRecord(ip, action, windowMs);
    const count = record?.count || 0;
    if (count >= limit) {
      const remainingTime = Math.max(1, Math.ceil((new Date(record.expiresAt).getTime() - Date.now()) / 60000));
      return { allowed: false, message: `Too many ${action} attempts. Please try again after ${remainingTime} minutes.`, remainingTime };
    }
    return { allowed: true, remaining: Math.max(0, limit - count), limit };
  } catch (error) {
    console.error('Login rate-limit check failed:', error.message);
    return { allowed: false, message: 'Login validation is temporarily unavailable', remainingTime: 1 };
  }
}

export function recordFailedAttempt(ip, action, options = {}) {
  return incrementRecord(ip, action, options.windowMs || SECURITY.RATE_LIMIT.LOCKOUT_DURATION);
}

export async function resetAttempts(ip, action, options = {}) {
  const windowMs = options.windowMs || SECURITY.RATE_LIMIT.LOCKOUT_DURATION;
  await connectDB();
  await RateLimit.deleteOne({ key: rateLimitKey(ip, action, windowMs) });
}
