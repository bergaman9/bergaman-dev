import test from 'node:test';
import assert from 'node:assert/strict';

import {
  detectContactSpam,
  isLikelyRandomToken,
  isSuspiciousDottedGmail,
} from '../src/lib/contactSpam.js';

test('detectContactSpam blocks the observed random contact-form payload pattern', () => {
  const result = detectContactSpam({
    name: 'mdZzdJVhPnWfwEqs',
    email: 'qo.c.e.r.uq.um.u.1.1@gmail.com',
    message: 'FGxKZnpSRmMNKtXXQFzpXWIM',
  }, {
    clientIp: '109.70.100.10',
  });

  assert.equal(result.blocked, true);
  assert.equal(result.reasons.includes('random_name_and_message'), true);
  assert.equal(result.reasons.includes('dotted_gmail_random_content'), true);
});

test('detectContactSpam blocks filled honeypot fields', () => {
  const result = detectContactSpam({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'I would like to discuss a collaboration.',
    contactWebsite: 'https://spam.example',
  });

  assert.equal(result.blocked, true);
  assert.deepEqual(result.reasons, ['honeypot']);
});

test('detectContactSpam allows normal contact messages', () => {
  const result = detectContactSpam({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'Hi, I would like to discuss a portfolio project and possible collaboration next week.',
    startedAt: Date.now() - 10000,
  }, {
    clientIp: '203.0.113.10',
  });

  assert.equal(result.blocked, false);
  assert.deepEqual(result.reasons, []);
});

test('random token and dotted gmail detectors stay narrow', () => {
  assert.equal(isLikelyRandomToken('FGxKZnpSRmMNKtXXQFzpXWIM', { minLength: 16, maxLength: 32 }), true);
  assert.equal(isLikelyRandomToken('Omer Guler', { minLength: 4, maxLength: 32 }), false);
  assert.equal(isSuspiciousDottedGmail('qo.c.e.r.uq.um.u.1.1@gmail.com'), true);
  assert.equal(isSuspiciousDottedGmail('first.last@gmail.com'), false);
});
