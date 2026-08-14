# Security operations

## Admin credential rotation

1. Generate a unique random password locally; never paste it into source control, issues, logs, screenshots, or chat history.
2. Hash it with bcrypt cost 12 and set only `ADMIN_PASSWORD_HASH` in Vercel Production, Preview, and Development.
3. Generate at least 48 random bytes for `JWT_SECRET` and rotate it in the same environments. This immediately invalidates existing admin and protected-post sessions.
4. Remove legacy `ADMIN_PASSWORD`, `ADMIN_PASSWORD_PBKDF2_HASH`, and `ADMIN_PASSWORD_SALT` variables.
5. Redeploy, verify the new password works, verify the previous password fails, and verify an old session cookie is rejected.
6. Deliver the password through a password manager or another out-of-band encrypted channel.

The application fails closed when `ADMIN_PASSWORD_HASH` is absent or is not a bcrypt hash with cost 10–12. Plaintext and non-bcrypt fallbacks are intentionally unsupported.

## Protected blog posts

Protected-post passwords are stored only as bcrypt hashes. Successful unlock creates a slug-scoped, HttpOnly, SameSite=Strict cookie with a 15-minute lifetime. Rotating `JWT_SECRET` invalidates all active unlock cookies.

## Rate limiting

Public mutation endpoints use a MongoDB-backed atomic counter with TTL records, so limits are shared across Vercel function instances. General public endpoints fail open if the rate-limit store is unavailable to preserve availability; admin login’s failed-attempt check fails closed.
