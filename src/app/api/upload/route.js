import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    console.log('Upload request received');
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('Upload error: No file provided');
      return NextResponse.json({ 
        success: false,
        error: 'No file provided' 
      }, { status: 400 });
    }

    console.log(`File received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
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

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log(`Uploads directory ensured at: ${uploadsDir}`);
    } catch (error) {
      console.log('Directory might already exist:', error.message);
      // Directory might already exist
    }

    // Save file
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    console.log(`File saved to: ${filePath}`);

    // Return the public URL
    const publicUrl = `/uploads/${fileName}`;
    console.log(`File uploaded successfully: ${publicUrl}`);

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: fileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to upload file',
      details: error.message 
    }, { status: 500 });
  }
} 