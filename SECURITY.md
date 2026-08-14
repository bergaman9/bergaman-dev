# Security Policy

## Supported version

Only the current `main` branch and production deployment at `www.bergaman.dev` are supported. The `v1-legacy` release is archived and does not receive security updates.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting feature for this repository, or email `contact@bergaman.dev` with a concise description, affected route and reproduction steps.

Do not open a public issue containing credentials, personal data, database content or working exploit details.

## Credential response

If a credential is committed or exposed:

1. Revoke or rotate it at the provider immediately.
2. Update every deployment environment that consumes it.
3. Redeploy and verify the old credential no longer works.
4. Resolve the GitHub secret-scanning alert as revoked.
5. Review provider access logs and repository history for misuse.

Deleting a branch, tag or commit reference does not revoke a leaked credential.
