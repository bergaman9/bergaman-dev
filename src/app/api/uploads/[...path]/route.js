import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(request, { params }) {
  try {
    console.log('Uploads API called with params:', params);
    
    const { path } = params;
    console.log('Path array:', path);
    
    const filePath = join(process.cwd(), 'public', 'uploads', ...path);
    console.log('Full file path:', filePath);
    console.log('Current working directory:', process.cwd());
    
    // Security check - ensure path is within uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    console.log('Uploads directory:', uploadsDir);
    
    if (!filePath.startsWith(uploadsDir)) {
      console.log('Security check failed - path outside uploads directory');
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Check if file exists
    console.log('Checking if file exists:', filePath);
    const fileExists = existsSync(filePath);
    console.log('File exists:', fileExists);
    
    if (!fileExists) {
      console.log('File not found, returning 404');
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Get file stats
    console.log('Getting file stats...');
    const fileStats = await stat(filePath);
    console.log('File stats:', { size: fileStats.size, isFile: fileStats.isFile() });
    
    if (!fileStats.isFile()) {
      console.log('Not a file, returning 404');
      return new NextResponse('Not a file', { status: 404 });
    }
    
    // Read file
    console.log('Reading file...');
    const fileBuffer = await readFile(filePath);
    console.log('File read successfully, buffer length:', fileBuffer.length);
    
    // Determine content type based on file extension
    const fileName = path[path.length - 1];
    const ext = fileName.split('.').pop()?.toLowerCase();
    console.log('File name:', fileName, 'Extension:', ext);
    
    const contentTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav'
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    console.log('Content type:', contentType);
    
    console.log('Returning file with headers...');
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileStats.size.toString(),
      },
    });
    
  } catch (error) {
    console.error('Error serving file:', error);
    console.error('Error stack:', error.stack);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
} 