import 'dotenv/config';
import mongoose from 'mongoose';
import { blogPosts } from '../src/data/blogPosts.js';

const staticSlugs = blogPosts.map((post) => post.slug);
const duplicateStatic = staticSlugs.filter((slug, index) => staticSlugs.indexOf(slug) !== index);

if (duplicateStatic.length) {
  console.error(`Duplicate static blog slugs: ${[...new Set(duplicateStatic)].join(', ')}`);
  process.exitCode = 1;
}

if (process.env.MONGODB_URI) {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  const databaseSlugs = await mongoose.connection.collection('blogposts').distinct('slug');
  const overlaps = staticSlugs.filter((slug) => databaseSlugs.includes(slug));
  if (overlaps.length) {
    console.warn(`Static/database overlaps (database takes precedence): ${overlaps.join(', ')}`);
  }
  await mongoose.disconnect();
}

if (!process.exitCode) console.log(`Validated ${staticSlugs.length} static blog slugs.`);
