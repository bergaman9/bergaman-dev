import { NextResponse } from 'next/server';
import { resolve, relative } from 'path';
import { open } from 'fs/promises';

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

    let fileHandle;
    try {
      fileHandle = await open(filePath, 'r');
      const fileStats = await fileHandle.stat();
      if (!fileStats.isFile()) {
        return new NextResponse('Not a file', { status: 404 });
      }

      const fileBuffer = await fileHandle.readFile();

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
      if (error?.code === 'ENOENT') {
        return new NextResponse('File not found', { status: 404 });
      }
      throw error;
    } finally {
      await fileHandle?.close();
    }

  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
