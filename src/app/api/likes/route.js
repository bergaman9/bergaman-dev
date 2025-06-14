import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Basit JSON dosya tabanlı veritabanı
const dbPath = path.join(process.cwd(), 'data', 'likes.json');

// Veritabanı dosyasını oluştur
function ensureDbExists() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
  }
}

// Veritabanından veri oku
function readDb() {
  ensureDbExists();
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

// Veritabanına veri yaz
function writeDb(data) {
  ensureDbExists();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// IP adresini al
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-vercel-forwarded-for');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddr) {
    return remoteAddr;
  }
  return 'unknown';
}

// GET - Like sayısını getir
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    const db = readDb();
    const postData = db[slug] || { likes: 0, likedIPs: [] };
    
    return NextResponse.json({ 
      likes: postData.likes,
      totalLikes: postData.likes 
    });
  } catch (error) {
    console.error('Error getting likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Like ekle
export async function POST(request) {
  try {
    const { slug } = await request.json();
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const timestamp = new Date().toISOString();
    
    const db = readDb();
    
    // Post verisi yoksa oluştur
    if (!db[slug]) {
      db[slug] = {
        likes: 0,
        likedIPs: []
      };
    }

    // IP daha önce like atmış mı kontrol et
    const hasLiked = db[slug].likedIPs.some(entry => entry.ip === clientIP);
    
    if (hasLiked) {
      return NextResponse.json({ 
        error: 'Already liked',
        likes: db[slug].likes 
      }, { status: 400 });
    }

    // Like ekle
    db[slug].likes += 1;
    db[slug].likedIPs.push({
      ip: clientIP,
      userAgent: userAgent,
      timestamp: timestamp
    });

    writeDb(db);

    return NextResponse.json({ 
      success: true,
      likes: db[slug].likes,
      message: 'Like added successfully'
    });
  } catch (error) {
    console.error('Error adding like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 