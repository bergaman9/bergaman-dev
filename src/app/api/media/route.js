import { NextResponse } from 'next/server';
import { readdir, unlink } from 'fs/promises';
import path from 'path';
import { requireAdmin, readJsonLimited } from '@/lib/serverSecurity';

export async function GET(request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.authorized) return admin.response;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    let files = [];
    try {
      files = await readdir(uploadsDir);
    } catch {
      // Directory doesn't exist or is empty
      return NextResponse.json({ images: [] });
    }

    // Filter for image files and convert to URLs
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const images = files
      .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)))
      .map(file => `/uploads/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({
      error: 'Failed to fetch media'
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.authorized) return admin.response;

    const { images } = await readJsonLimited(request, { maxBytes: 16 * 1024 });

    if (!images || !Array.isArray(images)) {
      return NextResponse.json({
        error: 'Invalid images array'
      }, { status: 400 });
    }

    const results = [];

    for (const imageUrl of images) {
      try {
        // Extract filename from URL
        const filename = path.basename(imageUrl);
        const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
        const filePath = path.resolve(uploadsDir, filename);

        if (!filePath.startsWith(`${uploadsDir}${path.sep}`)) {
          throw new Error('Invalid media path');
        }

        await unlink(filePath);
        results.push({ url: imageUrl, deleted: true });
      } catch (error) {
        console.error(`Error deleting ${imageUrl}:`, error);
        results.push({ url: imageUrl, deleted: false, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({
      error: 'Failed to delete media'
    }, { status: 500 });
  }
}
