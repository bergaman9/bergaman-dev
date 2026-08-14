import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const sourceRoot = join(root, 'src');
const packageRoot = join(root, 'node_modules', '@fortawesome', 'fontawesome-free');
const outputCssDir = join(root, 'public', 'icons');
const outputFontDir = join(root, 'public', 'webfonts');

function sourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : /\.(?:js|jsx|ts|tsx)$/.test(name) ? [path] : [];
  });
}

const usedClasses = new Set();
for (const file of sourceFiles(sourceRoot)) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(/\bfa-[a-z0-9-]+\b/g)) usedClasses.add(match[0]);
}

const css = readFileSync(join(packageRoot, 'css', 'all.min.css'), 'utf8');
const unicodes = new Set(['20']);
for (const rule of css.matchAll(/([^{}]+)\{--fa:"\\([0-9a-f]+)"\}/gi)) {
  const selectors = [...rule[1].matchAll(/\.((?:fa|fab|fas|far)-[a-z0-9-]+)/g)].map((match) => match[1]);
  if (selectors.some((selector) => usedClasses.has(selector))) unicodes.add(rule[2]);
}

mkdirSync(outputCssDir, { recursive: true });
mkdirSync(outputFontDir, { recursive: true });
writeFileSync(join(outputCssDir, 'fontawesome.min.css'), css.replace(/\/\*# sourceMappingURL=.*?\*\//g, ''));

const unicodeArg = [...unicodes].map((value) => `U+${value}`).join(',');
for (const font of ['fa-solid-900.woff2', 'fa-regular-400.woff2', 'fa-brands-400.woff2']) {
  execFileSync('pyftsubset', [
    join(packageRoot, 'webfonts', font),
    `--unicodes=${unicodeArg}`,
    '--flavor=woff2',
    '--layout-features=*',
    `--output-file=${join(outputFontDir, font)}`,
  ], { stdio: 'inherit' });
}
cpSync(join(packageRoot, 'webfonts', 'fa-v4compatibility.woff2'), join(outputFontDir, 'fa-v4compatibility.woff2'));
console.log(`Font Awesome subset generated for ${usedClasses.size} classes and ${unicodes.size} glyphs.`);
