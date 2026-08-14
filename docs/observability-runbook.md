# Observability runbook

- Vercel Web Analytics and Speed Insights are mounted in the root layout. Review route-level LCP, INP, CLS and TTFB over 7- and 28-day windows; low-traffic values are directional.
- Public content endpoints emit structured `public_query` events with route, request ID, duration and result count. Contact delivery emits `contact_done`, `contact_email_done` or `contact_email_failed` without message content or raw personal data.
- Review Runtime Logs weekly, grouped by event, route and status. Investigate repeated `failed` events and p95 duration regressions before changing the Function region.
- The current Vercel Function region is `iad1`. Document the Atlas region before moving it and compare cold/warm p75 and p95 end-to-end latency.
- After every production deployment, smoke-test `/`, `/blog`, `/portfolio`, `/picks`, `/contact`, `/about`, `/sitemap.xml` and one database-backed blog detail. Check console errors, canonical URL, asset 404s and response security headers.
