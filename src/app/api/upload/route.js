import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/serverSecurity';

const ALLOWED_TYPES = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

function hasValidImageSignature(buffer, mimeType) {
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === 'image/png') {
    return buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimeType === 'image/gif') {
    const signature = buffer.subarray(0, 6).toString('ascii');
    return signature === 'GIF87a' || signature === 'GIF89a';
  }
  if (mimeType === 'image/webp') {
    return buffer.length > 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  return false;
}

export async function POST(request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin.authorized) return admin.response;

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('Upload error: No file provided');
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES[file.type]) {
      console.error(`Upload error: Invalid file type: ${file.type}`);
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.'
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error(`Upload error: File size too large: ${file.size} bytes`);
      return NextResponse.json({
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!hasValidImageSignature(buffer, file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid image content.'
      }, { status: 400 });
    }

    // Create unique filename
    const fileName = `${crypto.randomUUID()}${ALLOWED_TYPES[file.type]}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }

    // Save file
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file',
      details: error.message
    }, { status: 500 });
  }
}
