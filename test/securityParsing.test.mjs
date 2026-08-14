import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getSafeHttpUrl,
  getSpotifyEmbedUrl,
  hostnameMatches,
} from '../src/lib/urlSecurity.js';
import {
  cleanEmailReply,
  extractContactId,
  extractEmailAddress,
  extractEmailDisplayName,
} from '../src/lib/emailParsing.js';

test('safe URL helpers reject executable and deceptive URLs', () => {
  assert.equal(getSafeHttpUrl('javascript:alert(1)'), null);
  assert.equal(hostnameMatches('https://github.com.attacker.example/repo', 'github.com'), false);
  assert.equal(hostnameMatches('https://github.com/bergaman9/bergaman-dev', 'github.com'), true);
});

test('Spotify embeds require an actual Spotify hostname and resource', () => {
  assert.equal(getSpotifyEmbedUrl('https://spotify.com.attacker.example/track/abc'), null);
  assert.equal(
    getSpotifyEmbedUrl('https://open.spotify.com/intl-tr/track/abc123'),
    'https://open.spotify.com/embed/track/abc123?utm_source=generator&theme=0'
  );
});

test('email parsing extracts bounded mailbox fields without permissive fallbacks', () => {
  assert.equal(extractEmailAddress('Ömer <contact@bergaman.dev>'), 'contact@bergaman.dev');
  assert.equal(extractEmailDisplayName('"Ömer" <contact@bergaman.dev>'), 'Ömer');
  assert.equal(extractEmailAddress('not-an-email'), null);
});

test('contact IDs and reply cleanup avoid unbounded regular expressions', () => {
  assert.equal(extractContactId('Re: Message [ID:507f1f77bcf86cd799439011]'), '507f1f77bcf86cd799439011');
  assert.equal(extractContactId('Re: Message [ID:not-valid]'), null);
  assert.equal(cleanEmailReply('<p>Hello</p>\n\n> quoted\nSent from my phone'), 'Hello');
});
