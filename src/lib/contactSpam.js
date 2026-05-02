const CONFIRMED_SPAM_IPS = new Set([
  '37.114.63.5',
  '45.66.35.33',
  '45.84.107.97',
  '45.84.107.128',
  '45.84.107.182',
  '45.138.16.107',
  '45.141.119.79',
  '77.238.230.6',
  '80.85.246.217',
  '80.85.247.161',
  '88.210.10.79',
  '92.243.24.163',
  '109.70.100.9',
  '109.70.100.10',
  '158.174.210.97',
  '171.25.193.235',
  '185.220.100.242',
  '185.220.100.244',
  '185.220.101.4',
  '185.220.101.20',
  '185.220.101.27',
  '185.220.101.42',
  '185.220.101.49',
  '185.220.101.147',
  '185.220.101.154',
  '185.231.33.38',
  '185.241.208.82',
  '195.200.26.27',
  '196.196.200.100',
  '204.137.14.104',
]);

const HONEYPOT_FIELDS = ['website', 'company', 'url', 'fax', 'contactWebsite'];

function getTokenStats(value = '') {
  const text = String(value).trim();

  return {
    text,
    upper: (text.match(/[A-Z]/g) || []).length,
    lower: (text.match(/[a-z]/g) || []).length,
    digits: (text.match(/[0-9]/g) || []).length,
    spaces: (text.match(/\s/g) || []).length,
    vowels: (text.match(/[aeiouAEIOU]/g) || []).length,
  };
}

export function isLikelyRandomToken(value, options = {}) {
  const minLength = options.minLength || 12;
  const maxLength = options.maxLength || 40;
  const stats = getTokenStats(value);

  if (stats.text.length < minLength || stats.text.length > maxLength) return false;
  if (stats.spaces > 0) return false;
  if (!/^[A-Za-z0-9]+$/.test(stats.text)) return false;
  if (stats.upper < 2 || stats.lower < 2) return false;

  const vowelRatio = stats.vowels / Math.max(1, stats.text.length - stats.digits);
  return stats.digits > 0 || vowelRatio < 0.45;
}

export function isSuspiciousDottedGmail(email = '') {
  const [localPart, domain] = String(email).trim().toLowerCase().split('@');

  if (domain !== 'gmail.com' || !localPart) return false;

  const parts = localPart.split('.');
  const shortParts = parts.filter((part) => part.length > 0 && part.length <= 4).length;

  return parts.length >= 4 && shortParts >= 3;
}

function hasFilledHoneypot(payload = {}) {
  return HONEYPOT_FIELDS.some((field) => typeof payload[field] === 'string' && payload[field].trim().length > 0);
}

function isTooFastSubmission(startedAt, now) {
  if (startedAt === undefined || startedAt === null || startedAt === '') return false;

  const startedAtMs = Number(startedAt);
  if (!Number.isFinite(startedAtMs)) return true;

  return now - startedAtMs < 2500;
}

export function detectContactSpam(payload = {}, options = {}) {
  const now = options.now || Date.now();
  const clientIp = options.clientIp || '';
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const message = String(payload.message || '').trim();
  const reasons = [];

  if (hasFilledHoneypot(payload)) reasons.push('honeypot');
  if (isTooFastSubmission(payload.startedAt, now)) reasons.push('too_fast');
  if (CONFIRMED_SPAM_IPS.has(clientIp)) reasons.push('confirmed_spam_ip');

  const randomName = isLikelyRandomToken(name, { minLength: 12, maxLength: 32 });
  const randomMessage = isLikelyRandomToken(message, { minLength: 16, maxLength: 32 });
  const dottedGmail = isSuspiciousDottedGmail(email);

  if (randomName && randomMessage) reasons.push('random_name_and_message');
  if (dottedGmail && (randomName || randomMessage)) reasons.push('dotted_gmail_random_content');

  return {
    blocked: reasons.length > 0,
    reasons,
  };
}
