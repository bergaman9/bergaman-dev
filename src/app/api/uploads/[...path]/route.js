import { NextResponse } from 'next/server';
import { resolve, relative } from 'path';
import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(request, { params }) {
  try {
    const { path } = await params;
    const uploadsDir = resolve(process.cwd(), 'public', 'uploads');
    const filePath = resolve(uploadsDir, ...path);

    // Security check - ensure path is within uploads directory
    const relativePath = relative(uploadsDir, filePath);
    if (relativePath.startsWith('..') || relativePath === '' || relativePath.includes('..')) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Get file stats
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) {
      return new NextResponse('Not a file', { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);

    // Determine content type based on file extension
    const fileName = path[path.length - 1];
    const ext = fileName.split('.').pop()?.toLowerCase();

    const contentTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };

    const contentType = contentTypes[ext];
    if (!contentType) {
      return new NextResponse('Unsupported file type', { status: 415 });
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileStats.size.toString(),
      },
    });

  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
