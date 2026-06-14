// One-off image optimizer. Re-encodes oversized public images IN PLACE
// (same path + extension, so DB/image references keep working) and downscales
// only when an image is wider than its display target. Sources live in git, so
// this is recoverable if a result ever looks off.
//
// Run: node scripts/optimize-images.mjs

import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname, dirname, basename } from 'node:path';
import sharp from 'sharp';

// dir -> max width in px (poster art is small on screen; banners larger)
const TARGETS = [
  { dir: 'public/images/movies', maxW: 600 },
  { dir: 'public/images/games', maxW: 600 },
  { dir: 'public/images/books', maxW: 600 },
  { dir: 'public/images/posts', maxW: 1280 },
  { dir: 'public/images/mini-apps', maxW: 1280 },
  { dir: 'public/images/vocabulary', maxW: 1280 },
  { dir: 'public/images/projects', maxW: 1280 },
  { dir: 'public/images/portfolio', maxW: 1280 },
  { dir: 'public/uploads', maxW: 1600 },
];

const EXATS = new Set(['.jpg', '.jpeg', '.png']);
const QUALITY = 82;

let totalBefore = 0;
let totalAfter = 0;
let changed = 0;

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (EXATS.has(extname(e.name).toLowerCase())) files.push(p);
  }
  return files;
}

async function optimize(file, maxW) {
  const ext = extname(file).toLowerCase();
  const before = (await stat(file)).size;
  const img = sharp(file, { failOn: 'none' });
  const meta = await img.metadata();

  const pipeline = sharp(file, { failOn: 'none' }).rotate();
  if (meta.width && meta.width > maxW) {
    pipeline.resize({ width: maxW, withoutEnlargement: true });
  }
  if (ext === '.png') {
    pipeline.png({ compressionLevel: 9, palette: true, quality: QUALITY });
  } else {
    pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
  }

  const tmp = join(dirname(file), `.tmp-${basename(file)}`);
  await pipeline.toFile(tmp);
  const after = (await stat(tmp)).size;

  // Keep the smaller of the two; never replace with something bigger.
  if (after < before) {
    await rename(tmp, file);
    totalBefore += before;
    totalAfter += after;
    changed += 1;
    console.log(`  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB  ${file}`);
  } else {
    await unlink(tmp);
  }
}

for (const { dir, maxW } of TARGETS) {
  const files = await walk(dir);
  for (const f of files) {
    try {
      await optimize(f, maxW);
    } catch (err) {
      console.warn(`  skip ${f}: ${err.message}`);
    }
  }
}

console.log(
  `\nOptimized ${changed} files. ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB ` +
  `(saved ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB)`
);
