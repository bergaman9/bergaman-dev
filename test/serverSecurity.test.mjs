import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clampString,
  createSafeRegex,
  parseObjectId,
  pickAllowedFields,
  validateEnum,
} from '../src/lib/serverSecurity.js';

test('parseObjectId accepts canonical Mongo ObjectId strings', () => {
  assert.equal(parseObjectId('507f1f77bcf86cd799439011'), '507f1f77bcf86cd799439011');
});

test('parseObjectId rejects non-canonical identifiers with a 400 status', () => {
  assert.throws(
    () => parseObjectId('../507f1f77bcf86cd799439011'),
    (error) => error.status === 400 && error.message === 'Invalid id'
  );
});

test('validateEnum only accepts allowlisted values', () => {
  assert.equal(validateEnum('published', ['draft', 'published'], 'status'), 'published');
  assert.throws(
    () => validateEnum('admin', ['draft', 'published'], 'status'),
    (error) => error.status === 400 && error.message === 'Invalid status'
  );
});

test('createSafeRegex escapes regex metacharacters and clamps search text', () => {
  const regex = createSafeRegex('.*admin@example.com', { maxLength: 7 });

  assert.equal(regex.test('xx.*adminxx'), true);
  assert.equal(regex.test('xxZZadminxx'), false);
});

test('pickAllowedFields drops unknown import or API fields', () => {
  const picked = pickAllowedFields(
    {
      name: 'Ada',
      email: 'ada@example.com',
      role: 'admin',
    },
    ['name', 'email']
  );

  assert.deepEqual(picked, {
    name: 'Ada',
    email: 'ada@example.com',
  });
});

test('clampString normalizes non-string values to an empty string', () => {
  assert.equal(clampString(null, 20), '');
});
