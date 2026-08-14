import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const routes = ['/', '/blog', '/portfolio', '/picks', '/contact', '/about'];
const baseUrl = process.env.LIGHTHOUSE_BASE_URL || 'https://www.bergaman.dev';
const outputDir = join(process.cwd(), 'reports', 'lighthouse');
const temporaryDir = join(outputDir, '.runs');
const chromeTemporaryDir = join(outputDir, '.chrome-tmp');
mkdirSync(temporaryDir, { recursive: true });
mkdirSync(chromeTemporaryDir, { recursive: true });

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const results = [];
const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';

for (const route of routes) {
  const runs = [];
  for (let index = 0; index < 3; index += 1) {
    const slug = route === '/' ? 'home' : route.slice(1);
    const outputPath = join(temporaryDir, `${slug}-${index + 1}.json`);
    const cliOutputPath = `reports/lighthouse/.runs/${slug}-${index + 1}.json`;
    if (!existsSync(outputPath)) {
      try {
        execFileSync(executable, [
          '--yes', 'lighthouse@13.4.1', `${baseUrl}${route}`,
          '--quiet', '--output=json', `--output-path=${cliOutputPath}`,
          '--only-categories=performance,accessibility,best-practices,seo',
          '--chrome-flags=--headless --no-sandbox --disable-extensions',
          '--form-factor=mobile',
        ], {
          cwd: process.cwd(),
          env: { ...process.env, TEMP: chromeTemporaryDir, TMP: chromeTemporaryDir },
          stdio: 'inherit',
          shell: process.platform === 'win32',
        });
      } catch (error) {
        if (!existsSync(outputPath)) throw error;
      }
    }
    const report = JSON.parse(readFileSync(outputPath, 'utf8'));
    runs.push({
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100),
      seo: Math.round(report.categories.seo.score * 100),
      fcpMs: Math.round(report.audits['first-contentful-paint'].numericValue),
      lcpMs: Math.round(report.audits['largest-contentful-paint'].numericValue),
      tbtMs: Math.round(report.audits['total-blocking-time'].numericValue),
      cls: Number(report.audits['cumulative-layout-shift'].numericValue.toFixed(3)),
    });
  }
  results.push({
    route,
    runs,
    median: Object.fromEntries(Object.keys(runs[0]).map((key) => [key, median(runs.map((run) => run[key]))])),
  });
}

const reportPath = join(outputDir, `${new Date().toISOString().slice(0, 10)}-mobile.json`);
writeFileSync(reportPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl, results }, null, 2)}\n`);
rmSync(temporaryDir, { recursive: true, force: true });
rmSync(chromeTemporaryDir, { recursive: true, force: true });
console.table(results.map(({ route, median: values }) => ({ route, ...values })));
console.log(`Saved ${reportPath}`);
