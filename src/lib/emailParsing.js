import sanitizeHtml from 'sanitize-html';
import { clampString, validateEmail } from './serverSecurity.js';

function stripQuotes(value) {
  return value.split('"').join('').split("'").join('').trim();
}

function trimEmailToken(value) {
  const removable = new Set(['<', '>', '(', ')', '[', ']', '"', "'"]);
  let start = 0;
  let end = value.length;
  while (start < end && removable.has(value[start])) start++;
  while (end > start && removable.has(value[end - 1])) end--;
  return value.slice(start, end);
}

export function extractEmailAddress(input) {
  const value = clampString(input, 512).trim();
  if (!value) return null;

  const open = value.indexOf('<');
  const close = open >= 0 ? value.indexOf('>', open + 1) : -1;
  if (open >= 0 && close > open + 1) {
    const bracketed = value.slice(open + 1, close).trim().toLowerCase();
    if (validateEmail(bracketed)) return bracketed;
  }

  for (const token of value.split(/[\s,;]+/u)) {
    const candidate = trimEmailToken(token).toLowerCase();
    if (validateEmail(candidate)) return candidate;
  }

  return null;
}

export function extractEmailDisplayName(input) {
  const value = clampString(input, 512).trim();
  if (!value) return null;

  const open = value.indexOf('<');
  if (open > 0) {
    return stripQuotes(value.slice(0, open)).slice(0, 120) || null;
  }

  const email = extractEmailAddress(value);
  return email ? email.slice(0, email.indexOf('@')) : stripQuotes(value).slice(0, 120) || null;
}

export function extractContactId(subject) {
  const value = clampString(subject, 512);
  const marker = '[ID:';
  const start = value.toUpperCase().indexOf(marker);
  if (start < 0) return null;

  const candidate = value.slice(start + marker.length, start + marker.length + 24);
  const close = value[start + marker.length + 24];
  const isHex = candidate.length === 24 && [...candidate].every((character) => {
    const code = character.toLowerCase().charCodeAt(0);
    return (code >= 48 && code <= 57) || (code >= 97 && code <= 102);
  });

  return isHex && close === ']' ? candidate : null;
}

export function cleanEmailReply(input, maxLength = 20_000) {
  const plainText = sanitizeHtml(clampString(input, maxLength * 2), {
    allowedTags: [],
    allowedAttributes: {},
  }).split('\r').join('');

  const output = [];
  let previousBlank = false;
  for (const originalLine of plainText.split('\n')) {
    const line = originalLine.trim();
    const lower = line.toLowerCase();
    if (
      line.startsWith('--') ||
      line.startsWith('___') ||
      line.startsWith('---------- Forwarded message') ||
      line.startsWith('Begin forwarded message:') ||
      line.startsWith('From:') ||
      line.startsWith('Sent:') ||
      line.startsWith('To:') ||
      line.startsWith('Subject:') ||
      lower.includes('wrote:') ||
      lower.startsWith('sent from my ')
    ) {
      break;
    }
    if (line.startsWith('>') || line.startsWith('&gt;')) continue;

    const isBlank = line.length === 0;
    if (isBlank && previousBlank) continue;
    output.push(originalLine);
    previousBlank = isBlank;
  }

  return output.join('\n').trim().slice(0, maxLength);
}
