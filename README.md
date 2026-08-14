# Bergaman.dev

[![Production](https://img.shields.io/badge/production-www.bergaman.dev-e8c547?style=flat-square)](https://www.bergaman.dev)
[![Quality](https://github.com/bergaman9/bergaman-dev/actions/workflows/quality.yml/badge.svg)](https://github.com/bergaman9/bergaman-dev/actions/workflows/quality.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-2ea44f?style=flat-square)](LICENSE)

The source code for **Bergaman.dev**, Ömer's engineering portfolio, technical writing platform and project showcase. It brings together electrical and high-voltage engineering, full-stack product development, automation, embedded systems and AI-assisted workflows under the Bergasoft brand.

- **Live site:** [www.bergaman.dev](https://www.bergaman.dev)
- **Legacy archive:** [v1-legacy release](https://github.com/bergaman9/bergaman-dev/releases/tag/v1-legacy)

## Highlights

- Server-rendered portfolio, writing and curated picks with ISR and cached MongoDB queries
- Technical blog with canonical metadata, `BlogPosting` structured data and dynamic sitemap coverage
- High-voltage, electrical engineering, automation and software project presentation
- Bergasoft project and engineering inquiry workflow
- Private administration dashboard for content, projects, recommendations, media and contacts
- Password-protected articles with server-side verification and short-lived scoped sessions
- Vercel Analytics and Speed Insights integration
- Responsive, accessible dragon-themed interface with reduced-motion support
- Local Font Awesome subset instead of a render-blocking third-party icon CDN

## Technology

| Area | Stack |
| --- | --- |
| Application | Next.js 16 App Router, React 19, JavaScript, Tailwind CSS |
| Data | MongoDB, Mongoose, server-only cached repositories |
| Authentication | bcrypt, JOSE/JWT, secure HttpOnly cookies |
| Content | React Markdown, Marked, Remark GFM, Highlight.js |
| Email | Nodemailer |
| Observability | Vercel Analytics, Speed Insights, structured runtime logs |
| Quality | ESLint, TypeScript checking, Node test runner, Lighthouse CI |
| Hosting | Vercel, Node.js 24 |

## Architecture

Public content is rendered on the server so essential portfolio and writing content is present in the initial HTML. Interactive filtering and admin features are isolated in client components. Blog, portfolio and picks queries share cached server repositories, while admin mutations invalidate the relevant cache tags.

The application uses one canonical origin: `https://www.bergaman.dev`. `robots.txt` and `sitemap.xml` are generated through Next.js metadata routes.

## Local development

Requirements:

- Node.js 24
- npm 8 or newer
- A MongoDB database

```bash
git clone https://github.com/bergaman9/bergaman-dev.git
cd bergaman-dev
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Never commit `.env.local`, connection strings, passwords, access tokens or production exports. Use unique development credentials and store production secrets in the deployment platform.

## Environment variables

The complete placeholder list is maintained in [.env.example](.env.example). Important variables include:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Application database name |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD_HASH` | bcrypt cost-12 admin password hash; plaintext is not accepted |
| `JWT_SECRET` | Admin session signing key and contact identifier HMAC key |
| `EMAIL_USER`, `EMAIL_PASS` | Contact notification transport |
| `WEBHOOK_SHARED_SECRET` | Webhook authentication secret |

Generate secrets with a cryptographically secure password manager or platform secret generator. Rotate any credential immediately if it appears in a commit, log or screenshot.

## Commands

```bash
npm run dev                  # Local Turbopack development server
npm run build                # Production build
npm run lint                 # ESLint
npm run typecheck            # JavaScript/TypeScript static checking
npm test                     # Unit tests
npm run audit:prod           # Production dependency audit
npm run check                # Full local quality gate
npm run lighthouse:baseline  # Multi-route performance baseline
```

## Security model

- Admin passwords are stored only as bcrypt hashes.
- Admin sessions use signed, expiring JWTs in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
- State-changing admin requests validate their origin.
- Public APIs exclude private, member-only and protected content fields.
- Rate limits use a shared MongoDB-backed store suitable for serverless deployments.
- Contact IP addresses are HMAC-pseudonymized and retained for a limited period.
- Uploaded images are validated, resized and converted before storage.
- Security headers and Content Security Policy are configured centrally.

Please report security issues privately through the contact address below. Do not open a public issue containing credentials or exploit details.

## Deployment and releases

Pushes to `main` are built and deployed by the native Vercel Git integration. GitHub Actions independently runs the quality gate. Releases are intentionally curated instead of being generated for every deployment.

- `v2.8.0` — current maintained release line
- `v1-legacy` — archived original site; not maintained

The production environment is [www.bergaman.dev](https://www.bergaman.dev). Preview deployments are temporary and must not contain production-only secrets unless explicitly required.

## Repository policy

- `main` is the only long-lived branch.
- Use short-lived feature branches and remove them after integration.
- Keep pull requests focused and close superseded dependency updates.
- Never commit generated environment files, credentials or database exports.
- Run `npm run check` before merging.

## Author and contact

Built and maintained by **Ömer** under the **Bergasoft** brand.

- Website: [www.bergaman.dev](https://www.bergaman.dev)
- GitHub: [@bergaman9](https://github.com/bergaman9)
- LinkedIn: [Ömer](https://www.linkedin.com/in/omerguler/)
- Email: [contact@bergaman.dev](mailto:contact@bergaman.dev)

For software, automation, electrical engineering or technical product work, use the [project inquiry form](https://www.bergaman.dev/contact).

## License

Licensed under the [MIT License](LICENSE).
